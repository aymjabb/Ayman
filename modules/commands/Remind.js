module.exports = {
    config: { name: "نبه" },
    run: async function({ api, event, args }) {
        const { threadID, messageID } = event;
        let [text, count, minutes] = args;
        count = Math.min(50, parseInt(count) || 1);
        minutes = Math.min(360, parseInt(minutes) || 1); // دقيقة حتى 6 ساعات

        api.sendMessage(`⏰ تم ضبط التنبيه: "${text}" كل ${minutes} دقيقة(s), ${count} مرة(s)`, threadID, messageID);

        for(let i = 0; i < count; i++) {
            setTimeout(() => api.sendMessage(`🔔 تنبيه: ${text}`, threadID), i * minutes * 60 * 1000);
        }
    }
};
