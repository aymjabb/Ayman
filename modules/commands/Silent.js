module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let status = body.includes("اون") ? true : false;
    let threadData = global.data.threadData.get(threadID) || {};
    threadData.muteMode = status;
    global.data.threadData.set(threadID, threadData);

    api.sendMessage(`
╔══════════════
║ 🤐 وضع السكوت
║ 💫 الوضع: ${status ? "مفعل" : "معطل"}
║ 🔹 أي شخص يتكلم بعد التفعيل سيتم تحذيره مرتين ثم طرده
║ 🔹 يسمح للمطورين والأشخاص المصرح لهم بالتحدث
║ 🌸 ليلى تراقب كل حركة
╚══════════════
    `, threadID, messageID);
};
