module.exports.config = {
  name: "adminCommands",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Sera Chan",
  description: "أوامر خاصة بالمطور",
  commandCategory: "النظام",
  usages: ".اون - .اوف - زيادة - تصفير",
  cooldowns: 5
};

const SMART = require("../sera/smartSystem");
const fs = require("fs-extra");
const OWNER_ID = "61577861540407";
const USERS_PATH = "./sera/users.json";

module.exports.run = async function({ api, event }) {
  const { threadID, senderID, body } = event;
  if (senderID !== OWNER_ID) return;

  const users = fs.readJsonSync(USERS_PATH);

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
      if (!users[userID]) return api.sendMessage("❌ العضو غير موجود", threadID);
      users[userID].money = (users[userID].money || 0) + amount;
      fs.writeJsonSync(USERS_PATH, users, { spaces: 2 });
      return api.sendMessage(`💰 تم إضافة ${amount} عملات لـ ${userID}`, threadID);
    }
  }

  if (body.startsWith("-تصفير ")) {
    const parts = body.split(" ");
    if (parts.length === 2) {
      const userID = parts[1].replace("@","");
      if (!users[userID]) return api.sendMessage("❌ العضو غير موجود", threadID);
      users[userID].points = 0;
      users[userID].money = 0;
      fs.writeJsonSync(USERS_PATH, users, { spaces: 2 });
      return api.sendMessage(`🧹 تم تصفير نقاط وعملات ${userID}`, threadID);
    }
  }
};
