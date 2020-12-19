export interface ChocoUser {
  /**
   * The user's id.
   */
  id: string;

  /**
   * The user's username.
   */
  username: string;
}


export interface ChocoMessage {
  /**
   * The id of the message.
   */
  id: string;

  /**
   * Whether this message originated from a Server or a DM.
   */
  type: ('server'|'dm');

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
  reply(message: (string|ChocoRawMessageOptions)): Promise<ChocoMessage>;

  /**
   * Modifies the current message.
   * @param message - the updated message.
   * @returns the updated message
   */
  edit(message: (string|ChocoRawMessageOptions)): Promise<ChocoMessage>;

  /**
   * Reacts to the message.
   *
   * @param emoji - the emoji to react with.
   */
  react(emoji: string): Promise<void>;
}

export interface ChocoMessageDM extends ChocoMessage {
  type: 'dm';
}

export interface ChocoMessageServer extends ChocoMessage {
  type: 'server';

  /**
   * The ID of the server the message was sent from.
   */
  server_id: string;
}

export interface ChocoMessageOptions {
  /**
   * The content
   */
  content?: string;

  /**
   * The embed options.
   */
  embed?: ChocoEmbed;
}

export interface ChocoRawMessageOptions {
  /**
   * The content
   */
  content?: string;

  /**
   * The embed options.
   */
  embed?: ChocoRawEmbed;
}

export interface ChocoEmbed extends ChocoRawEmbed {
  title?: ChocoEmbedTitle;
}

export interface ChocoRawEmbed {
  /**
   * The header.
   */
  title?: (string|ChocoEmbedTitle);

  /**
   * The content
   */
  content?: string;

  /**
   * The hexadecimal flair color!
   */
  color?: string;

  /**
   * The key-value fields.
   */
  fields?: ChocoEmbedField[];

  /**
   * The footer.
   */
  footer?: ChocoEmbedFooter;
}

export interface ChocoEmbedTitle {
  content?: string;

  url?: string;
}

export interface ChocoEmbedFooter {
  content?: string;

  iconURL?: string;
}

export interface ChocoEmbedField {
  /**
   * The field name.
   */
  name: string;

  /**
   * The field value.
   */
  value: string;

  /**
   * Whether the field should be displayed inline.
   */
  inline?: boolean;
}

export type ChocoStatus = keyof ChocoStatuses<any>;

export interface ChocoStatuses<T> {
  online: T;
  invisible: T;
}
