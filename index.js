const { Client } = require("some-bot-library");
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");
const { loginWithAppState } = require("./utils/login");
const { restartOnCrash } = require("./utils/restart");
const { config } = require("./config/botConfig");

const bot = new Client();
global.client = bot;
global.commands = new Map();
global.events = new Map();

// ---------------------- Load Commands ----------------------
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath)
  .filter(f => f.endsWith(".js"))
  .forEach(file => {
    const cmd = require(path.join(commandsPath, file));
    if (cmd.config?.name) {
      global.commands.set(cmd.config.name, cmd);
      logger.info({ type: "command_loaded", command: cmd.config.name });
    }
  });

// ---------------------- Load Events ----------------------
const eventsPath = path.join(__dirname, "events");
fs.readdirSync(eventsPath)
  .filter(f => f.endsWith(".js"))
  .forEach(file => {
    const event = require(path.join(eventsPath, file));
    if (event.name && typeof event.run === "function") {
      global.events.set(event.name, event);
      bot.on(event.name, (...args) => event.run(bot, ...args));
      logger.info({ type: "event_loaded", event: event.name });
    }
  });

// ---------------------- Login ----------------------
(async () => {
  try {
    await loginWithAppState(bot, "./appstate.json");
    logger.success({ type: "bot_online" });
  } catch (err) {
    logger.error({ type: "login_failed", error: err });
    restartOnCrash(); // إعادة تشغيل تلقائي عند فشل تسجيل الدخول
  }
})();
