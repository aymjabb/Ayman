const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "ايقاف",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "سيرا تشان",
    description: "إيقاف البوت عن الرد على المستخدمين العاديين، يرد فقط على المطور",
    commandCategory: "system",
    usages: "ايقاف",
    cooldowns: 3
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const developers = ["61577861540407"]; // أضف هنا ID المطورين المصرح لهم

    if (!developers.includes(senderID)) {
        return api.sendMessage("⚠️ هذا الأمر مخصص للمطور فقط!", threadID, messageID);
    }

    // ملف حفظ حالة البوت
    const statusPath = path.join(__dirname, "cache", "bot_status.json");

    if (!fs.existsSync(path.dirname(statusPath))) fs.mkdirSync(path.dirname(statusPath), { recursive: true });
    if (!fs.existsSync(statusPath)) fs.writeFileSync(statusPath, JSON.stringify({ status: "active" }, null, 2));

    // قراءة الحالة الحالية
    let botStatus = JSON.parse(fs.readFileSync(statusPath, "utf-8"));

    // التبديل بين إيقاف وتشغيل
    if (botStatus.status === "active") {
        botStatus.status = "inactive";
        global.botStatus = botStatus; // تعيين الحالة للمتغير العام
        fs.writeFileSync(statusPath, JSON.stringify(botStatus, null, 2));
        return api.sendMessage("🔴 تم إيقاف البوت عن الرد على المستخدمين العاديين!\n✅ البوت سيرد على المطور فقط", threadID, messageID);
    } else {
        botStatus.status = "active";
        global.botStatus = botStatus;
        fs.writeFileSync(statusPath, JSON.stringify(botStatus, null, 2));
        return api.sendMessage("🟢 تم تشغيل البوت مجددًا وسيقوم بالرد على الجميع", threadID, messageID);
    }
};
