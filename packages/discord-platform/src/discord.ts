import { Client, Message, TextChannel, DMChannel, Channel, MessageOptions, MessageEmbedOptions, PresenceStatusData } from 'discord.js';

import { ChocoPlatform, ChocoMessage, ChocoUser, ChocoMessageOptions, ChocoStatus, ChocoStatuses } from '@team-choco/core';

import { ChocoDiscordPlatformOptions } from './types';

export const DiscordStatuses: ChocoStatuses<PresenceStatusData> = {
  online: 'online',
  invisible: 'invisible',
};

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

  async status(status: ChocoStatus, activity: string): Promise<void> {
    if (!this.client.user) return;

    await Promise.all([
      this.client.user.setStatus(DiscordStatuses[status]),
      this.client.user.setActivity(activity, {
        type: 'PLAYING',
      }),
    ]);
  }

  async pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessage> {
    const info = this.info(true);

    const channel = await this.client.channels.fetch(channelID);

    if (!this.isTextBasedChannel(channel)) {
      throw new Error(`Channel must be either a "text" or "dm" channel. (${channelID})`);
    }

    const embed: (undefined|MessageEmbedOptions) = options.embed ? {
      ...(options.embed.title ? {
        title: options.embed.title.content,
        url: options.embed.title.url,
      } : undefined),
      description: options.embed.content,
      color: options.embed.color ? parseInt(options.embed.color, 16) : undefined,
      fields: options.embed.fields,
      footer: options.embed.footer ? {
        text: options.embed.footer.content,
        iconURL: options.embed.footer.iconURL,
      } : undefined,
    } : undefined;

    const content: MessageOptions = {
      content: options.content,
      embed: embed,
    };

    const message = await channel.send(content);

    return {
      id: message.id,
      author: {
        id: info.id,
        username: info.username,
      },
      content: message.content,
      reply: this.send.bind(this, channelID),
      react: async (emoji: string) => {
        await message.react(emoji);
      },
    };
  }

  async destroy(): Promise<void> {
    this.client.destroy();
  }

  private async onMessage(message: Message) {
    this.emit('message', {
      id: message.id,
      author: {
        id: message.author.id,
        username: message.author.username,
      },
      content: message.content,
      reply: this.send.bind(this, message.channel.id),
      react: async (emoji: string) => {
        await message.react(emoji);
      },
    });
  }

  private isTextBasedChannel(channel: Channel): channel is (DMChannel|TextChannel) {
    return ['dm', 'text'].includes(channel.type);
  }
}
