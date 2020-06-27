**NOTE: THIS LIBRARY IS CURRENTLY UNDER HEAVY DEVELOPMENT, USE AT YOUR OWN RISK**

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]

## @team-choco/discord-platform

> Connect your bot to Discord!

## Install

```sh
$ npm install -S @team-choco/discord-platform
```

## Usage

```js
// ...
import { ChocoBotCore } from '@team-choco/core';
import { ChocoDiscordPlatform } from '@team-choco/discord-platform';

const bot = new ChocoBotCore({
  platform: new ChocoDiscordPlatform({
    token: '<your-discord-token>',
  }),

  // ...
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});
```

[npm-version-image]: https://img.shields.io/npm/v/@team-choco/discord-platform.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@team-choco/discord-platform.svg?style=flat
[npm-url]: https://npmjs.org/package/@team-choco/discord-platform
