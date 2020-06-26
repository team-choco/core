import { toChocoPattern, ChocoPattern } from './pattern';
import { toChocoArgs, ChocoArgs } from './args';
import { ChocoMessage } from '@team-choco/core';

export class ChocoCommand {
  private options: ChocoCommandOptions;

  constructor(options: ChocoRawCommandOptions) {
    this.options = {
      pattern: toChocoPattern(options.pattern),
      listener: options.listener,
    };
  }

  parse(message: string): (null|ChocoArgs) {
    const match = message.match(this.options.pattern.fullRegex);

    if (match) {
      return toChocoArgs(message.replace(this.options.pattern.commandOnlyRegex, ''), this.options.pattern.args);
    }

    return null;
  }

  async exec(options: ChocoCommandListenerDetails): Promise<void> {
    await this.options.listener(options);
  }
}

export interface ChocoRawCommandOptions {
  pattern: string;
  listener: ChocoCommandListener;
}

export interface ChocoCommandOptions {
  pattern: ChocoPattern;
  listener: ChocoCommandListener;
}

export type ChocoCommandListener = (details: ChocoCommandListenerDetails) => void;

export interface ChocoCommandListenerDetails {
  message: ChocoMessage;
  args: ChocoArgs;
}
