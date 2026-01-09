module.exports.config = {
  name: "قفل",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Ayman",
  description: "منع الأعضاء الجدد من الانضمام (طرد تلقائي)",
  commandCategory: "إدارة",
  cooldowns: 0
};

if (!global.seraLock) global.seraLock = [];

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, logMessageType, logMessageData } = event;
  if (global.seraLock.includes(threadID) && logMessageType === "log:subscribe") {
    const targetID = logMessageData.addedParticipants[0].userID;
    api.removeUserFromGroup(targetID, threadID);
    api.sendMessage("🚫 المجموعة مقفلة حالياً بأمر الإدارة، تم طرد العضو الجديد.", threadID);
  }
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID } = event;
  if (args[0] === "فتح") {
    global.seraLock = global.seraLock.filter(id => id != threadID);
    return api.sendMessage("🔓 تم فتح المجموعة، يمكن للأعضاء الجدد الانضمام الآن.", threadID);
  }
  global.seraLock.push(threadID);
  return api.sendMessage("🔒 تم قفل المجموعة! أي عضو ينضم سيتم طرده فوراً.", threadID);
};
