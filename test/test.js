require("dotenv").config();
const { ZxClient, GatewayIntentBits, Logger } = require("../index.js");

const client = new ZxClient({
  intents: [GatewayIntentBits.Guilds],
  token: process.env.TOKEN,
  commandsPath: "./test/my-commands",
  eventsPath: "./test/my-events",
  createHandlerFolders: true,
  createExampleFiles: true,
  disableReadyMessage: false,
});

client.handleCommands();
client.handleEvents();
client.start();
