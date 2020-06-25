**NOTE: THIS LIBRARY IS CURRENTLY UNDER HEAVY DEVELOPMENT, USE AT YOUR OWN RISK**

### @team-choco/core

> This is the foundation of Choco Bot!

### Usage

```sh
$ npm install -S @team-choco/core
$ npm install -S @team-choco/command
```

```js
import { Bot } from '@team-choco/core';
import { CommandPlugin } from '@team-choco/command';

const bot = new Bot({
  token: '<your-discord-api-key-here>',
  prefix: '.',

  plugins: [
    // This adds the '.command' function.
    new CommandPlugin(),
  ],
});

bot.command('ping', async ({ message }) => {
  await message.reply('pong!');
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});
```
