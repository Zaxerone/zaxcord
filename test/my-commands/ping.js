const { CommandBuilder } = require("../../index");

module.exports = {
  data: new CommandBuilder()
    .setName("ping")
    .setDescription("Gives the bot's ping"),
  async execute(interaction) {
    interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    const apiPing = Math.round(interaction.client.ws.ping);

    const embed = {
      title: "Pong!",
      description: `Ping: ${ping}ms\nAPI: ${apiPing}ms`,
    };

    interaction.editReply({ embeds: [embed] });
  },
  cooldown: 0,
  inRandomCommand: true,
};
