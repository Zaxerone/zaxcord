const { Collection, GatewayIntentBits, Events } = require("discord.js");

const ZxClient = require("./lib/ZxClient");
const CommandBuilder = require("./lib/CommandBuilder");
const Logger = require("./utils/Logger");
const Colors = require("./utils/Colors");

module.exports = {
  ZxClient,
  GatewayIntentBits,
  Collection,
  CommandBuilder,
  Logger,
  Events,
  Colors,
};
