import { toChocoPattern } from '../pattern';
import { ChocoArgs, toChocoArgs } from '../args';

import { ChocoCommandListenerDetails, ChocoRawCommandOptions, ChocoCommandOptions, Help } from './types';

export class ChocoCommand {
  public options: ChocoCommandOptions;
  public helpConfig?: Help;

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

  public help(options?: Help){
    if(options !== undefined) {
      this.helpConfig = options
    }
  }
}
