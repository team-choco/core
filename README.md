**NOTE: THIS LIBRARY IS CURRENTLY UNDER HEAVY DEVELOPMENT, USE AT YOUR OWN RISK**

### @team-choco/core

> This is the foundation of Choco Bot!

### Usage

```sh
$ npm install -S @team-choco/core
$ npm install -S @team-choco/command-plugin
```

```js
import { ChocoBotCore } from '@team-choco/core';
import { ChocoCommandPlugin } from '@team-choco/command-plugin';

const bot = new ChocoBotCore({
  token: '<your-discord-api-key-here>',
  prefix: '.',

  plugins: [
    // This adds the '.command' function.
    new ChocoCommandPlugin(),
  ],
});

// .ping
bot.command('ping', async ({ message }) => {
  console.log(args._); // []
  await message.reply('pong!');
});

// .search Elm
bot.command('search <name>', async ({ message, args }) => {
  console.log(args.name); // Elm
  console.log(args._); // []
  await message.reply('pong!');
});

// .search Elm Log
bot.command('search <...name>', async ({ message }) => {
  console.log(args.name); // Elm Log
  console.log(args._); // []
  await message.reply('pong!');
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});
```
