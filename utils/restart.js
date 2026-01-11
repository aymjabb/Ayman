const { spawn } = require("child_process");
const logger = require("./logger");

function restartOnCrash() {
  logger.warn({ type: "restart", message: "Bot crashed, restarting..." });
  spawn("node", ["index.js"], { stdio: "inherit" });
}

module.exports = { restartOnCrash };
