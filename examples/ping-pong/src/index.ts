import { Bot } from '@team-choco/core';
import { CommandPlugin } from '@team-choco/command';
import { ChocoCommandListenerDetails } from '@team-choco/command';

import { CONFIG } from '../../shared/config';

const bot = new Bot({
  token: CONFIG.DISCORD_TOKEN,

  plugins: [
    new CommandPlugin({
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
  console.log('Choco Bot is now up and running!');
});
