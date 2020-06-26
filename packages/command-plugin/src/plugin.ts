import { ChocoPlugin, ChocoBotCore, ChocoMessage } from '@team-choco/core';
import { ChocoCommand, ChocoCommandListener } from './command';
import { ChocoArgs } from './command/args';

declare module '@team-choco/core' {
  interface ChocoBotCore {
    command: (pattern: string, listener: ChocoCommandListener) => ChocoCommand;
  }
}

export class ChocoCommandPlugin implements ChocoPlugin {
  private options: ChocoCommandPluginOptions;
  public commands: ChocoCommand[] = [];

  constructor(options: ChocoCommandPluginOptions) {
    this.options = options;

    this.command = this.command.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  register(bot: ChocoBotCore): void {
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

  private onMessage(message: ChocoMessage): void {
    // Bail early if our prefix doesn't match.
    if (!message.content.startsWith(this.options.prefix)) return;

    const command = this.commands.find((command) => command.parse(message.content));

    // Bail early if we couldn't find a matching command
    if (!command) return;

    command.exec({
      message,
      args: command.parse(message.content) as ChocoArgs,
    });
  }
}

export interface ChocoCommandPluginOptions {
  /**
   * The command prefix.
   */
  prefix: string;
}
