module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let status = body.includes("اون") ? true : false;
    let threadData = global.data.threadData.get(threadID) || {};
    threadData.protectAdmin = status;
    global.data.threadData.set(threadID, threadData);

    api.sendMessage(`🛡️ حماية المطور والبوت ${status ? "مفعلة" : "معطلة"}`, threadID, messageID);
};
