module.exports.config = {
  name: "مح",
  version: "1.1.0",
  hasPermssion: 1, // للأدمن والمطور
  credits: "Ayman & Sera",
  description: "طرد (مح) عضو من المجموعة",
  commandCategory: "إدارة",
  usages: "[منشن / رد / ايدي]",
  cooldowns: 2
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;

  // التحقق من صلاحيات البوت كأدمن لضمان القدرة على التنفيذ
  const threadInfo = await api.getThreadInfo(threadID);
  if (!threadInfo.adminIDs.some(item => item.id == api.getCurrentUserID())) 
    return api.sendMessage("❌ سيرا تشان تحتاج لرتبة (أدمن) لكي تقوم بعملية الـ (مح)!", threadID, messageID);

  let targetID;
  if (type == "message_reply") targetID = messageReply.senderID;
  else if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
  else targetID = args[0];

  if (!targetID) return api.sendMessage("👤 منشن الشخص أو رد على رسالته لعمل (مح).", threadID, messageID);

  return api.removeUserFromGroup(targetID, threadID, (err) => {
    if (err) return api.sendMessage("❌ فشلت العملية، قد يكون الشخص أدمن أو أعلى مني رتبة.", threadID, messageID);
    api.sendMessage("🚀 تم تنفيذ الـ (مح) بنجاح.. طار المزعج! 😎", threadID);
  });
};
