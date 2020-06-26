import { EventEmitter } from 'events';

export abstract class ChocoPlatform extends EventEmitter {
  /**
   * Pulls down the bots user information.
   * @returns the bot user info.
   */
  public abstract info(): (null|ChocoUser);
  public abstract info(required: true): ChocoUser;
  public abstract info(required?: boolean): (null|ChocoUser);

  /**
   * Authenticates the user with the platform.
   */
  public abstract login(): Promise<void>;

  /**
   * Sends a message.
   *
   * @param channelID - the id of the channel to send the message to.
   * @param message - the message to send.
   * @returns the updated message
   */
  public abstract send(channelID: string, message: string): Promise<ChocoMessage>;

  /**
   * Destroys all of the client connections.
   */
  public abstract destroy(): Promise<void>;
}

export interface ChocoPlatform {
  emit(event: 'message', message: ChocoMessage): boolean;
  emit(event: 'ready'): boolean;

  on(event: 'message', listener: (message: ChocoMessage) => void): this;
  on(event: 'ready', listener: () => void): this;
}

export interface ChocoUser {
  /**
   * The ID of the bot.
   */
  id: string;

  /**
   * The username of the bot.
   */
  username: string;
}


export interface ChocoMessage {
  /**
   * The Author of the message.
   */
  author: ChocoUser;

  /**
   * The content of the message.
   */
  content: string;

  /**
   * Replies to the given message.
   * @param message - the message you wish to send.
   * @returns the new message
   */
  reply(message: string): Promise<ChocoMessage>;
}
