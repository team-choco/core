export interface PositionalArgumentDetails {
  name: string;
  rest: boolean;
}

export interface ChocoPattern {
  /**
   * The named positional arguments.
   */
  args: PositionalArgumentDetails[];

  /**
   * This regex contains only the command.
   */
  commandOnlyRegex: RegExp;

  /**
   * This regex contains the arguments as well.
   */
  fullRegex: RegExp;
}
