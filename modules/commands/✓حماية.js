const fs = require("fs");

module.exports.config = {
  name: "حماية",
  version: "2.1.0",
  hasPermssion: 1, // الأدمن فقط
  credits: "D-Jukie & عمر & سيرا تشان",
  description: "حماية الكروب: الاسم، الصورة، الكنية، الخلفية، الأدمن، الإيموجي. يمكن تفعيل كل فئة أو كلهم معًا.",
  usages: ".حماية [فئة/كل]",
  commandCategory: "المطور",
  cooldowns: 0
};

const DEV = ["61577861540407"]; // ID المطور
const PROTECT_TYPES = ["image", "name", "nickname", "wallpaper", "admin", "emoji"];

module.exports.run = async ({ api, event, args, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const botID = api.getCurrentUserID();
  const threadInfo = await api.getThreadInfo(threadID);

  if (!threadInfo.adminIDs.some(a => a.id == senderID) && !DEV.includes(senderID))
    return api.sendMessage("❌ أنت ما عندك صلاحية لتشغيل الحماية! 🐱‍👤 سيرا تشان تحذر!", threadID, messageID);

  if (!threadInfo.adminIDs.some(a => a.id == botID))
    return api.sendMessage("❌ البوت بحاجة أن يكون أدمن لتفعيل الحماية ⚡", threadID, messageID);

  const threadData = (await Threads.getData(threadID)).data || {};
  if (!threadData.guard) threadData.guard = {};

  // التفعيل حسب الفئة
  const target = args[0] ? args[0].toLowerCase() : null;

  if (!target) {
    return api.sendMessage(
      `⚡ استخدم: .حماية [فئة/كل]\n💠 الفئات: image، name، nickname، wallpaper، admin، emoji\n💠 كل → لتفعيل جميع الفئات`, 
      threadID, messageID
    );
  }

  if (target === "كل") {
    PROTECT_TYPES.forEach(type => threadData.guard[type] = true);
    await Threads.setData(threadID, { data: threadData });
    global.data.threadData.set(parseInt(threadID), threadData);
    return api.sendMessage(`✅ تم تفعيل حماية جميع الفئات ⚡ بوجود سيرا تشان!`, threadID, messageID);
  }

  if (!PROTECT_TYPES.includes(target))
    return api.sendMessage(`❌ الفئة غير موجودة! استخدم أحد الخيارات: image، name، nickname، wallpaper، admin، emoji، كل`, threadID, messageID);

  // تفعيل الفئة المطلوبة فقط
  threadData.guard[target] = true;
  await Threads.setData(threadID, { data: threadData });
  global.data.threadData.set(parseInt(threadID), threadData);

  return api.sendMessage(`✅ تم تفعيل حماية فئة: ${target} ⚡ بوجود سيرا تشان!`, threadID, messageID);
};

// مراقبة الأحداث
module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, logMessageType } = event;
  const botID = api.getCurrentUserID();
  const threadData = global.data.threadData.get(threadID) || {};
  if (!threadData.guard) return;
  if (senderID == botID || DEV.includes(senderID)) return;

  const info = await api.getThreadInfo(threadID);
  const safeIDs = info.adminIDs.map(a => a.id).concat(DEV);

  if (!safeIDs.includes(senderID)) {
    if ((logMessageType === "log:thread-name" && threadData.guard.name) ||
        (logMessageType === "log:thread-icon" && threadData.guard.image) ||
        (logMessageType === "log:thread-admins" && threadData.guard.admin) ||
        (logMessageType === "log:thread-nickname" && threadData.guard.nickname) ||
        (logMessageType === "log:thread-wallpaper" && threadData.guard.wallpaper) ||
        (logMessageType === "log:thread-emoji" && threadData.guard.emoji)) {
          
      api.removeUserFromGroup(senderID, threadID);
      api.sendMessage(`😂 حاولت تعدّل شيء محمي في الكروب! سيرا تشان طلعت لك البطاقة وطردتك 🐾`, threadID);
    }
  }
};
