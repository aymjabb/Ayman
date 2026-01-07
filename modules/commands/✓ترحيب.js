let returnedUsers = {}; // الأعضاء المعفى من الترحيب لكل كروب

module.exports.markReturnedUser = function(threadID, userID) {
  if (!returnedUsers[threadID]) returnedUsers[threadID] = [];
  if (!returnedUsers[threadID].includes(userID)) returnedUsers[threadID].push(userID);
};

module.exports.isReturnedUser = function(threadID, userID) {
  return returnedUsers[threadID] && returnedUsers[threadID].includes(userID);
};

// الحدث الذي يراقب دخول الأعضاء
module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, logMessageType, logMessageData } = event;

  // إذا انضم عضو جديد
  if (logMessageType === "log:subscribe") {
    const newUserID = logMessageData.addedParticipants[0].userFbId;

    // إذا العضو معفى من الترحيب فلا ترسل رسالة
    if (module.exports.isReturnedUser(threadID, newUserID)) return;

    const name = await Users.getNameUser(newUserID);
    api.sendMessage(
      `🥳 أهلاً ${name}! 😹 سيرا تشان تقول: "مرحبًا بك في الكروب!"`,
      threadID
    );
  }
};
