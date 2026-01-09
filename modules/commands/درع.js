module.exports.config = {
  name: "الدرع",
  version: "1.0.1",
  hasPermssion: 1, // للأدمن والمطور
  credits: "Ayman",
  description: "حماية معلومات المجموعة (اسم المجموعة والكنيات)",
  commandCategory: "حماية",
  cooldowns: 0
};

// تهيئة المتغير العالمي إذا لم يكن موجود
if (!global.sera_guard) global.sera_guard = {};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, logMessageType, author, logMessageData } = event;
  const MY_ID = "61577861540407"; // أيديك يا بطل

  // التحقق من أن الدرع مفعل في هذه المجموعة
  if (!global.sera_guard[threadID]) return;

  // تجاهل البوت والمطور
  if (author === MY_ID || author === api.getCurrentUserID()) return;

  try {
    // حماية اسم المجموعة
    if (logMessageType === "log:thread-name") {
      await api.setTitle(logMessageData.oldName, threadID);
      return api.sendMessage("🚫 ممنوع تغيير اسم المجموعة! 🛡️\n🐾 حماية: سيرا تشان", threadID);
    }

    // حماية كنيات الأعضاء
    if (logMessageType === "log:user-nickname") {
      await api.setUserNickname(
        logMessageData.oldNickname,
        threadID,
        logMessageData.participantID
      );
      return api.sendMessage("🚫 الكنيات مقفولة بأمر أيمن! 🛡️\n🐾 حماية: سيرا تشان", threadID);
    }

  } catch (error) {
    console.error("خطأ في نظام الدرع:", error);
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;
  const option = args[0];

  if (option === "تشغيل") {
    global.sera_guard[threadID] = true;
    return api.sendMessage("🛡️ تم تفعيل الدرع الكارثي! حماية الاسم والكنيات مفعلة.\n🐾 سيرا تشان تحت أمرك!", threadID);
  }

  if (option === "ايقاف") {
    global.sera_guard[threadID] = false;
    return api.sendMessage("🔓 تم إيقاف الدرع.\n🐾 سيرا تشان في وضع الاستعداد.", threadID);
  }

  return api.sendMessage("⚙️ استخدم: الدرع تشغيل / ايقاف", threadID);
};
