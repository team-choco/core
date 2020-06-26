import { PositionalArgumentDetails } from './pattern';

export function toChocoArgs(message: string, args: PositionalArgumentDetails[]): ChocoArgs {
  const clonedArgs = [...args];
  const values = message.split(' ').filter((value) => value !== '');

  const output: ChocoArgs = {
    _: [],
  };

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    if (value.startsWith('-')) {
      const key = value.replace(/^\-\-?/, '');

      if (values[i + 1]) {
        output[key] = values[i + 1];
        i++;
      } else {
        output[key] = true;
      }
    } else {
      const details = clonedArgs.shift();

      if (!details) {
        output._.push(value);
      } else if (details.rest) {
        output[details.name] = values.splice(i).join(' ');
      } else {
        output[details.name] = value;
      }
    }
  }

  return output;
}

export interface ChocoArgs {
  [key: string]: any;

  _: string[];
}
