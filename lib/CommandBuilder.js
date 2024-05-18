const { SlashCommandBuilder } = require("discord.js");

class CommandBuilder extends SlashCommandBuilder {
  constructor(options) {
    super(options);
  }
}

module.exports = CommandBuilder;
