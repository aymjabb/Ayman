const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "كنية",
    version: "2.0.0",
    hasPermssion: 1,
    credits: "عمر & Assistant",
    description: "تعيين كنية شخصية للعضو بالاسم، البلد، MBTI مع زخرفة وحماية",
    commandCategory: "مسؤولي المجموعات",
    usages: "كنية @العضو <الاسم> <البلد> <MBTI>",
    cooldowns: 5
};

const filePath = path.join(__dirname, "cache", "user_nicknames.json");

module.exports.onLoad = () => {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}", "utf-8");
};

// الأمر الرئيسي لتعيين الكنية
module.exports.run = async function({ api, event, args, Users }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(a => a.id == senderID);
    if (!isAdmin) return api.sendMessage("❌ فقط الأدمنز يمكنهم تعيين الكنية!", threadID, messageID);

    // اختيار العضو المستهدف
    let targetID;
    if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
    else if (messageReply && messageReply.senderID) targetID = messageReply.senderID;
    else return api.sendMessage("❌ الرجاء التاغ على العضو أو الرد على رسالته لتعيين الكنية!", threadID, messageID);

    // التأكد من إدخال الاسم + البلد + MBTI
    if (args.length < 3) return api.sendMessage("❌ الرجاء كتابة الاسم + البلد + MBTI", threadID, messageID);
    const name = args[0];
    const country = args[1];
    const mbti = args.slice(2).join(" ");

    const nicknameDecorated = `【${name}】|【${country}】|【${mbti}】`;

    // حفظ الكنية في ملف JSON
    const dataJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!dataJson[threadID]) dataJson[threadID] = {};
    dataJson[threadID][targetID] = nicknameDecorated;
    fs.writeFileSync(filePath, JSON.stringify(dataJson, null, 4), "utf-8");

    // تغيير الكنية داخل المجموعة
    try {
        await api.changeNickname(nicknameDecorated, threadID, targetID);
        const targetName = await Users.getNameUser(targetID);
        return api.sendMessage(`✅ تم تعيين كنية العضو: ${targetName}\n🌟 الكنية الجديدة: ${nicknameDecorated}`, threadID, messageID);
    } catch (e) {
        return api.sendMessage("❌ فشل تغيير الكنية، تأكد من أن البوت لديه صلاحية تغيير الاسم.", threadID, messageID);
    }
};

// الحدث لمراقبة تغيير الكنية من قبل العضو
module.exports.handleEvent = async function({ api, event }) {
    const { threadID, senderID } = event;

    const dataJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!dataJson[threadID] || !dataJson[threadID][senderID]) return;

    const nicknameOriginal = dataJson[threadID][senderID];

    try {
        await api.changeNickname(nicknameOriginal, threadID, senderID);
        api.sendMessage(`😂 حاولت تغيير كنيتك، بس سيرا رجعتلك كنيتك الأصلية: ${nicknameOriginal}`, threadID);
    } catch (e) {
        console.error("فشل استعادة الكنية:", e);
    }
};
