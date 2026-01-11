module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let targetID;
    if(mentions) targetID = Object.keys(mentions)[0];
    else if(messageReply && messageReply.senderID) targetID = messageReply.senderID;
    else return api.sendMessage("❌ الرجاء الرد على رسالة أو منشن الشخص", threadID, messageID);

    api.removeUserFromGroup(targetID, threadID, (err) => {
        if(err) api.sendMessage(`❌ فشل الطرد: ${err}`, threadID, messageID);
        else api.sendMessage(`
╔══════════════
║ 💥 طرد ناجح!
║ 👤 الشخص: ${targetID}
║ 😂 رسالة ساخرة: بوسة على الخد قبل الطرد 😹
╚══════════════
        `, threadID, messageID);
    });
};
