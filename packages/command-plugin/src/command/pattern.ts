const REST_REGEX = /^\.\.\./;

function hasRest(value: string): boolean {
  return Boolean(value.match(REST_REGEX));
}

function removeRest(value: string): string {
  return value.replace(REST_REGEX, '');
}

/**
 * Converts a string to a pattern.
 * @param value - the string to convert.
 * @returns the pattern.
 */
export function toChocoPattern(value: string): ChocoPattern {
  let restIdentified = false;

  const args: PositionalArgumentDetails[] = [];

  const regex = '^' + value.replace(/<([^>]+)>/ig, (_, name) => {
    if (restIdentified) {
      throw new Error(`Arguments after a rest arg aren't allowed! (${removeRest(name)})`);
    }

    if (hasRest(name)) {
      args.push({
        name: removeRest(name),
        rest: true,
      });

      restIdentified = true;
    } else {
      args.push({
        name,
        rest: false,
      });
    }

    return '';
  }).trim();

  return {
    args,
    commandOnlyRegex: new RegExp(regex, 'i'),
    fullRegex: new RegExp(
      (args.length > 0 ? `${regex} ${args.map((arg) =>
        arg.rest ? '(.+)' : '([^\\s]+)',
      ).join(' ')}` : regex) + '$',
      'i',
    ),
  };
}

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
