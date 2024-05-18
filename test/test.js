const { ZxClient, GatewayIntentBits } = require("../index.js");

const client = new ZxClient({
  intents: [GatewayIntentBits.Guilds],
  token: "Your Token Here",
  commandsPath: "./test/my-commands",
  eventsPath: "./test/my-events",
  createHandlerFolders: true,
});

client.start();
