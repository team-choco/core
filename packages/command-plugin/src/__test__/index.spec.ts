import { ChocoCommandPlugin } from '../plugin';

import * as Exports from '../';

describe('module(@team-choco/command)', () => {
  it('should export ChocoCommandPlugin', () => {
    expect(Exports).toEqual({
      ChocoCommandPlugin,
    });
  });
});
