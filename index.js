const { Collection, GatewayIntentBits } = require("discord.js");

const ZxClient = require("./lib/ZxClient");
const CommandBuilder = require("./lib/CommandBuilder");

module.exports = { ZxClient, GatewayIntentBits, Collection, CommandBuilder };
