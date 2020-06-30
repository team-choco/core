import { ChocoPattern, PositionalArgumentDetails } from "./types";

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
