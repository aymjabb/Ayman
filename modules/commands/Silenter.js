module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let status = body.includes("اون") ? true : false;
    let threadData = global.data.threadData.get(threadID) || {};
    threadData.gameMode = status;
    global.data.threadData.set(threadID, threadData);

    api.sendMessage(`
╔══════════════
║ 🎮 وضع اللعبة
║ 💫 الوضع: ${status ? "مفعل" : "معطل"}
║ 🔹 أي شخص يتكلم سيتم طرده بعد تحذيرين
║ 🔹 عدا الأشخاص الذين يردون على رسائل البوت للعبة
║ 🌟 ليلى تبقي اللعبة ممتعة وآمنة
╚══════════════
    `, threadID, messageID);
};
