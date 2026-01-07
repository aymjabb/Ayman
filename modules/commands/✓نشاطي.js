const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "cache", "seraActivity.json");

module.exports.config = {
  name: "نشاطي",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SERA SYSTEM",
  description: "عرض نشاطك داخل الكروب",
  commandCategory: "الادارة",
  usages: ".نشاطي",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const { threadID, senderID } = event;
  if (!fs.existsSync(dbPath)) return api.sendMessage("❌ لا يوجد نشاط مسجل بعد.", threadID);

  const db = JSON.parse(fs.readFileSync(dbPath));
  if (!db[threadID] || !db[threadID][senderID]) {
    return api.sendMessage("❌ لا يوجد نشاط مسجل لك بعد.", threadID);
  }

  const u = db[threadID][senderID];

  const msg = `
╭━━━━━━━〔 𝗦𝗘𝗥𝗔 • 𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗬 〕━━━━━━━╮
👤 العضو: ${senderID}

💬 الرسائل: ${u.messages}
🖼️ الصور: ${u.images}
🚫 المسبّات: ${u.swears}
⚠️ التحذيرات: ${u.warnings}

⭐ النقاط: ${u.points}

╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

  api.sendMessage(msg, threadID);
};
