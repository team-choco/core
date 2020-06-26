import { Client, Message, TextChannel, DMChannel, Channel } from 'discord.js';

import { ChocoPlatform, ChocoMessage, ChocoUser } from '@team-choco/core';

export class ChocoDiscordPlatform extends ChocoPlatform {
  private client: Client;
  private options: ChocoDiscordPlatformOptions;

  constructor(options: ChocoDiscordPlatformOptions) {
    super();
    this.options = options;

    this.client = new Client();

    this.onMessage = this.onMessage.bind(this);
  }

  async login(): Promise<void> {
    this.client.on('message', this.onMessage);
    this.client.once('ready', () => this.emit('ready'));

    await this.client.login(this.options.token);
  }

  info(required: true): ChocoUser;
  info(required?: boolean): (null|ChocoUser);
  info(required?: boolean): (null|ChocoUser) {
    if (!this.client.user || !this.client.user.id || !this.client.user.username) {
      if (required) {
        throw new Error(`Expected bot to be authenticated!`);
      } else {
        return null;
      }
    }

    return {
      id: this.client.user.id,
      username: this.client.user.username,
    };
  }

  async send(channelID: string, content: string): Promise<ChocoMessage> {
    const info = this.info(true);

    const channel = await this.client.channels.fetch(channelID);

    if (!this.isTextBasedChannel(channel)) {
      throw new Error(`Channel must be either a "text" or "dm" channel. (${channelID})`);
    }

    const message = await channel.send(content);

    return {
      author: {
        id: info.id,
        username: info.username,
      },
      content: message.content,
      reply: this.send.bind(this, channelID),
    };
  }

  async destroy(): Promise<void> {
    this.client.destroy();
  }

  private async onMessage(message: Message) {
    this.emit('message', {
      author: {
        id: message.author.id,
        username: message.author.username,
      },
      content: message.content,
      reply: this.send.bind(this, message.channel.id),
    });
  }

  private isTextBasedChannel(channel: Channel): channel is (DMChannel|TextChannel) {
    return ['dm', 'text'].includes(channel.type);
  }
}

export interface ChocoDiscordPlatformOptions {
  /**
   * The Discord API Token.
   */
  token: string;
}
