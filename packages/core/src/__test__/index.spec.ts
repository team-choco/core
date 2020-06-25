import * as Exports from '..';
import { ChocoBotCore } from '../core';

describe('module(@team-choco/core)', () => {
  it('should match expected exports', () => {
    expect(Exports).toEqual({
      ChocoBotCore,
    });
  });
});
