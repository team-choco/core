import { ChocoBotCore } from '@team-choco/core';
import { PLATFORM } from '@team-choco/example-helpers';
import { ChocoCommandPlugin } from '@team-choco/command-plugin';

const bot = new ChocoBotCore({
  platform: PLATFORM,

  plugins: [
    new ChocoCommandPlugin({
      prefix: '!',
    }),
  ],
});

bot.command('pong', async ({ message }) => {
  await message.reply('ping!');
});

bot.command('ping', async ({ message }) => {
  await message.reply('pong!');
});

process.on('SIGINT', () => {
  bot.destroy();
  process.exit(0);
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});
