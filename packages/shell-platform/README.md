**NOTE: THIS LIBRARY IS CURRENTLY UNDER HEAVY DEVELOPMENT, USE AT YOUR OWN RISK**

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
