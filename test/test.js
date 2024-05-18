require("dotenv").config();
const { ZxClient, GatewayIntentBits } = require("../index.js");

const client = new ZxClient({
  intents: [GatewayIntentBits.Guilds],
  token: process.env.TOKEN,
  commandsPath: "./test/my-commands",
  eventsPath: "./test/my-events",
  createHandlerFolders: true,
});

client.start();
