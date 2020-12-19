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
  await message.react('👍');

  const reply = await message.reply(`...`);

  await reply.edit(`It's nice to meet you ${message.author.username}`);
});

bot.command('welcome <...name>', async ({ message, args }) => {
  await message.reply({
    embed: {
      title: {
        content: 'Hello World!',
      },
      color: '1ABC9C',
      fields: [{
        name: 'Hello',
        value: args.name,
      }],
    },
  });
});

bot.on('ready', async () => {
  console.log('Kweh! Choco Bot is now up and running!');

  await bot.platform.status('online', 'Use !help');
});

process.on('SIGINT', async () => {
  await bot.destroy();
  process.exit(0);
});
