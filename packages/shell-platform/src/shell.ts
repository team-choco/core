import readline from 'readline';

import { ChocoPlatform, ChocoUser, ChocoMessageOptions, ChocoStatus, ChocoMessageServer } from '@team-choco/core';

import { convertChocoMessageOptionsToContent } from './utils/converter';
import { ChocoShellPlatformInternalOptions, ChocoShellPlatformOptions } from './types';

export class ChocoShellPlatform extends ChocoPlatform {
  private options: ChocoShellPlatformInternalOptions;
  private rl: readline.Interface;

  constructor(options: ChocoShellPlatformOptions) {
    super();
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

  protected async pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessageServer> {
    const info = this.info();

    const content = convertChocoMessageOptionsToContent(options);

    this.write(this.options.name, content);

    return {
      author: {
        id: info.id,
        username: info.username,
      },
      type: 'server',
      server_id: '',
      content: content,
      reply: this.send.bind(this, channelID),
    };
  }

  async status(status: ChocoStatus, activity: string): Promise<void> {
    this.write('SYSTEM', `Status updated to "${status}".`);
    this.write('SYSTEM', `Activity updated to "${activity}".`);
  }

  async destroy(): Promise<void> {
    this.rl.close();
  }

  private async onMessage(message: string) {
    const match = message.match(/^(?:<([^>]+)>:)?(.+)/);

    if (!match) return;

    const [, who, content] = match;

    if ([this.options.name, this.options.whoami].includes(who)) return;

    // Handle it!
    if (!who) {
      await this.clear(-1);
      this.write(this.options.whoami, content);
    }

    this.emit('message', {
      type: 'server',
      server_id: '',
      author: {
        id: who || this.options.whoami,
        username: who || this.options.whoami,
      },
      content: content.trim(),
      reply: this.send.bind(this, ''),
    } as ChocoMessageServer);
  }

  private async clear(line: number) {
    await new Promise((resolve) => readline.moveCursor(process.stdout, 0, line, resolve));

    await new Promise((resolve) => readline.clearLine(process.stdout, 0, resolve));
  }

  private write(who: string, message: string) {
    for (const content of message.split('\n')) {
      this.rl.write(`<${who}>: ${content}\n`);
    }
  }
}
