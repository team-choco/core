import { ChocoBotCore } from '@team-choco/core';
import { ChocoCommandPlugin, ChocoCommandListenerDetails } from '@team-choco/command-plugin';

import { CONFIG } from '../../shared/config';

const bot = new ChocoBotCore({
  token: CONFIG.DISCORD_TOKEN,

  plugins: [
    new ChocoCommandPlugin({
      prefix: '!',
    }),
  ],
});

bot.command('pong', async ({ message }: ChocoCommandListenerDetails) => {
  await message.channel.send('ping!');
});

bot.command('ping', async ({ message }: ChocoCommandListenerDetails) => {
  await message.channel.send('pong!');
});

process.on('SIGINT', () => {
  bot.destroy();
  process.exit(0);
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});
