import { toPattern, ChocoPattern } from './pattern';
import { toArgs, ChocoArgs } from './args';
import { Message } from '@team-choco/core';

export class ChocoCommand {
  private options: ChocoCommandOptions;

  constructor(options: ChocoRawCommandOptions) {
    this.options = {
      pattern: toPattern(options.pattern),
      listener: options.listener,
    };
  }

  parse(message: string): (null|ChocoArgs) {
    const match = message.match(this.options.pattern.regex);

    if (match) {
      return toArgs(message, this.options.pattern.names);
    }

    return null;
  }

  async exec(options: ChocoCommandListenerDetails) {
    await this.options.listener(options);
  }
}

export interface ChocoRawCommandOptions {
  pattern: string;
  listener: ChocoCommandListener;
};

export interface ChocoCommandOptions {
  pattern: ChocoPattern;
  listener: ChocoCommandListener;
}

export type ChocoCommandListener = (details: ChocoCommandListenerDetails) => void;

export interface ChocoCommandListenerDetails {
  message: Message;
  args: ChocoArgs;
}
