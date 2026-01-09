// متغيرات عامة (آمنة)
let isOn = false;
let allowedThreads = [];

module.exports.config = {
  name: "سكوت",
  version: "1.3.1",
  hasPermssion: 2,
  credits: "Ayman",
  description: "وضع السكوت الإجباري",
  commandCategory: "حماية",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!isOn) return;
  if (!allowedThreads.includes(event.threadID)) return;

  const adminConfig = ["61577861540407"]; // ايديك
  const botID = api.getCurrentUserID();

  // تجاهل الأدمن والبوت
  if (adminConfig.includes(event.senderID)) return;
  if (event.senderID == botID) return;

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);

    // تأكد أن البوت أدمن
    if (!threadInfo.adminIDs.some(a => a.id == botID)) return;

    // لا تطرد الأدمن
    if (threadInfo.adminIDs.some(a => a.id == event.senderID)) return;

    await api.removeUserFromGroup(event.senderID, event.threadID);

    api.sendMessage(
      "⚠️ هدووووء!\n──────────────────\nالزعيم أيمن أمر بالسكوت.. ممنوع الكلام هنا! 🔇",
      event.threadID
    );

  } catch (err) {
    console.error("خطأ السكوت:", err);
  }
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;

  if (args[0] === "تشغيل") {
    isOn = true;

    if (!allowedThreads.includes(threadID)) {
      allowedThreads.push(threadID);
    }

    return api.sendMessage(
      "🔇 تم تفعيل وضع السكوت الملكي.\nلا صوت يعلو فوق صوت الصمت.",
      threadID
    );
  }

  if (args[0] === "إيقاف") {
    allowedThreads = allowedThreads.filter(id => id !== threadID);

    if (allowedThreads.length === 0) isOn = false;

    return api.sendMessage(
      "🔊 تم إلغاء وضع السكوت في هذه المجموعة.",
      threadID
    );
  }

  return api.sendMessage(
    "❓ استخدم الأمر هكذا:\nسكوت تشغيل\nسكوت إيقاف",
    threadID
  );
};
