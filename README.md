<p align="center">
</p>

<h1 align="center">ZaxCord</h1>

<p align="center">
  <b>[BETA] A discord.js framework focused on simplicity and customization</b>
</p>

<p align="center">
  <a href="https://github.com/Zaxerone/zaxcord/actions">
  </a>
  <a href="https://github.com/Zaxerone/zaxcord/issues">
    <img src="https://img.shields.io/github/issues/Zaxerone/zaxcord" alt="Issues">
  </a>
  <a href="https://github.com/Zaxerone/zaxcord/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Zaxerone/zaxcord" alt="License">
  </a>
</p>

---

## Features

- **Commands**: Easily create and manage commands.
- **Cooldowns**: Implement cooldowns to prevent spam.
- **Logging**: Built-in logging for better debugging.
- **Database**: (Coming Soon) Database integration for persistent storage.
- **Utils**: Utility functions to simplify your code.
- **Events**: Handle Discord events with ease.
- **Interactions**: Manage interactions like buttons and modals.
- **Modals**: (Coming Soon) Support for modal dialogs.
- **Buttons**: (Coming Soon) Button interactions.
- **Selects**: (Coming Soon) Select menu interactions.
- **Context Menus**: (Coming Soon) Context menu interactions.
- **Menus**: (Coming Soon) Menu interactions.
- **Modal Submit**: (Coming Soon) Handle modal submissions.
- **Sharding**: (Coming Soon) Support for sharding your bot.
- **Link Mode**: (Coming Soon) Link ZaxCord to an existing discord.js client.

> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Mqxx/GitHub-Markdown/main/blockquotes/badge/light-theme/note.svg">
>   <img alt="Note" src="https://raw.githubusercontent.com/Mqxx/GitHub-Markdown/main/blockquotes/badge/dark-theme/note.svg">
> </picture><br>
>
> Note that everything from discord.js can also be used in ZaxCord, just not with ZaxCord's addons

---

## Getting Started

```js
const { ZxClient, GatewayIntentBits } = require("../index.js");

const client = new ZxClient({
  intents: [GatewayIntentBits.Guilds],
  token: "Enter your token here",
  commandsPath: "./commands",
  eventsPath: "./events",
  createHandlerFolders: true,
  createExampleFiles: true,
  createInteractionFolders: true,
  disableReadyMessage: false,
});

client.handleCommands();
client.handleEvents();

client.start();
```

## Build

### Requirements

- Node.js 20.11.1 or higher
- pnpm 9.1.1 or higher

```sh
git clone https://github.com/Zaxxon-dev/zaxcord.git
cd zaxcord
pnpm install
```
