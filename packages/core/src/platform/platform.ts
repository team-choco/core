import { EventEmitter } from 'events';
import { ChocoUser, ChocoMessage, ChocoRawMessageOptions, ChocoMessageOptions, ChocoStatus} from './types';

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
   * @param options - the message to send.
   * @returns the updated message
   */
  public send(channelID: string, options: (string|ChocoRawMessageOptions)): Promise<ChocoMessage> {
    return this.pristineSend(channelID, this.normalize(options));
  }

  /**
   * Edits a message.
   *
   * @param messageID - the id of the message to edit.
   * @param options - the updated message.
   * @returns the updated message
   */
  public edit(channelID: string, messageID: string, options: (string|ChocoRawMessageOptions)): Promise<ChocoMessage> {
    return this.pristineEdit(channelID, messageID, this.normalize(options));
  }

  /**
   * Reacts to the message.
   *
   * @param messageID - the id of the message to react to.
   * @param emoji - the emoji to react with.
   */
  public async react(channelID: string, messageID: string, emoji: string): Promise<void> {
    await this.pristineReact(channelID, messageID, emoji);
  }

  /**
   * Normalizes the message options.
   *
   * @param options - The raw message options.
   * @returns the normalized message options.
   */
  private normalize(options: (string|ChocoRawMessageOptions)): ChocoMessageOptions {
    if (typeof options === 'string') {
      return this.normalize({
        content: options,
      });
    }

    return {
      ...options,
      embed: options.embed ? {
        ...options.embed,
        title: typeof (options.embed.title) === 'string' ? {
          content: options.embed.title,
        } : options.embed.title,
      } : undefined,
    }
  }

  /**
   * Updates the bots status.
   *
   * @param status - the new status
   * @param activity - the activity message
   */
  public abstract status(status: ChocoStatus, activity: string): Promise<void>;

  /**
   * Destroys all of the client connections.
   */
  public abstract destroy(): Promise<void>;

  protected abstract pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessage>;
  protected abstract pristineEdit(channelID: string, messageID: string, options: ChocoMessageOptions): Promise<ChocoMessage>;
  protected abstract pristineReact(channelID: string, messageID: string, emoji: string): Promise<void>;
}

export interface ChocoPlatform {
  emit(event: 'message', message: ChocoMessage): boolean;
  emit(event: 'ready'): boolean;

  on(event: 'message', listener: (message: ChocoMessage) => void): this;
  on(event: 'ready', listener: () => void): this;
}
