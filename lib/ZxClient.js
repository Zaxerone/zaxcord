const { Client, Collection, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const Logger = require("./Logger");
const { decode } = require("base-64");

/**
 * ZaxCord Discord Bot Client
 * @param {String} token Set the bot's token
 * @param {String} commandPath Change the commands folder path (By default : `./commands`)
 * @param {String} eventsPath Change the events folder path (By default : `./events`)
 * @param {boolean} createHandlerFolders Automatically create the handler's folders if not present (By default : `false`)
 */
class ZxClient extends Client {
  constructor(options) {
    super(options);
    this.token = options.token;
    this.commandsPath = path.resolve(options.commandsPath || "./commands");
    this.eventsPath = path.resolve(options.eventsPath || "./events");
    this.createHandlerFolders = options.createHandlerFolders || false;
    this.createExampleFiles = options.createExampleFiles || true;
    this.createInteractionCreateFile =
      options.createInteractionCreateFile || true;
    this.commands = new Collection();
    this.cooldowns = new Collection();

    this.ensureDirectories();
  }

  async validateToken() {
    try {
      await this.login(this.token);
      this.destroy();
    } catch (e) {
      Logger.error("[✖] Please define a valid discord bot token.");
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
  }

  registerCommands() {
    const commandFiles = fs
      .readdirSync(this.commandsPath)
      .filter((file) => file.endsWith(".js"));
    const commands = [];

    for (const file of commandFiles) {
      const filePath = path.join(this.commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        Logger.success(`[✓] Loaded command: ${command.data.name}`);
      } else {
        Logger.warn(
          `[!] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }

    return commands;
  }

  registerEvents() {
    const eventFiles = fs
      .readdirSync(this.eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(this.eventsPath, file);
      const event = require(filePath);
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args));
      } else {
        this.on(event.name, (...args) => event.execute(...args));
      }
    }
  }

  async registerSlashCommands(commands, clientId) {
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

  /**
   * Connect to discord bot user
   */
  async start() {
    await this.validateToken();
    const commands = this.registerCommands();
    this.registerEvents();
    const clientId = decode(this.token.split(".")[0]);
    this.registerSlashCommands(commands, clientId);
    this.login(this.token);
  }
}

module.exports = ZxClient;
