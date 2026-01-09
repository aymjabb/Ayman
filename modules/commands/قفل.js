module.exports.config = {
  name: "قفل",
  version: "1.0.1",
  hasPermssion: 1, // للأدمن والمطور
  credits: "Ayman & Sera",
  description: "منع الأعضاء الجدد من الانضمام (طرد تلقائي)",
  commandCategory: "إدارة",
  cooldowns: 0
};

// تهيئة مصفوفة القفل إذا لم تكن موجودة
if (!global.seraLock) global.seraLock = [];

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, logMessageType, logMessageData } = event;

  // التحقق من القفل ونوع الحدث (انضمام عضو جديد)
  if (global.seraLock.includes(threadID) && logMessageType === "log:subscribe") {
    const targetID = logMessageData.addedParticipants[0].userID;

    // طرد العضو الجديد
    try {
      await api.removeUserFromGroup(targetID, threadID);
      await api.sendMessage(
        "🚫 المجموعة مقفلة حالياً بأمر الإدارة، تم طرد العضو الجديد.\n🐾 حماية: سيرا تشان",
        threadID
      );
    } catch (err) {
      console.error(`فشل طرد العضو الجديد: ${targetID}`, err);
    }
  }
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID } = event;
  const action = args[0];

  // فتح المجموعة
  if (action === "فتح") {
    global.seraLock = global.seraLock.filter(id => id !== threadID);
    return api.sendMessage(
      "🔓 تم فتح المجموعة، يمكن للأعضاء الجدد الانضمام الآن.\n🐾 بواسطة سيرا تشان",
      threadID
    );
  }

  // قفل المجموعة
  if (!global.seraLock.includes(threadID)) global.seraLock.push(threadID);
  return api.sendMessage(
    "🔒 تم قفل المجموعة! أي عضو ينضم سيتم طرده فوراً.\n🐾 حماية: سيرا تشان",
    threadID
  );
};
