module.exports = function({ api, event, Threads }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let text = body.replace(".اخطار", "").trim();
    if(!text) return api.sendMessage("❌ ضع نص الرسالة", threadID, messageID);

    (async () => {
        let allThreads = await Threads.getAll();
        for(let th of allThreads) {
            api.sendMessage(`⚠️ تنبيه من المطور:\n\n${text}`, th.threadID);
        }
    })();
    api.sendMessage("✅ تم إرسال الرسالة لكل الكروبات", threadID, messageID);
};
