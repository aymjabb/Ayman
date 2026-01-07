const blacklist = require("./cache/seraBlacklist");

module.exports.config = {
  name: "سبام",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "Sera Chan",
  description: "منع السب والسبام مع كتم أو طرد تلقائي",
  commandCategory: "حماية",
  cooldowns: 0
};

const warns = new Map();

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, body } = event;
  if (!body) return;

  const DEV = ["61577861540407"];
  if (DEV.includes(senderID)) return;

  // فلترة
  const clean = body.toLowerCase();

  const norm = clean
    .replace(/(.)\1+/g,"$1")
    .replace(/[^\u0600-\u06FFa-z]/g,"");

  // سب أسود = طرد
  if (blacklist.BLACK.some(w => norm.includes(w))) {
    await api.removeUserFromGroup(senderID, threadID);
    return api.sendMessage(
      "🚫 سب العرض أو الأهل!\nنحن لسنا مجبورين نربيك بدل أهلك ❌",
      threadID
    );
  }

  // سب أبيض = كتم
  if (blacklist.WHITE.some(w => norm.includes(w))) {
    await api.muteUser(senderID, threadID, 10 * 60 * 1000); // 10 دقائق
    return api.sendMessage(
      "⚠️ تم كتمك 10 دقائق بسبب ألفاظ غير لائقة.\nاحترم نفسك ✋",
      threadID
    );
  }

  // سبام إيموجي
  const emojiCount = (body.match(/[\p{Emoji}]/gu) || []).length;
  if (emojiCount >= 10) {
    await api.removeUserFromGroup(senderID, threadID);
    return api.sendMessage("🚫 سبام إيموجي مفرط → طرد فوري", threadID);
  } else if (emojiCount >= 5) {
    api.sendMessage("⚠️ تحذير: سبام إيموجي", threadID);
  }
};

module.exports.run = async ({ api, event }) => {
  api.sendMessage(
    "🛡️ نظام منع السب والسبام مفعّل.\n• سب أبيض = كتم\n• سب عرض = طرد\n• سبام = عقوبة تلقائية",
    event.threadID,
    event.messageID
  );
};
