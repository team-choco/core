import { toChocoPattern } from '../pattern';
import { ChocoArgs, toChocoArgs } from '../args';

import { ChocoCommandListenerDetails, ChocoRawCommandOptions, ChocoCommandOptions } from './types';

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
