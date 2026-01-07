const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "cache", "seraActivity.json");

module.exports.config = {
  name: "ادارة",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "SERA SYSTEM",
  description: "عرض ترتيب النشاط داخل الكروب",
  commandCategory: "الادارة",
  usages: ".ادارة",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;
  if (!fs.existsSync(dbPath)) return api.sendMessage("❌ لا يوجد بيانات بعد.", threadID);

  const db = JSON.parse(fs.readFileSync(dbPath));
  if (!db[threadID]) return api.sendMessage("❌ لا يوجد بيانات لهذا الكروب.", threadID);

  const users = Object.entries(db[threadID])
    .map(([id, data]) => ({ id, points: data.points, messages: data.messages }))
    .sort((a, b) => b.points - a.points);

  let msg = "╭━━━━━━〔 𝗦𝗘𝗥𝗔 • 𝗔𝗗𝗠𝗜𝗡 〕━━━━━━╮\n";
  users.forEach((u, i) => {
    msg += `${i+1}. ${u.id} » نقاط: ${u.points}, رسائل: ${u.messages}\n`;
  });
  msg += "╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯";

  api.sendMessage(msg, threadID);
};
