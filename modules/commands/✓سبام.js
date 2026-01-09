module.exports.config = {
  name: "درع",
  version: "4.0.0",
  hasPermssion: 1, // للأدمن والمطور فقط لتفعيل/إيقاف الدرع
  credits: "Ayman & Sera",
  description: "حماية المجموعة من تغيير (الاسم، الصورة، الكنيات، الخلفية)",
  commandCategory: "حماية",
  usages: "درع تشغيل / درع ايقاف",
  cooldowns: 0
};

// تخزين حالة الدرع لكل مجموعة
if (!global.seraShield) global.seraShield = new Map();

module.exports.handleEvent = async function ({ api, event, Threads }) {
  const { threadID, logMessageType, logMessageData, author } = event;
  const DEV_ID = "61577861540407"; // أيديك يا زعيم

  // إذا الدرع غير مفعل في هذه المجموعة، لا تفعل شيئاً
  if (!global.seraShield.get(threadID)) return;

  // جلب معلومات المجموعة والأدمنية
  const threadInfo = await api.getThreadInfo(threadID);
  const adminIDs = threadInfo.adminIDs.map(ad => ad.id);

  // إذا كان الفاعل هو المطور، البوت، أو أدمن المجموعة -> اسمح له
  if (author === DEV_ID || author === api.getCurrentUserID() || adminIDs.includes(author)) return;

  // --- 1. حماية اسم المجموعة ---
  if (logMessageType === "log:thread-name") {
    api.setTitle(threadInfo.threadName, threadID); // إعادة الاسم القديم
    api.sendMessage("⚠️ عذراً! لا يمكن تغيير اسم المجموعة إلا بواسطة المسؤولين. ✨", threadID);
  }

  // --- 2. حماية صورة المجموعة ---
  if (logMessageType === "log:thread-icon") {
    // ملاحظة: استرجاع الصورة يحتاج لمسار محفوظ مسبقاً، هنا نقوم بمنع التغيير مستقبلاً
    api.sendMessage("🚫 محاولة تغيير صورة المجموعة! سيرا تشان ترفض العبث بالهوية. 🐾", threadID);
  }

  // --- 3. حماية الكنيات (الأسماء المستعارة) ---
  if (logMessageType === "log:user-nickname") {
    const { participantID, nickname } = logMessageData;
    api.setUserNickname(nickname, threadID, participantID); // إلغاء التغيير
    api.sendMessage("🤫 الكنيات محمية بأمر من الزعيم أيمن! 👑", threadID);
  }

  // --- 4. حماية لون الدردشة (الخلفية/الثيم) ---
  if (logMessageType === "log:thread-color") {
    api.sendMessage("🌈 ممنوع تغيير ألوان الدردشة، حافظوا على النظام! ✨", threadID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const action = args[0];

  if (action === "تشغيل") {
    global.seraShield.set(threadID, true);
    return api.sendMessage("🛡️ تم تفعيل درع الحماية الكارثي!\n──────────────────\nسيرا تشان تراقب الآن: الاسم، الصورة، الكنيات، والألوان. 🐾✨", threadID, messageID);
  }

  if (action === "ايقاف") {
    global.seraShield.set(threadID, false);
    return api.sendMessage("🔓 تم إيقاف الدرع.. المجموعة الآن بدون حماية تلقائية.", threadID, messageID);
  }

  return api.sendMessage("❓ استخدم: درع تشغيل / درع ايقاف", threadID, messageID);
};
