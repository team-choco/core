import { chance, sinon, SinonStub, SinonSpyCall } from '@team-choco/test-helpers';

import DiscordJS from 'discord.js';

import { ChocoBotCore, ChocoPlugin } from '../core';

describe('Class(Bot)', () => {
  let client: {
    login: SinonStub;
    on: SinonStub;
    destroy: SinonStub;
  };

  beforeEach(() => {
    client = {
      login: sinon.stub().resolves(),
      on: sinon.stub(),
      destroy: sinon.stub(),
    };

    sinon.stub(DiscordJS, 'Client').returns(client);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('func(constructor)', () => {
    it('should construct a bot', () => {
      const bot = new ChocoBotCore({
        token: chance.string(),
      });

      expect(bot).toBeTruthy();
    });

    it('should automatically login', () => {
      const bot = new ChocoBotCore({
        token: chance.string(),
      });

      expect(bot).toBeTruthy();
      sinon.assert.calledOnce(client.login);
    });

    it('should register a "message" listener', () => {
      const bot = new ChocoBotCore({
        token: chance.string(),
      });

      expect(bot).toBeTruthy();
      sinon.assert.calledTwice(client.on);
      sinon.assert.calledWith(client.on, 'message');
    });

    it('should register a "ready" listener', () => {
      const bot = new ChocoBotCore({
        token: chance.string(),
      });

      expect(bot).toBeTruthy();
      sinon.assert.calledTwice(client.on);
      sinon.assert.calledWith(client.on, 'ready');
    });

    describe('prop(plugins)', () => {
      it('should register any plugins provided', () => {
        class CustomPlugin implements ChocoPlugin {
          register(bot: ChocoBotCore) {
            expect(bot).toBeInstanceOf(ChocoBotCore);
          }
        }

        const register = sinon.spy(CustomPlugin.prototype, 'register');

        sinon.assert.notCalled(register);

        const bot = new ChocoBotCore({
          token: chance.string(),

          plugins: [
            new CustomPlugin(),
          ],
        });

        expect(bot).toBeTruthy();
        sinon.assert.calledOnce(register);
      });
    });
  });

  describe('event(message)', () => {
    it('should emit the event when the client emits a "message" event', async () => {
      const bot = new ChocoBotCore({
        token: chance.string(),
      });

      const call = client.on.getCalls().find((call) =>
        call.args.includes('message'),
      ) as SinonSpyCall;

      expect(call).toBeTruthy();

      const [, listener] = call.args;

      expect(listener).toBeInstanceOf(Function);

      const expectedMessage = chance.string();

      const message = await new Promise((resolve) => {
        bot.once('message', resolve);

        listener(expectedMessage);
      });

      expect(message).toEqual(expectedMessage);
    });
  });

  describe('event(ready)', () => {
    it('should emit the event when the client emits a "ready" event', async () => {
      const bot = new ChocoBotCore({
        token: chance.string(),
      });

      const call = client.on.getCalls().find((call) =>
        call.args.includes('ready'),
      ) as SinonSpyCall;

      expect(call).toBeTruthy();

      const [, listener] = call.args;

      expect(listener).toBeInstanceOf(Function);

      await new Promise((resolve) => {
        bot.once('ready', resolve);

        listener();
      });
    });
  });

  describe('func(register)', () => {
    it('should register the plugin', async () => {
      const bot = new ChocoBotCore({
        token: chance.string(),
      });

      class CustomPlugin implements ChocoPlugin {
        register(bot: ChocoBotCore) {
          expect(bot).toBeInstanceOf(ChocoBotCore);
        }
      }

      const register = sinon.spy(CustomPlugin.prototype, 'register');

      sinon.assert.notCalled(register);

      bot.register(new CustomPlugin());

      expect(bot).toBeTruthy();
      sinon.assert.calledOnce(register);
    });
  });

  describe('func(destroy)', () => {
    it('should destroy the client', async () => {
      const bot = new ChocoBotCore({
        token: chance.string(),
      });

      sinon.assert.notCalled(client.destroy);

      bot.destroy();

      sinon.assert.calledOnce(client.destroy);
    });
  });
});
