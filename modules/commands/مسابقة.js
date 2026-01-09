const fs = require("fs-extra");
const path = require("path");
const scoresPath = path.join(__dirname, "cache", "topPlayer.json");

function loadScores() {
    if (!fs.existsSync(scoresPath)) fs.outputJsonSync(scoresPath, {});
    return fs.readJsonSync(scoresPath);
}

function saveScore(senderID, name) {
    let scores = loadScores();
    if (!scores[senderID]) scores[senderID] = { name: name, wins: 0 };
    scores[senderID].wins += 1;
    fs.outputJsonSync(scoresPath, scores);
}

module.exports.config = {
    name: "مسابقة",
    version: "2.0.0",
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
        { q: "عاصمة العراق؟", a: "بغداد" }
    ];
    const game = games[Math.floor(Math.random() * games.length)];

    api.sendMessage(`🎮 سؤال جديد:\n【 ${game.q} 】\n\n(رد على الرسالة بالإجابة)`, threadID, (err, info) => {
        global.client.handleReply.push({
            name: "مسابقة",
            messageID: info.messageID,
            answer: game.a
        });
    }, messageID);
};

module.exports.handleReply = async ({ api, event, handleReply, Users }) => {
    const { body, threadID, senderID, messageID } = event;
    if (handleReply.name !== "مسابقة") return;

    if (body.toLowerCase() === handleReply.answer.toLowerCase()) {
        const name = await Users.getNameUser(senderID);
        saveScore(senderID, name); // حفظ الفوز
        
        api.sendMessage(`✅ أحسنت يا ${name}!\nإجابتك صحيحة، تم إضافة فوز جديد لسجلك! 🏆`, threadID, messageID);
        const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
        if (index !== -1) global.client.handleReply.splice(index, 1);
    }
};
