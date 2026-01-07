const SERA = require("../seraCore");

module.exports.handleEvent = async function({ api, event }) {
  const { senderID, threadID, body } = event;
  if (!body || body.startsWith(".")) return;
  if (senderID === SERA.OWNER) return;

  if (SERA.MODE === "DEVIL") {
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
