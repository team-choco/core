import readline from 'readline';

import { ChocoPlatform, ChocoMessageServer, ChocoUser, ChocoMessageOptions, ChocoStatus } from '@team-choco/core';

import { convertChocoMessageOptionsToContent } from './utils/converter';
import { ChocoShellPlatformInternalOptions, ChocoShellPlatformOptions } from './types';

export const CHANNEL_ID = 'channel-id';

export class ChocoShellPlatform extends ChocoPlatform {
  private messages: ChocoMessageServer[] = [];

  private counters: {
    message: number;
    reactions: number;
  };

  private options: ChocoShellPlatformInternalOptions;
  private rl: readline.Interface;

  constructor(options: ChocoShellPlatformOptions) {
    super();

    this.counters = {
      message: 0,
      reactions: 0,
    };

    this.options = {
      whoami: 'User',
      ...options,
    };

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.onMessage = this.onMessage.bind(this);
  }

  info(): ChocoUser {
    return {
      id: this.options.name,
      username: this.options.name,
    };
  }

  async login(): Promise<void> {
    this.rl.on('line', this.onMessage);

    await new Promise((resolve) => setTimeout(resolve, 0));

    this.emit('ready');
  }

  message(serverID: string, channelID: string, messageID: string): Promise<ChocoMessageServer | null> {
    throw new Error('Method not implemented.');
  }

  protected async pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessageServer> {
    const info = this.info();

    const content = convertChocoMessageOptionsToContent(options);

    const id = (this.counters.message++).toString();

    this.write(this.options.name, content, id);

    const message: ChocoMessageServer = {
      id: id,
      type: 'server',
      server_id: '',
      author: {
        id: info.id,
        username: info.username,
      },
      content: content,
      reply: this.send.bind(this, channelID),
      edit: this.edit.bind(this, channelID, id),
      react: this.react.bind(this, channelID, id),
    };

    this.messages.push(message);

    return message;
  }

  protected async pristineEdit(channelID: string, messageID: string, options: ChocoMessageOptions): Promise<ChocoMessageServer> {
    options.content = options.content ? `EDIT: ${options.content}` : 'EDIT';

    const info = this.info();

    const content = convertChocoMessageOptionsToContent(options);

    this.write(this.options.name, content, messageID);

    const message: ChocoMessageServer = {
      id: messageID,
      type: 'server',
      server_id: '',
      author: {
        id: info.id,
        username: info.username,
      },
      content: content,
      reply: this.send.bind(this, channelID),
      edit: this.edit.bind(this, channelID, messageID),
      react: this.react.bind(this, channelID, messageID),
    };

    this.messages.push(message);

    return message;
  }

  protected async pristineReact(messageID: string, emoji: string): Promise<void> {
    this.write('SYSTEM', `${this.prefix(this.options.name)} reacted with "${emoji}" to message "${messageID}".`)
  }

  async status(status: ChocoStatus, activity: string): Promise<void> {
    this.write('SYSTEM', `Status updated to "${status}".`);
    this.write('SYSTEM', `Activity updated to "${activity}".`);
  }

  async destroy(): Promise<void> {
    this.rl.close();
  }

  private async onMessage(message: string) {
    const match = message.match(/^(?:\[(\d+)\])?(?:<([^>]+)>:)?(.+)/);

    if (!match) return;

    const [, , who, content] = match;

    if ([this.options.name, this.options.whoami].includes(who)) return;

    const id = (this.counters.message++).toString();

    // Handle it!
    if (!who) {
      await this.clear(-1);
      this.write(this.options.whoami, content, id);
    }

    const author = who || this.options.whoami;

    const chocoMessage: ChocoMessageServer = {
      id: id,
      type: 'server',
      server_id: '',
      author: {
        id: author,
        username: author,
      },
      content: content.trim(),
      reply: this.send.bind(this, CHANNEL_ID),
      edit: this.edit.bind(this, CHANNEL_ID, id),
      react: this.react.bind(this, CHANNEL_ID, id),
    };

    this.messages.push(chocoMessage);

    this.emit('message', chocoMessage);
  }

  private async clear(line: number) {
    await new Promise((resolve) => readline.moveCursor(process.stdout, 0, line, () => resolve(undefined)));

    await new Promise((resolve) => readline.clearLine(process.stdout, 0, () => resolve(undefined)));
  }

  private prefix(who: string, id?: string) {
    if (id) {
      return `[${id}] <${who}>`;
    }

    return `<${who}>`;
  }

  private write(who: string, message: string, id?: string) {
    for (const content of message.split('\n')) {
      console.log(`${this.prefix(who, id)}: ${content}`);
    }
  }
}
