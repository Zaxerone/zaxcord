// Example ping command
const { CommandBuilder } = require("../../index");

module.exports = {
  data: new CommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
