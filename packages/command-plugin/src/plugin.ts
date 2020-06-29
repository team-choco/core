import { ChocoPlugin, ChocoBotCore, ChocoMessage } from '@team-choco/core';
import { ChocoCommand, ChocoCommandListener } from './command';
import { ChocoArgs } from './command/args';
import { ChocoCommandListenerDetails } from '../dist';

export interface ChocoCommandListenerDetailsError extends ChocoCommandListenerDetails {
  error: any;
}

declare module '@team-choco/core' {
  interface ChocoBotCore {
    emit(event: '@team-choco/command-plugin:before', details: ChocoCommandListenerDetails): this;
    emit(event: '@team-choco/command-plugin:after', details: ChocoCommandListenerDetails): this;
    emit(event: '@team-choco/command-plugin:error', details: ChocoCommandListenerDetailsError): this;

    command: (pattern: string, listener: ChocoCommandListener) => ChocoCommand;
  }
}

export class ChocoCommandPlugin implements ChocoPlugin {
  private options: ChocoCommandPluginOptions;
  private bot!: ChocoBotCore;
  public commands: ChocoCommand[] = [];

  constructor(options: ChocoCommandPluginOptions) {
    this.options = options;

    this.command = this.command.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  register(bot: ChocoBotCore): void {
    this.bot = bot;

    this.bot.command = this.command;

    this.bot.on('message', this.onMessage);
  }

  command(pattern: string, listener: ChocoCommandListener): ChocoCommand {
    const command = new ChocoCommand({
      pattern: this.options.prefix + pattern,
      listener,
    });

    this.commands.push(command);

    return command;
  }

  private async onMessage(message: ChocoMessage): Promise<void> {
    // Bail early if our prefix doesn't match.
    if (!message.content.startsWith(this.options.prefix)) return;

    const command = this.commands.find((command) => command.parse(message.content));

    // Bail early if we couldn't find a matching command
    if (!command) return;

    const details: ChocoCommandListenerDetails = {
      message,
      args: command.parse(message.content) as ChocoArgs,
    };

    this.bot.emit('@team-choco/command-plugin:before', details);

    try {
      await command.exec(details);

      this.bot.emit('@team-choco/command-plugin:after', details);
    } catch (error) {
      this.bot.emit('@team-choco/command-plugin:error', {
        ...details,
        error,
      });
    }
  }
}

export interface ChocoCommandPluginOptions {
  /**
   * The command prefix.
   */
  prefix: string;
}
