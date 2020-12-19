import { ChocoPlugin, ChocoBotCore, ChocoMessage } from '@team-choco/core';

import { ChocoCommand, ChocoCommandListener, ChocoCommandListenerDetails, ChocoCommandListenerDetailsError } from './command';
import { ChocoArgs } from './args';

declare module '@team-choco/core' {
  interface ChocoBotCore {
    emit(event: '@team-choco/command-plugin:before', details: ChocoCommandListenerDetails): boolean;
    emit(event: '@team-choco/command-plugin:after', details: ChocoCommandListenerDetails): boolean;
    emit(event: '@team-choco/command-plugin:error', details: ChocoCommandListenerDetailsError): boolean;

    on(event: '@team-choco/command-plugin:before', listener: (details: ChocoCommandListenerDetails) => void): this;
    on(event: '@team-choco/command-plugin:after', listener: (details: ChocoCommandListenerDetails) => void): this;
    on(event: '@team-choco/command-plugin:error', listener: (details: ChocoCommandListenerDetailsError) => void): this;

    command: (pattern: string, listener: ChocoCommandListener) => ChocoCommand;
    commands: ChocoCommand[];
  }
}

export class ChocoCommandPlugin implements ChocoPlugin {
  private options: ChocoCommandPluginOptions;
  private bot!: ChocoBotCore;

  constructor(options: ChocoCommandPluginOptions) {
    this.options = options;

    this.command = this.command.bind(this);
    this.onMessage = this.onMessage.bind(this);

  }
  
  register(bot: ChocoBotCore): void {
    this.bot = bot;
    
    this.bot.command = this.command;
    this.bot.commands = [];

    this.bot.on('message', this.onMessage);
  }

  command(pattern: string, listener: ChocoCommandListener): ChocoCommand {
    const command = new ChocoCommand({
      pattern: this.options.prefix + pattern,
      listener,
    });

    this.bot.commands.push(command);

    return command;
  }

  private async onMessage(message: ChocoMessage): Promise<void> {
    // Bail early if our prefix doesn't match.
    if (!message.content.startsWith(this.options.prefix)) return;

    const command = this.bot.commands.find((command) => command.parse(message.content));

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
