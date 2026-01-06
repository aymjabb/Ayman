module.exports.config = {
  name: "حماية",
  version: "1.3.0",
  credits: "D-Jukie & عمر & سيرا تشان",
  hasPermssion: 1,
  description: "حماية الكروب بالكامل: أي تغيير غير مصرح به → طرد فوري بسخرية من سيرا تشان",
  usages: ."حماية",
  commandCategory: "المطور",
  cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const botID = api.getCurrentUserID();

  // الايديهات المسموح لهم
  const devs = ["61577861540407"]; // سيرا تشان
  const info = await api.getThreadInfo(threadID);

  if (!info.adminIDs.some(a => a.id == senderID) && !devs.includes(senderID)) 
    return api.sendMessage("❌ أنت ما عندك صلاحية لتشغيل الحماية! 🐱‍👤 سيرا تشان تحذر!", threadID, messageID);

  if (!info.adminIDs.some(a => a.id == botID))
    return api.sendMessage("❌ البوت بحاجة أن يكون أدمن لتشغيل الحماية! ⚡ سيرا تشان هنا!", threadID, messageID);

  const threadData = (await Threads.getData(threadID)).data || {};
  threadData.guard = !threadData.guard;
  await Threads.setData(threadID, { data: threadData });
  global.data.threadData.set(parseInt(threadID), threadData);

  return api.sendMessage(`✅ حماية الكروب ${(threadData.guard ? "مفعّلة" : "موقوفة")} ⚡ بوجود سيرا تشان!`, threadID, messageID);
};

// مراقبة التعديلات
module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, logMessageType } = event;
  const botID = api.getCurrentUserID();
  const threadData = global.data.threadData.get(threadID) || {};

  if (!threadData.guard) return; // الحماية مطفأة
  if (senderID == botID) return; // تجاهل البوت نفسه

  const info = await api.getThreadInfo(threadID);
  const devs = ["61577861540407"]; // سيرا تشان
  const safeIDs = info.adminIDs.map(a => a.id).concat(devs);

  // أي شخص ليس ضمن الأدمنز أو المطورين
  if (!safeIDs.includes(senderID)) {
    const kickTypes = [
      "log:thread-name",       // تغيير الاسم
      "log:thread-icon",       // تغيير الصورة
      "log:thread-admins"      // تعديل الأدمنية
    ];

    if (kickTypes.includes(logMessageType)) {
      api.removeUserFromGroup(senderID, threadID);
      api.sendMessage(`😂 حاولت تغيّر شيء في الكروب! سيرا تشان طلعت لك البطاقة وطردتك 🐾`, threadID);
    }
  }
};
