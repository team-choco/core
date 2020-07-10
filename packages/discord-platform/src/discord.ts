import { Client, Message, TextChannel, DMChannel, Channel, MessageOptions, MessageEmbedOptions, PresenceStatusData } from 'discord.js';

import { ChocoPlatform, ChocoMessage, ChocoUser, ChocoMessageOptions, ChocoStatus, ChocoStatuses, ChocoEmbed } from '@team-choco/core';

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

    const content: MessageOptions = {
      content: options.content,
      embed: this.normalizeEmbed(options.embed),
    };

    const message = await channel.send(content);

    return {
      id: message.id,
      author: {
        id: info.id,
        username: info.username,
      },
      content: message.content,
      reply: this.send.bind(this, message.channel.id),
      edit: this.edit.bind(this, message.channel.id, message.id),
      react: this.react.bind(this, message.channel.id, message.id),
    };
  }

  async pristineEdit(channelID: string, messageID: string, options: ChocoMessageOptions): Promise<ChocoMessage> {
    const info = this.info(true);

    const channel = await this.client.channels.fetch(channelID);

    if (!this.isTextBasedChannel(channel)) {
      throw new Error(`Channel must be either a "text" or "dm" channel. (${channelID})`);
    }

    const message = await channel.messages.fetch(messageID);

    const content: MessageOptions = {
      content: options.content,
      embed: this.normalizeEmbed(options.embed),
    };

    const updatedMessage = await message.edit(content);

    return {
      id: updatedMessage.id,
      author: {
        id: info.id,
        username: info.username,
      },
      content: updatedMessage.content,
      reply: this.send.bind(this, updatedMessage.channel.id),
      edit: this.edit.bind(this, updatedMessage.channel.id, updatedMessage.id),
      react: this.react.bind(this, updatedMessage.channel.id, updatedMessage.id),
    };
  }

  async pristineReact(channelID: string, messageID: string, emoji: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelID);

    if (!this.isTextBasedChannel(channel)) {
      throw new Error(`Channel must be either a "text" or "dm" channel. (${channelID})`);
    }

    const message = await channel.messages.fetch(messageID);

    await message.react(emoji);
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
      edit: this.edit.bind(this, message.channel.id, message.id),
      react: this.react.bind(this, message.channel.id, message.id),
    });
  }

  private isTextBasedChannel(channel: Channel): channel is (DMChannel|TextChannel) {
    return ['dm', 'text'].includes(channel.type);
  }

  private normalizeEmbed(embed?: ChocoEmbed): (undefined|MessageEmbedOptions) {
    return embed ? {
      ...(embed.title ? {
        title: embed.title.content,
        url: embed.title.url,
      } : undefined),
      description: embed.content,
      color: embed.color ? parseInt(embed.color, 16) : undefined,
      fields: embed.fields,
      footer: embed.footer ? {
        text: embed.footer.content,
        iconURL: embed.footer.iconURL,
      } : undefined,
    } : undefined;
  }
}
