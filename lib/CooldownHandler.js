const { Collection } = require("discord.js");
const ZxClient = require("./ZxClient");

/**
 * @class
 * @classdesc Handles cooldowns for commands
 * @param {Object} Options - The options for the cooldown handler
 * @param {Interaction} Options.interaction - The interaction object
 * @param {Command} Options.command - The command object
 * @param {String} Options.replyContent - The content to reply with
 * @param {Boolean} Options.isEditMessage - Whether the message should be edited
 * @param {Embed} Options.embedContent - The embed to send with the message
 * @param {Boolean} Options.isEphemeral - Whether the message should be ephemeral
 */
class CooldownHandler extends ZxClient {
  constructor(Options) {
    super(Options);
    this.interaction = Options.interaction;
    this.command = Options.command;
    this.defaultCooldown = Options.defaultCooldown || 3;
    this.replyContent = Options.command;
    this.isEditMessage = Options.isEditMessage || false;
    this.embedContent = Options.embedContent || null;
    this.isEphemeral = Options.isEphemeral || false;

    if (!this.cooldowns.has(this.command.data.name)) {
      this.cooldowns.set(this.command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = this.cooldowns.get(this.command.data.name);
    const cooldownAmount = (this.command.cooldown || 3) * 1000;

    if (timestamps.has(this.interaction.user.id)) {
      const expirationTime =
        timestamps.get(this.interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const content = this.replyContent.replace(
          "{zxTime}",
          timeLeft.toFixed(1)
        );
        this.isEditMessage
          ? this.interaction.editReply({
              content: content,
              embeds: [
                this.embedContent.replace("{zxTime}", timeLeft.toFixed(1)),
              ],
              ephmeral: this.isEphemeral,
            })
          : this.interaction.reply({
              content: content,
              embeds: [
                this.embedContent.replace("{zxTime}", timeLeft.toFixed(1)),
              ],
              ephmeral: this.isEphemeral,
            });
        return false;
      }
    }

    timestamps.set(this.interaction.user.id, now);
    setTimeout(
      () => timestamps.delete(this.interaction.user.id),
      cooldownAmount
    );

    return true;
  }
}

module.exports = CooldownHandler;
