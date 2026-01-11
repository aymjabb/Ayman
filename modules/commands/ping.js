module.exports = {
  config: {
    name: "ping",
    description: "Ping command",
  },
  run: async ({ bot, event }) => {
    await bot.sendMessage("Pong!", event.threadID);
  },
};
