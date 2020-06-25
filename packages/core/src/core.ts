import { EventEmitter } from 'events';
import { Client, Message } from 'discord.js';

export class Bot extends EventEmitter {
  private client: Client;
  private options: BotOptions;

  public constructor(options: BotOptions) {
    super();

    this.options = options;
    this.client = new Client();

    if (this.options.plugins) {
      this.register(...this.options.plugins);
    }

    this.client.on('message', (message) =>
      this.emit('message', message)
    );

    this.client.on('ready', () => this.emit('ready'));

    this.login();
  }

  public async login(): Promise<void> {
    await this.client.login(this.options.token);
  }

  static async new(options: BotOptions): Promise<Bot> {
    const bot = new Bot(options);

    await bot.login();

    return bot;
  }

  register(...plugins: Plugin[]): void {
    plugins.forEach((plugin) => plugin.register(this));
  }

  destroy() {
    this.client.destroy();
  }
}

export interface Bot {
  on(event: 'ready', listener: () => void): this;
  on(event: 'message', listener: (message: Message) => void): this;
}

export interface Plugin {
  register(bot: Bot): void;
}

export interface BotOptions {
    /**
     * The Discore Bot Token.
     */
    token: string;

    /**
     * The plugins to register.
     */
    plugins?: Plugin[];
}
