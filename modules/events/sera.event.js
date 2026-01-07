const SERA = require("../seraCore");

module.exports.handleEvent = async function({ api, event }) {
  const { senderID, threadID, body } = event;

  // تجاهل الرسائل الفارغة أو الأوامر
  if (!body || body.startsWith(".")) return;

  // تجاهل المالك
  if (senderID === SERA.OWNER) return;

  // 🔇 منع الكلام إذا كان مسكوت
  if (SERA.SILENT[senderID]) {
    return api.sendMessage(
      SERA.MODE === "DEVIL"
        ? "☠️ قلت لك… أنت صامت."
        : "🔇 أنت صامت مؤقتًا.",
      threadID
    );
  }

  // 👁️ وضع الرعب (احتمال 30% فقط)
  if (SERA.MODE === "DEVIL") {
    if (Math.random() > 0.3) return;

    const replies = [
      "👁️ سيرا تراك.",
      "🩸 تم تسجيل رسالتك.",
      "☠️ انتبه لكلامك.",
      "⛧ لا تعيدها."
    ];

    return api.sendMessage(
      replies[Math.floor(Math.random() * replies.length)],
      threadID
    );
  }
};
const SERA = require("../seraCore");

module.exports.handleEvent = async function({ api, event }) {
  const { senderID, threadID, body } = event;

  if (!body || body.startsWith(".")) return;
  if (senderID === SERA.OWNER) return;

  // مراقبة
  if (SERA.WATCH[senderID]) {
    SERA.STRIKES[senderID] = (SERA.STRIKES[senderID] || 0) + 1;

    if (SERA.STRIKES[senderID] >= SERA.MAX_STRIKES) {
      SERA.SILENT[senderID] = true;
      return api.sendMessage(
        "☠️ تجاوزت الحد.\n🔇 تم إسكاتك.",
        threadID
      );
    }

    return api.sendMessage(
      `⚠️ مخالفة رقم ${SERA.STRIKES[senderID]}`,
      threadID
    );
  }

  // وضع الرعب
  if (SERA.MODE === "DEVIL" && Math.random() < 0.3) {
    const replies = [
      "👁️ أراك.",
      "🩸 سجلنا هذا.",
      "☠️ انتبه."
    ];
    api.sendMessage(
      replies[Math.floor(Math.random() * replies.length)],
      threadID
    );
  }
};
