const fs = require("fs");
const path = require("path");
const blacklist = require("./seraBlacklist");

const warnsPath = path.join(__dirname, "cache", "warns.json");

// تحميل الإنذارات أو إنشاء جديد
function loadWarns() {
  if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, "{}");
  return JSON.parse(fs.readFileSync(warnsPath, "utf-8"));
}

// حفظ الإنذارات
function saveWarns(data) {
  fs.writeFileSync(warnsPath, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "سبام",
  version: "3.0.0",
  hasPermssion: 1,
  credits: "Sera Chan",
  description: "منع السباب الجنسي (18+) مع نظام إنذارات وطرد تلقائي",
  commandCategory: "حماية",
  cooldowns: 0
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, body } = event;
  if (!body) return;

  const DEV = ["61577861540407"]; // ايدي المطور
  if (DEV.includes(senderID)) return; // المطور مستثنى

  let warns = loadWarns();
  if (!warns[threadID]) warns[threadID] = {};
  if (!warns[threadID][senderID]) warns[threadID][senderID] = 0;

  const clean = body.toLowerCase().replace(/(.)\1+/g, "$1").replace(/[^\u0600-\u06FFa-z]/g, "");

  // ===== سب أسود 18+ =====
  if (blacklist.BLACK.some(word => clean.includes(word))) {
    warns[threadID][senderID]++;
    saveWarns(warns);

    const count = warns[threadID][senderID];

    if (count <= 2) {
      return api.sendMessage(`⚠️ تحذير #${count} بسبب سب جنسي ❌`, threadID);
    } else if (count === 3) {
      return api.sendMessage(`⛔ تم حظرك مؤقتًا بسبب تجاوز الإنذارات ⚡`, threadID);
    } else if (count >= 4) {
      try {
        await api.removeUserFromGroup(senderID, threadID);
        return api.sendMessage("💥 تجاوزت الإنذارات → تم طردك نهائيًا 😼", threadID);
      } catch (e) {
        return api.sendMessage("❌ خطأ أثناء محاولة الطرد", threadID);
      }
    }
  }

  // ===== سبام إيموجي =====
  const emojiCount = (body.match(/[\p{Emoji}]/gu) || []).length;
  if (emojiCount >= 10) {
    try {
      await api.removeUserFromGroup(senderID, threadID);
      return api.sendMessage("🚫 سبام إيموجي مفرط → طرد فوري ⚡", threadID);
    } catch {}
  } else if (emojiCount >= 5) {
    return api.sendMessage(`⚠️ تحذير: سبام إيموجي (${emojiCount} إيموجيات)`, threadID);
  }
};

module.exports.run = async ({ api, event }) => {
  return api.sendMessage(
    "🛡️ نظام منع السب الجنسي 18+ مفعّل.\n• الإنذارات → حظر مؤقت → طرد نهائي\n• سبام إيموجي = تحذير أو طرد تلقائي\n⚡ سيرا تشان تحمي الكروب 🐾",
    event.threadID,
    event.messageID
  );
};
