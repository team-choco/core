/**
 * Converts a string to a pattern.
 * @param value - the string to convert.
 * @returns the pattern.
 */
export function toPattern(value: string): ChocoPattern {
  const names: string[] = [];
  const regex = new RegExp(`^${value.replace(/<(?:\w+)>/i, (match, name) => {
    names.push(name);
    return '';
  }).trim()}`, 'i');

  return {
    names,
    regex,
  };
}

export interface ChocoPattern {
  names: string[];
  regex: RegExp;
}
