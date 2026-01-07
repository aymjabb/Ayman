const SERA = require("../seraCore");

module.exports.config = {
  name: "فك صمت",
  hasPermssion: 2,
  commandCategory: "sera",
  usages: ".فك صمت @شخص",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const uid = Object.keys(event.mentions || {})[0];
  if (!uid) return api.sendMessage("اذكر شخصًا.", event.threadID);

  delete SERA.SILENT[uid];

  const msg = SERA.MODE === "DEVIL"
    ? "🔊 سُمِح له بالكلام… بحذر."
    : "🔊 تم فك الصمت.";

  api.sendMessage(msg, event.threadID);
};
