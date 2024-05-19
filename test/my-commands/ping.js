const { CommandBuilder } = require("../../index");

module.exports = {
  data: new CommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    interaction.reply("Pong!");
  },
};
