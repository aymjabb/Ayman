const SERA = require("../seraCore");

module.exports.config = {
  name: "المطرودين",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "عرض سجل المطرودين والخارجين",
  commandCategory: "system",
  usages: ".المطرودين",
  cooldowns: 0
};

module.exports.run = async function ({ api, event }) {
  const { senderID, threadID } = event;
  if (senderID !== SERA.OWNER)
    return api.sendMessage("⛔ للمالك فقط.", threadID);

  if (!SERA.LEFT_LOG.length)
    return api.sendMessage("📭 السجل فارغ.", threadID);

  let msg = "📜 سجل الخارجين:\n\n";

  SERA.LEFT_LOG.forEach((u, i) => {
    const icon = u.type === "KICK" ? "☠️" : "🚪";
    msg += `${i + 1}) ${icon} ${u.id}\n`;
  });

  api.sendMessage(msg, threadID);
};
