const login = require("@dongdev/fca-unofficial");
const fs = require("fs");
const logger = require("./logger");

async function loginWithAppState(bot, appstatePath) {
  if (!fs.existsSync(appstatePath)) throw new Error("Appstate file missing");

  return new Promise((resolve, reject) => {
    login({ appState: require(appstatePath) }, (err, api) => {
      if (err) {
        logger.error({ type: "login_error", error: err });
        return reject(err);
      }
      bot.api = api;
      resolve(api);
    });
  });
}

module.exports = { loginWithAppState };
