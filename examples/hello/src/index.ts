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

bot.command('hello', async ({ message }) => {
  await message.reply(`It's nice to meet you ${message.author.username}`);
});

bot.command('welcome <...name>', async ({ message, args }) => {
  await message.reply(`Welcome to the server ${args.name}!`);
});

process.on('SIGINT', async () => {
  await bot.destroy();
  process.exit(0);
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});
