const SERA = require("../seraCore");

module.exports.config = {
  name: "سيرا",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "التحكم بشخصية سيرا تشان",
  commandCategory: "system",
  usages: ".سيرا",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  const { senderID, threadID, body } = event;

  // حماية: فقط المالك
  if (senderID !== SERA.OWNER) {
    return api.sendMessage("⛔ هذا الأمر مخصص للمالك فقط.", threadID);
  }

  // تفعيل الوضع المرعب
  if (body.includes("ابنة ابليس")) {
    SERA.MODE = "DEVIL";
    return api.sendMessage(
      "🩸 تم تفعيل وضع ابنة إبليس.\n👁️ سيرا تشان تراقب الجميع.",
      threadID
    );
  }

  // الرجوع للوضع اللطيف
  if (body.includes("ابنة ايمن")) {
    SERA.MODE = "NORMAL";
    return api.sendMessage(
      "🩷 عادت سيرا تشان.\n😼 تحبك… والبقية؟ نتسلى عليهم.",
      threadID
    );
  }

  // رسالة المساعدة
  return api.sendMessage(
    "👁️ أوامر سيرا:\n\n" +
    "• .سيرا ابنة ابليس ← وضع مرعب\n" +
    "• .سيرا ابنة ايمن ← وضع لطيف",
    threadID
  );
};
