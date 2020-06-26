import { ChocoCommand } from '../command';

import * as Exports from '../';

describe('module(@team-choco/command-plugin/command)', () => {
  it('should export ChocoCommand', () => {
    expect(Exports).toEqual({
      ChocoCommand,
    });
  });
});
