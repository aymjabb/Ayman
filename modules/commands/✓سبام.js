const fs = require("fs");
const path = require("path");

// ملاحظة: تأكد من وجود ملف seraBlacklist في نفس المجلد
const blacklist = require("./seraBlacklist");
const warnsPath = path.join(__dirname, "cache", "warns.json");

function loadWarns() {
  if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, "{}");
  return JSON.parse(fs.readFileSync(warnsPath, "utf-8"));
}

function saveWarns(data) {
  fs.writeFileSync(warnsPath, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "سبام",
  version: "6.6.6",
  hasPermssion: 1,
  credits: "Ayman & Sera",
  description: "نظام الرقابة الكارثي - طرد ومنع تشويش",
  commandCategory: "حماية",
  cooldowns: 0
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, body } = event;
  if (!body) return;

  const DEV = ["61577861540407"]; // الزعيم أيمن
  if (DEV.includes(senderID) || senderID == api.getCurrentUserID()) return;

  let warns = loadWarns();
  if (!warns[threadID]) warns[threadID] = {};
  if (!warns[threadID][senderID]) warns[threadID][senderID] = 0;

  const clean = body.toLowerCase().replace(/(.)\1+/g, "$1");

  // 1. الرقابة الصارمة (الكلمات المحظورة)
  if (blacklist.BLACK && blacklist.BLACK.some(word => clean.includes(word))) {
    warns[threadID][senderID]++;
    saveWarns(warns);
    const count = warns[threadID][senderID];

    if (count < 3) {
      return api.sendMessage(`⚠️ تحذير [ ${count}/3 ]\n──────────────────\nيا ${senderID}، لسانك حصانك! سيرا تشان لا تحب هذه الألفاظ.`, threadID);
    } else {
      await api.removeUserFromGroup(senderID, threadID);
      warns[threadID][senderID] = 0; // تصفير بعد الطرد
      saveWarns(warns);
      return api.sendMessage("🚀 تم نفي العضو خارج المجموعة.. لا مكان للقذارة هنا!", threadID);
    }
  }

  // 2. مكافحة التشويش (سبام الإيموجي)
  const emojiCount = (body.match(/[\p{Emoji}]/gu) || []).length;
  if (emojiCount >= 10) {
    await api.removeUserFromGroup(senderID, threadID);
    return api.sendMessage("🚫 ممنوع تشويش الإيموجيات! طرد فوري لنظافة الشات. ✨", threadID);
  }

  // 3. منع تكرار الحروف المزعج (مثلللللللللل)
  if (/(.)\1{15,}/.test(body)) {
    api.deleteMessage(event.messageID);
    return api.sendMessage("🤫 بلاش تمطيط في الكلام، الكلام الزايد ينحذف!", threadID);
  }
};

module.exports.run = async ({ api, event }) => {
  return api.sendMessage("🛡️ نظام سيرا الكارثي يعمل في الخلفية.. لا تحاول التجربة!", event.threadID);
};
