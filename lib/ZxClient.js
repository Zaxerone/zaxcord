const { Client, Collection, REST, Routes, Events } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const Logger = require("../utils/Logger");

/**

 * ZaxCord Discord Bot Client

 * @param {Client} existingClient Existing client. Enables Link Mode.

 * @param {String} token Set the bot's token

 * @param {String} commandPath Change the commands folder path (By default : `./commands`)

 * @param {String} eventsPath Change the events folder path (By default : `./events`)

 * @param {boolean} createHandlerFolders Automatically create the handler's folders if not present (By default : `false`)

 * @param {boolean} createExampleFiles Create example files if not present (By default : `true`)

 * @param {boolean} createInteractionCreateFile Create interactionCreate.js file if not present (By default : `true`)

 * @param {boolean} disableReadyMessage Disable the ready message (By default : `false`)
 */

class ZxClient extends Client {
  constructor(options) {
    super(options.existingClient ? options.existingClient.options : options);
    this.client = options.existingClient || this;
    this.token = options.token;
    this.commandsPath = path.resolve(options.commandsPath || "./commands");
    this.eventsPath = path.resolve(options.eventsPath || "./events");
    this.createHandlerFolders = options.createHandlerFolders || false;
    this.createExampleFiles = options.createExampleFiles || true;
    this.createInteractionCreateFile =
      options.createInteractionCreateFile || true;
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.disableReadyMessage = options.disableReadyMessage || false;

    this.ensureDirectories();
  }

  async validateToken(token) {
    const botToken = token || this.token;
    try {
      await this.client.login(botToken);
      this.client.destroy();
    } catch (e) {
      Logger.error("[✖] The defined bot token is unvalid.");
      process.exit(1);
    }
  }

  ensureDirectories() {
    const commandsFolderExists = fs.existsSync(this.commandsPath);
    const eventsFolderExists = fs.existsSync(this.eventsPath);

    if (!commandsFolderExists && !this.createHandlerFolders) {
      Logger.error(
        `Commands folder (${this.commandsPath}) does not exist. Set 'createHandlerFolders' to true if you want to create the folders.`
      );
      process.exit(1);
    }

    if (!eventsFolderExists && !this.createHandlerFolders) {
      Logger.error(
        `Events folder (${this.eventsPath}) does not exist. Set 'createHandlerFolders' to true if you want to create the folders.`
      );
      process.exit(1);
    }

    if (!commandsFolderExists && this.createHandlerFolders) {
      fs.mkdirSync(this.commandsPath, { recursive: true });
      Logger.success(`Created commands folder at ${this.commandsPath}`);
    }

    if (!eventsFolderExists && this.createHandlerFolders) {
      fs.mkdirSync(this.eventsPath, { recursive: true });
      Logger.success(`Created events folder at ${this.eventsPath}`);
    }

    if (this.createExampleFiles) {
      this.createExampleCommand();
      this.createExampleEvent();
    }

    if (this.createInteractionCreateFile) {
      this.createInteractionCreateFile();
    }
  }

  createExampleCommand() {
    const pingCommandPath = path.join(this.commandsPath, "ping.js");
    if (!fs.existsSync(pingCommandPath)) {
      const pingCommandContent = `
// Example ping command
const { CommandBuilder } = require("zaxcord");

module.exports = {
  data: new CommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
`;
      fs.writeFileSync(pingCommandPath, pingCommandContent);
      Logger.success(`Created example command at ${pingCommandPath}`);
    }
  }

  createExampleEvent() {
    const readyEventPath = path.join(this.eventsPath, "ready.js");
    if (!fs.existsSync(readyEventPath)) {
      const readyEventContent = `
// Example ready event
const { Events } = require("zaxcord");

module.exports = {
  name: Events.ClientReady,
  once: true,
 async execute(client) {
    console.log(\`Connected as \${client.user.tag}\`);
  },
};
`;
      fs.writeFileSync(readyEventPath, readyEventContent);
      Logger.success(`Created example event at ${readyEventPath}`);
    }
  }

  createInteractionCreateFile() {
    const interactionCreatePath = path.join(
      this.eventsPath,
      "interactionCreate.js"
    );
    if (!fs.existsSync(interactionCreatePath)) {
      const interactionCreateContent = `
// Example interactionCreate event
const { CooldownHandler, Events } = require('zaxcord');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    const cooldownHandler = new CooldownHandler({
      interaction: interaction,
      command: command,
      defaultCooldown: 5,
      replyContent: "You are on cooldown, please wait {zxTime} seconds before using this command again.",
      isEditMessage: false,
      embedContent: null,
      isEphemeral: true,
    });

    cooldownHandler();

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};
`;
      fs.writeFileSync(interactionCreatePath, interactionCreateContent);
      Logger.success(
        `Created interactionCreate event at ${interactionCreatePath}`
      );
    }
  }

  /**
   * Handle commands
   * @returns {Collection}
   */
  async handleCommands() {
    await this.ensureDirectories();
    await this.validateToken();

    const commandFiles = fs
      .readdirSync(this.commandsPath)
      .filter((file) => file.endsWith(".js"));
    const commands = [];

    for (const file of commandFiles) {
      const filePath = path.join(this.commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
        commands.push(command.data);
        Logger.success(`[✓] Loaded command: ${command.data.name}`);
      } else {
        Logger.warn(
          `[!] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }

      const clientId = atob(this.token.split(".")[0]);
      const rest = new REST({ version: "10" }).setToken(this.token);

      try {
        Logger.log(
          `Started refreshing ${commands.length} application (/) commands.`
        );
        const data = await rest.put(Routes.applicationCommands(clientId), {
          body: commands,
        });
        Logger.success(
          `[✓] Successfully reloaded ${data.length} application (/) commands.`
        );
      } catch (error) {
        Logger.error(`[✖] ${error}`);
      }
    }

    return commands;
  }

  /**
   * Handle events
   */
  async handleEvents() {
    await this.ensureDirectories();
    const eventFiles = fs
      .readdirSync(this.eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(this.eventsPath, file);
      const event = require(filePath);
      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }

  /**
   * Start the bot
   */
  async start() {
    this.client.login(this.token);
    if (!this.disableReadyMessage) {
      this.client.once(Events.ClientReady, (readyClient) =>
        Logger.log(`Successfully connected as ${readyClient.user.tag}`)
      );
    }
  }
}

module.exports = ZxClient;
