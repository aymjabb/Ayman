const fs = require("fs-extra");
const path = require("path");
const scoresPath = path.join(__dirname, "cache", "topPlayer.json");

// وظائف مساعدة
function loadData() {
    if (!fs.existsSync(scoresPath)) fs.outputJsonSync(scoresPath, {});
    return fs.readJsonSync(scoresPath);
}

function saveData(data) {
    fs.outputJsonSync(scoresPath, data);
}

module.exports.config = {
    name: "متجر",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Ayman",
    description: "متجر لشراء مميزات بنقاط المسابقات",
    commandCategory: "ترفيه",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args, Users }) => {
    const { threadID, messageID, senderID } = event;
    let data = loadData();

    if (!data[senderID]) data[senderID] = { name: await Users.getNameUser(senderID), wins: 0, points: 0 };
    
    // تحويل الفوزات لنقاط (كل فوز = 1000 نقطة) إذا كنت تريد نظام نقاط مستقل
    // هنا سنعتمد على "النقاط" كعملة
    let userPoints = data[senderID].points || 0;

    const shopMenu = `
🛍️ مـتـجـر سـيـرا تـشـان الـمـلكي 🛍️
──────────────────
💰 رصيدك الحالي: [ ${userPoints} ] نقطة

1️⃣ - شراء لقب مخصص (5000 نقطة)
2️⃣ - شراء حصانة من الطرد ليوم (10000 نقطة)
3️⃣ - تغيير كنية العضو (2000 نقطة)
4️⃣ - إرسال هدية نقاط لصديق (100 نقطة رسوم)

✨ للـشـراء: رد على الرسالة برقم العنصر
──────────────────
🐾 يـزيد حـماسـك.. تـزيد نـقاطـك!
`;

    return api.sendMessage(shopMenu, threadID, (err, info) => {
        global.client.handleReply.push({
            name: "متجر",
            messageID: info.messageID,
            author: senderID,
            points: userPoints
        });
    }, messageID);
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
    const { body, threadID, senderID, messageID } = event;
    if (handleReply.author !== senderID) return api.sendMessage("❌ هذا المتجر ليس لك!", threadID, messageID);

    let data = loadData();
    let user = data[senderID];

    if (body === "1") {
        if (user.points < 5000) return api.sendMessage("💔 نقاطك لا تكفي لشراء لقب!", threadID, messageID);
        user.points -= 5000;
        saveData(data);
        return api.sendMessage("✅ تم الشراء! أرسل الآن اللقب الذي تريده وسيقوم المطور بتثبيته لك.", threadID, messageID);
    }

    if (body === "2") {
        if (user.points < 10000) return api.sendMessage("💔 نقاطك لا تكفي لشراء حصانة!", threadID, messageID);
        user.points -= 10000;
        saveData(data);
        return api.sendMessage("🛡️ تم تفعيل الحصانة الملكية لمدة 24 ساعة!", threadID, messageID);
    }
    
    // يمكن إضافة المزيد من العمليات هنا بنفس الطريقة
};
