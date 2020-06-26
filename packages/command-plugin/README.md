**NOTE: THIS LIBRARY IS CURRENTLY UNDER HEAVY DEVELOPMENT, USE AT YOUR OWN RISK**

## @team-choco/command-plugin

> Adds the ability to register commands to Choco Bot Core!

## Install

```sh
$ npm install -S @team-choco/command-plugin
```

## Usage

```js
// ...
import { ChocoBotCore } from '@team-choco/core';
import { ChocoCommandPlugin } from '@team-choco/command-plugin';

const bot = new ChocoBotCore({
  // ...

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

## API

```ts
command(pattern: string, listener: ({ message }) => void): void
```

### Patterns Syntax

`<name>` - matches a positional argument.

`<...name>` - matches the remaining positional arguments.

### Examples

```js
// ...

// Example Interaction
// <me>: .search Elm
// <Choco Bot>: You searched for "Elm"!
// <me>: .search Elm Log
// -- Choco Bot wouldn't respond in this case.
bot.command('search <name>', async ({ message, args }) => {
  await message.reply(`You searched for "${args.name}"!`);
});
```

```js
// ...

// Example Interaction
// <me>: .search Elm
// <Choco Bot>: You searched for "Elm"!
// <me>: .search Elm Log
// <Choco Bot>: You searched for "Elm Log"!
bot.command('search <...name>', async ({ message, args }) => {
  await message.reply(`You searched for "${args.name}"!`);
});
```
