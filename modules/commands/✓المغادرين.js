const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "المغادرين",
    version: "1.3.0",
    hasPermssion: 1, // أدمن فقط
    credits: "Assistant & سيرا تشان",
    description: "عرض الأعضاء الذين غادروا أو طُردوا مع زخرفة الأسماء والرسائل",
    commandCategory: "المطور",
    usages: ".المغادرين [رقم لإعادة العضو / قائمة]",
    cooldowns: 5
};

const pathData = path.join(__dirname, "cache", "left_members.json");

module.exports.onLoad = () => {
    if (!fs.existsSync(pathData)) fs.writeFileSync(pathData, "{}", "utf-8");
};

// زخرفة الاسماء
function decorateName(name) {
    const fancyChars = "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩" +
                       "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃";
    return name.split("").map((c, i) => fancyChars[i % fancyChars.length] || c).join("");
}

// زخرفة الرسالة
function decorateMessage(msg) {
    const decor = ["❖", "✧", "✦", "✪", "✫", "✩", "✯", "❀", "✿", "★"];
    return msg.split("").map((c, i) => c + (decor[i % decor.length] || "")).join("");
}

// مراقبة خروج أو طرد أي عضو
module.exports.handleEvent = async function({ api, event, Users }) {
    const { threadID, leftParticipant } = event;
    if (!leftParticipant) return;

    const dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    if (!dataJson[threadID]) dataJson[threadID] = [];

    const userName = await Users.getNameUser(leftParticipant);
    const fancyName = decorateName(userName);

    dataJson[threadID].push({ id: leftParticipant, name: fancyName });

    fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
};

// أمر عرض القائمة أو إعادة عضو
module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    if (!dataJson[threadID] || dataJson[threadID].length === 0)
        return api.sendMessage("❌ لا يوجد أعضاء تم حفظهم للخروج!", threadID, messageID);

    // عرض القائمة
    if (!args[0] || args[0].toLowerCase() === "قائمة") {
        let list = decorateMessage("📋 قائمة الأعضاء الذين غادروا:\n\n");
        dataJson[threadID].forEach((u, i) => {
            list += decorateMessage(`${i + 1}. ${u.name} - ${u.id}\n`);
        });
        return api.sendMessage(list, threadID, messageID);
    }

    // إعادة عضو برقم
    const index = parseInt(args[0]) - 1;
    if (isNaN(index) || !dataJson[threadID][index])
        return api.sendMessage("⚠️ الرقم غير صالح!", threadID, messageID);

    const member = dataJson[threadID].splice(index, 1)[0];
    fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");

    api.addUserToGroup(member.id, threadID, (err) => {
        if (err) return api.sendMessage("❌ لم أستطع إعادة العضو! ربما غادر أو طُرد نهائياً.", threadID, messageID);
        api.sendMessage(decorateMessage(`🎉 العضو ${member.name} تم إرجاعه للمجموعة! 🌟 سيرا تشان ترحب بك مجدداً!`), threadID, messageID);
    });
};
