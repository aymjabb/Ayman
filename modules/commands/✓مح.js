const SERA = require("../seraCore");

module.exports.config = {
  name: "طرد",
  hasPermssion: 2,
  commandCategory: "sera",
  usages: ".مح @شخص",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const uid = Object.keys(event.mentions || {})[0];
  if (!uid) return api.sendMessage("اذكر شخصًا.", event.threadID);

  await api.removeUserFromGroup(uid, event.threadID);

  const msg = SERA.MODE === "DEVIL"
    ? "☠️ تم الطرد.\n🩸 الذاكرة تسجّل."
    : "🚪 تم الطرد.";

  api.sendMessage(msg, event.threadID);
};
