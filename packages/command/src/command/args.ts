export function toArgs(message: string, names: string[]): ChocoArgs {
  return message.split(' ').reduce((output: ChocoArgs, value, i, list) => {
    if (value !== '') {
      if (value.startsWith('-')) {
        const key = value.replace(/^\-\-?/, '');

        output[key] = list[i + 1] || true;
      } else {
        const name = names.shift();

        if (name) {
          output[name] = value;
        } else {
          output._.push(value);
        }
      }
    }

    return output;
  }, { _: [] });
}

export interface ChocoArgs {
  [key: string]: any;

  _: string[];
}
