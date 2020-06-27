**NOTE: THIS LIBRARY IS CURRENTLY UNDER HEAVY DEVELOPMENT, USE AT YOUR OWN RISK**

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]

## @team-choco/shell-platform

> Connect your bot to your local Shell!

## Install

```sh
$ npm install -S @team-choco/shell-platform
```

## Usage

```js
// ...
import { ChocoBotCore } from '@team-choco/core';
import { ChocoShellPlatform } from '@team-choco/shell-platform';

const bot = new ChocoBotCore({
  platform: new ChocoShellPlatform({
    name: 'Choco Bot',
  }),

  // ...
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});
```

[npm-version-image]: https://img.shields.io/npm/v/@team-choco/shell-platform.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@team-choco/shell-platform.svg?style=flat
[npm-url]: https://npmjs.org/package/@team-choco/shell-platform
