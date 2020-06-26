import readline from 'readline';

import { ChocoPlatform, ChocoMessage, ChocoUser } from '@team-choco/core';

export const WHOAMI = 'me';

export class ChocoShellPlatform extends ChocoPlatform {
  private options: ChocoShellPlatformOptions;
  private rl: readline.Interface;

  constructor(options: ChocoShellPlatformOptions) {
    super();
    this.options = options;

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

  async send(message: string): Promise<ChocoMessage> {
    const info = this.info();

    await this.write(this.options.name, message);

    return {
      author: {
        id: info.id,
        username: info.username,
      },
      content: message,
      reply: this.send.bind(this),
    };
  }

  async destroy(): Promise<void> {
    this.rl.close();
  }

  private async onMessage(message: string) {
    const match = message.match(/^(?:<([^>]+)>:)?(.+)/);

    if (!match) return;

    const [, who, content] = match;

    if ([this.options.name, WHOAMI].includes(who)) return;

    // Handle it!
    if (!who) {
      await this.clear(-1);
      await this.write(WHOAMI, content);
    }

    this.emit('message', {
      author: {
        id: who || WHOAMI,
        username: who || WHOAMI,
      },
      content: content.trim(),
      reply: this.send.bind(this),
    });
  }

  private async clear(line: number) {
    await new Promise((resolve) => readline.moveCursor(process.stdout, 0, line, resolve));

    await new Promise((resolve) => readline.clearLine(process.stdout, 0, resolve));
  }

  private async write(who: string, message: string) {
    this.rl.write(`<${who}>: ${message}\n`);
  }
}

export interface ChocoShellPlatformOptions {
  /**
   * The bots username.
   */
  name: string;
}
