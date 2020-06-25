import { EventEmitter } from 'events';
import { Client, Message } from 'discord.js';

export class ChocoBotCore extends EventEmitter {
  private client: Client;
  private options: ChocoBotOptions;

  public constructor(options: ChocoBotOptions) {
    super();

    this.options = options;
    this.client = new Client();

    if (this.options.plugins) {
      this.register(...this.options.plugins);
    }

    this.client.on('message', (message) =>
      this.emit('message', message),
    );

    this.client.on('ready', () => this.emit('ready'));

    this.login();
  }

  public async login(): Promise<void> {
    await this.client.login(this.options.token);
  }

  register(...plugins: ChocoPlugin[]): void {
    plugins.forEach((plugin) => plugin.register(this));
  }

  destroy(): void {
    this.client.destroy();
  }
}

export interface ChocoBotCore {
  on(event: 'ready', listener: () => void): this;
  on(event: 'message', listener: (message: Message) => void): this;

  once(event: 'ready', listener: () => void): this;
  once(event: 'message', listener: (message: Message) => void): this;
}

export interface ChocoPlugin {
  register(bot: ChocoBotCore): void;
}

export interface ChocoBotOptions {
  /**
   * The Discore Bot Token.
   */
  token: string;

  /**
   * The plugins to register.
   */
  plugins?: ChocoPlugin[];
}
