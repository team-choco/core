import readline from 'readline';

import { ChocoPlatform, ChocoMessage, ChocoUser, ChocoMessageOptions, ChocoStatus } from '@team-choco/core';

import { convertChocoMessageOptionsToContent } from './utils/converter';
import { ChocoShellPlatformInternalOptions, ChocoShellPlatformOptions } from './types';

export class ChocoShellPlatform extends ChocoPlatform {
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

  protected async pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessage> {
    const info = this.info();

    const content = convertChocoMessageOptionsToContent(options);

    this.write(this.options.name, content);

    const id = this.counters.message++;

    return {
      id: id.toString(),
      author: {
        id: info.id,
        username: info.username,
      },
      content: content,
      reply: this.send.bind(this, channelID),
      react: async (emoji: string) => {
        this.write('SYSTEM', `${this.who(this.options.name)} reacted with "${emoji}" to message "${id}".`)
      }
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

    const id = this.counters.message++;

    this.emit('message', {
      id: id.toString(),
      author: {
        id: who || this.options.whoami,
        username: who || this.options.whoami,
      },
      content: content.trim(),
      reply: this.send.bind(this, ''),
      react: async (emoji: string) => {
        this.write('SYSTEM', `${this.who(this.options.name)} reacted with "${emoji}" to message "${id}".`)
      }
    });
  }

  private async clear(line: number) {
    await new Promise((resolve) => readline.moveCursor(process.stdout, 0, line, resolve));

    await new Promise((resolve) => readline.clearLine(process.stdout, 0, resolve));
  }

  private who(who: string) {
    return `<${who}>`;
  }

  private write(who: string, message: string) {
    for (const content of message.split('\n')) {
      console.log(`${this.who(who)}: ${content}`);
    }
  }
}
