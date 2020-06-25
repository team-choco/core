import { Plugin, Bot, Message } from '@team-choco/core';
import { ChocoCommand, ChocoCommandListener } from './command';

declare module '@team-choco/core' {
  interface Bot {
    command: (pattern: string, listener: ChocoCommandListener) => ChocoCommand;
  }
}

export class CommandPlugin implements Plugin {
  private options: CommandPluginOptions;
  private commands: ChocoCommand[] = [];

  constructor(options: CommandPluginOptions) {
    this.options = options;

    this.command = this.command.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  register(bot: Bot): void {
    bot.command = this.command;

    bot.on('message', this.onMessage);
  }

  command(pattern: string, listener: ChocoCommandListener): ChocoCommand {
    const command = new ChocoCommand({
      pattern: this.options.prefix + pattern,
      listener,
    });

    this.commands.push(command);

    return command;
  }

  private onMessage(message: Message): void {
    // Bail early if our prefix doesn't match.
    if (!message.content.startsWith(this.options.prefix)) return;

    const command = this.commands.find((command) => command.parse(message.content));

    if (!command) return;

    const args = command.parse(message.content);

    if (!args) return;

    command.exec({ message, args });
  }
}

export interface CommandPluginOptions {
  /**
   * The command prefix.
   */
  prefix: string;
}
