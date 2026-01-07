module.exports.config = {
  name: "adminCommands",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Sera Chan",
  description: "أوامر المطور فقط",
  commandCategory: "الإدارة",
  usages: ".اون / .اوف / -زيادة",
  cooldowns: 2
};

const SMART = require("../sera/smartSystem");
const OWNER_ID = "61577861540407";
const fs = require("fs-extra");

module.exports.handleEvent = async function({ api, event }) {
  const { body, threadID, senderID } = event;
  if (!body) return;
  if (senderID !== OWNER_ID) return;

  if (body === ".اون") {
    SMART.toggleSystem(true);
    return api.sendMessage("✅ تم تشغيل النظام الذكي", threadID);
  }

  if (body === ".اوف") {
    SMART.toggleSystem(false);
    return api.sendMessage("⛔ تم إيقاف النظام الذكي", threadID);
  }

  if (body.startsWith("-زيادة ")) {
    const parts = body.split(" ");
    if (parts.length === 3) {
      const userID = parts[1].replace("@","");
      const amount = parseInt(parts[2]);
      const users = fs.readJsonSync("./sera/users.json");
      if (!users[userID]) return api.sendMessage("❌ هذا العضو غير موجود", threadID);
      users[userID].money = (users[userID].money || 0) + amount;
      fs.writeJsonSync("./sera/users.json", users, { spaces: 2 });
      return api.sendMessage(`💰 تم إضافة ${amount} عملات لـ ${userID}`, threadID);
    }
  }
};
