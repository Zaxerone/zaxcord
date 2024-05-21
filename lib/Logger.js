/**
 * ZxClient's Logger
 * @class
 * @classdesc Handles logging for the bot
 */
class Logger {
  static log(content, type = "log") {
    switch (type) {
      case "log":
        return console.log(`\x1b[44m\x1b[37m LOG \x1b[0m ${content}`);
      case "warn":
        return console.log(
          `\x1b[43m\x1b[30m WARN \x1b[0m \x1b[33m${content}\x1b[0m`
        );
      case "error":
        return console.error(
          `\x1b[41m\x1b[37m ERROR \x1b[0m \x1b[31m${content}\x1b[0m`
        );
      case "success":
        return console.log(
          `\x1b[42m\x1b[37m SUCCESS \x1b[0m \x1b[32m${content}\x1b[0m`
        );
      default:
        throw new TypeError(`Invalid log type: ${type}`);
    }
  }

  static error(content) {
    return this.log(content, "error");
  }

  static warn(content) {
    return this.log(content, "warn");
  }

  static success(content) {
    return this.log(content, "success");
  }
}

module.exports = Logger;
