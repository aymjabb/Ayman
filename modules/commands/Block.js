module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let targetID;
    if(mentions) targetID = Object.keys(mentions)[0];
    else if(messageReply && messageReply.senderID) targetID = messageReply.senderID;
    else return api.sendMessage("❌ الرجاء الرد أو منشن الشخص", threadID, messageID);

    let bannedUsers = global.data.userBanned || new Map();
    bannedUsers.set(targetID, { reason: "تم الحظر بواسطة المطور", dateAdded: Date.now() });
    global.data.userBanned = bannedUsers;

    api.sendMessage(`🚫 تم حظر الشخص: ${targetID}\n❌ لن يستطيع استخدام البوت مجدداً`, threadID, messageID);
};
