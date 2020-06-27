**NOTE: THIS LIBRARY IS CURRENTLY UNDER HEAVY DEVELOPMENT, USE AT YOUR OWN RISK**

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]

### @team-choco/core

> This is the foundation of Choco Bot!

### Install

_Install the Core!_

```sh
$ npm install -S @team-choco/core
```

_Pick a platform!_

- [discord-platform](/packages/discord-platform) - Interact with your bot via Discord!
- [shell-platform](/packages/shell-platform) - Interact with your bot via the Shell!

_Install a few plugins to add some flair!_

- [command-plugin](/packages/command-plugin) - Adds the ability to register commands!
- voice-plugin _(Coming Soon)_ - Adds the ability to play audio via streams!

### Examples

Need a few examples to get you started? Well we've got you covered! 

Just go checkout the [examples](/examples) directory!

### Usage

```sh
$ npm install -S @team-choco/core
$ npm install -S @team-choco/shell-platform
$ npm install -S @team-choco/command-plugin
```

```js
import { ChocoBotCore } from '@team-choco/core';
import { ChocoShellPlatform } from '@team-choco/shell-platform';
import { ChocoCommandPlugin } from '@team-choco/command-plugin';

const bot = new ChocoBotCore({
  platform: new ChocoShellPlatform({
    name: 'Choco Bot',
  }),

  plugins: [
    // This adds the '.command' function.
    new ChocoCommandPlugin({
      prefix: '.',
    }),
  ],
});

// Example Interaction
// <me>: !ping
// <Choco Bot>: pong!
bot.command('ping', async ({ message, args }) => {
  console.log(args); // { _: [] }
  await message.reply('pong!');
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});
```

[npm-version-image]: https://img.shields.io/npm/v/@team-choco/core.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@team-choco/core.svg?style=flat
[npm-url]: https://npmjs.org/package/@team-choco/core
