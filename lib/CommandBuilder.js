const { SlashCommandBuilder } = require("discord.js");
/**
 * @class
 * @classdesc Handles building commands for the bot
 */
class CommandBuilder extends SlashCommandBuilder {
  constructor(options) {
    super(options);
  }
}

module.exports = CommandBuilder;
