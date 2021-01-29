import { EventEmitter } from 'events';
import { ChocoPlatform, ChocoMessage, ChocoMessageServer, ChocoMessageDM } from './platform';

export class ChocoBotCore extends EventEmitter {
  public platform: ChocoPlatform;

  public constructor(options: ChocoBotOptions) {
    super();

    this.platform = options.platform;

    if (options.plugins) {
      this.register(...options.plugins);
    }

    this.platform.on('message', (message) =>
      this.emit('message', message),
    );

    this.platform.on('ready', () =>
      this.emit('ready'),
    );

    this.login();
  }

  public async login(): Promise<void> {
    await this.platform.login();
  }

  /**
   * Returns a message that matches the given criteria.
   *
   * @param channelID - the id of the server the channel is in.
   * @param messageID - the id of the message to edit.
   */
  public message(channelID: string, messageID: string): Promise<(ChocoMessage|null)> {
    return this.platform.message(channelID, messageID);
  }

  isServerMessage(message: ChocoMessage): message is ChocoMessageServer {
    return message.type === 'server';
  }

  isDM(message: ChocoMessage): message is ChocoMessageDM {
    return message.type === 'dm';
  }

  register(...plugins: ChocoPlugin[]): void {
    plugins.forEach((plugin) => plugin.register(this));
  }

  destroy(): void {
    this.platform.destroy();
  }
}

export interface ChocoBotCore {
  on(event: 'ready', listener: () => void): this;
  on(event: 'message', listener: (message: ChocoMessage) => void): this;

  once(event: 'ready', listener: () => void): this;
  once(event: 'message', listener: (message: ChocoMessage) => void): this;
}

export interface ChocoPlugin {
  register(bot: ChocoBotCore): void;
}

export interface ChocoBotOptions {
  /**
   * The Platform Interface.
   */
  platform: ChocoPlatform;

  /**
   * The plugins to register.
   */
  plugins?: ChocoPlugin[];
}
