const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "ايقاف",
    version: "2.0.0",
    hasPermssion: 2, // للمطورين فقط
    credits: "سيرا تشان",
    description: "تخلي سيرا ترد بس على المطورين وتتجاهل الباقي ✨",
    commandCategory: "الادارة",
    usages: "ايقاف",
    cooldowns: 5
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, messageID, senderID } = event;
    
    // جلب الـ ID الخاص بالمطورين من ملف الإعدادات أو كتابتها هنا
    const developers = ["61577861540407", "61585157982983"]; 

    const statusPath = path.join(__dirname, "cache", "bot_status.json");

    // التأكد من وجود مجلد الكاش والملف
    if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));
    if (!fs.existsSync(statusPath)) fs.writeJsonSync(statusPath, { status: "active" });

    let botStatus = fs.readJsonSync(statusPath);

    if (botStatus.status === "active") {
        botStatus.status = "inactive";
        fs.writeJsonSync(statusPath, botStatus);
        
        // تفعيل الحالة في الذاكرة العامة للبوت
        global.botStatus = "inactive";

        return api.sendMessage(
            "╭──── • ◈ • ────╮\n  تـم تـفـعـيـل وضـع الـصـمـت ✨\n╰──── • ◈ • ────╯\n\nسيرا الحين رح ترتاح وتسمع كلام المطورين بس! 🎀\nباقي المستخدمين.. نومتكم سعيدة 😴", 
            threadID, messageID
        );
    } else {
        botStatus.status = "active";
        fs.writeJsonSync(statusPath, botStatus);
        
        global.botStatus = "active";

        return api.sendMessage(
            "╭──── • ◈ • ────╮\n  سيرا تشان عادت للعمل! ✨\n╰──── • ◈ • ────╯\n\nاشتقت لكم! الحين سيرا رح ترد على الكل وتلعب معكم من جديد 🥳💖", 
            threadID, messageID
        );
    }
};
