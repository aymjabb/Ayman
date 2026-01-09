const fs = require("fs-extra");
const path = require("path");
const scoresPath = path.join(__dirname, "cache", "topPlayer.json");

// تحميل النقاط
function loadScores() {
    if (!fs.existsSync(scoresPath)) fs.outputJsonSync(scoresPath, {});
    return fs.readJsonSync(scoresPath);
}

// حفظ الفوز وتحديث النقاط
function saveScore(senderID, name) {
    const scores = loadScores();
    if (!scores[senderID]) scores[senderID] = { name: name, wins: 0, lastWin: null };
    scores[senderID].wins += 1;
    scores[senderID].lastWin = new Date().toISOString();
    fs.outputJsonSync(scoresPath, scores, { spaces: 2 });
    return scores[senderID].wins;
}

module.exports.config = {
    name: "مسابقة",
    version: "2.1.0",
    hasPermssion: 0,
    credits: "Ayman & Sera",
    description: "مسابقات مع نظام نقاط وتصنيف",
    commandCategory: "ترفيه",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID } = event;

    const games = [
        { q: "ما هو الشيء الذي يكتب ولا يقرأ؟", a: "القلم" },
        { q: "ما هو الشيء الذي كلما زاد نقص؟", a: "العمر" },
        { q: "ما هو لون كوكب المريخ؟", a: "احمر" },
        { q: "عاصمة العراق؟", a: "بغداد" },
        { q: "كم عدد أيام الأسبوع؟", a: "7" }
    ];

    const game = games[Math.floor(Math.random() * games.length)];

    // إرسال السؤال
    api.sendMessage(
        `🎮【 مسابقة سيرا تشان 】🎮
──────────────────
❓ السؤال: ${game.q}
💡 اكتب الإجابة أو رد على هذه الرسالة
──────────────────
🐾 أول من يجيب صحيحًا يكسب نقطة!`,
        threadID,
        (err, info) => {
            if (err) return console.error(err);
            // تسجيل الرد
            global.client.handleReply.push({
                name: "مسابقة",
                messageID: info.messageID,
                answer: game.a.toLowerCase(), // لتسهيل المقارنة
                answered: false // لمنع أكثر من فائز
            });
        },
        messageID
    );
};

module.exports.handleReply = async ({ api, event, handleReply, Users }) => {
    const { body, threadID, senderID, messageID } = event;

    if (handleReply.name !== "مسابقة") return;

    if (handleReply.answered) return; // سؤال تم الإجابة عليه مسبقًا

    if (body.trim().toLowerCase() === handleReply.answer) {
        const name = await Users.getNameUser(senderID);
        const wins = saveScore(senderID, name);
        handleReply.answered = true;

        api.sendMessage(
            `✅ أحسنت يا ${name}!\nإجابتك صحيحة وتم إضافة نقطة لفوزك! 🏆\n📊 مجموع نقاطك: ${wins}`,
            threadID,
            messageID
        );

        // إزالة السؤال من قائمة الرد
