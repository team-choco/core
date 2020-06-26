import { chance } from '@team-choco/test-helpers';

import { toChocoPattern } from '../pattern';

describe('struct(ChocoPattern)', () => {
  describe('func(toPattern)', () => {
    it('should convert a command to a ChocoPattern', () => {
      const command = chance.word();

      const pattern = toChocoPattern(command);

      expect(pattern.args).toEqual([]);
      expect(pattern.commandOnlyRegex).toEqual(new RegExp(`^${command}`, 'i'));
      expect(pattern.fullRegex).toEqual(new RegExp(`^${command}$`, 'i'));
    });

    it('should support args', () => {
      const command = chance.word();
      const args = [chance.word(), chance.word()];

      const pattern = toChocoPattern(`${command} <${args.join('> <')}>`);

      expect(pattern.args).toEqual(args.map((arg) => ({
        name: arg,
        rest: false,
      })));
      expect(pattern.commandOnlyRegex).toEqual(new RegExp(`^${command}`, 'i'));
      expect(pattern.fullRegex).toEqual(new RegExp(`^${command} ([^\\s]+) ([^\\s]+)$`, 'i'));
    });

    it('should support rest args', () => {
      const command = chance.word();
      const arg = chance.word();

      const pattern = toChocoPattern(`${command} <...${arg}>`);

      expect(pattern.args).toEqual([{
        name: arg,
        rest: true,
      }]);
      expect(pattern.commandOnlyRegex).toEqual(new RegExp(`^${command}`, 'i'));
      expect(pattern.fullRegex).toEqual(new RegExp(`^${command} (.+)$`, 'i'));
    });

    it('should support multiple command layers', () => {
      const commands = `${chance.word()} ${chance.word()}`;
      const arg = chance.word();

      const pattern = toChocoPattern(`${commands} <${arg}>`);

      expect(pattern.args).toEqual([{
        name: arg,
        rest: false,
      }]);
      expect(pattern.commandOnlyRegex).toEqual(new RegExp(`^${commands}`, 'i'));
      expect(pattern.fullRegex).toEqual(new RegExp(`^${commands} ([^\\s]+)$`, 'i'));
    });

    it('should fail if any arguments are after a rest arg', () => {
      const command = chance.word();
      const args = [chance.word(), chance.word()];

      expect(() => toChocoPattern(`${command} <...${args.join('> <')}>`)).toThrow(`Arguments after a rest arg aren't allowed! (${args[1]})`);
    });
  });
});
