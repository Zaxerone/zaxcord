// Example ready event
const { Events } = require("../../index");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Connected as ${client.user.tag}`);
  },
};
