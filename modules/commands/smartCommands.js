module.exports.config = {
  name: "smartCommands",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "أوامر ذكية للمستخدمين والنظام",
  commandCategory: "النظام",
  usages: ".نقاط - .لقب",
  cooldowns: 5
};

const SMART = require("../sera/smartSystem");
const fs = require("fs-extra");
const OWNER_ID = "61577861540407";
const USERS_PATH = "./sera/users.json";
const RANK_PATH = "./sera/rankings.json";

// دالة لحفظ البيانات
function saveUsers(data) {
  fs.writeJsonSync(USERS_PATH, data, { spaces: 2 });
}
function saveRankings(data) {
  fs.writeJsonSync(RANK_PATH, data, { spaces: 2 });
}

module.exports.run = async function({ api, event }) {
  const { threadID, senderID, body } = event;
  const users = fs.readJsonSync(USERS_PATH);

  if (body.startsWith("-نقاط")) {
    // فقط للمطور
    if (senderID !== OWNER_ID) return api.sendMessage("❌ هذا الأمر للمطور فقط", threadID);
    const parts = body.split(" ");
    if (parts.length === 3) {
      const userID = parts[1].replace("@","");
      const amount = parseInt(parts[2]);
      if (!users[userID]) return api.sendMessage("❌ العضو غير موجود", threadID);
      users[userID].points = (users[userID].points || 0) + amount;
      saveUsers(users);
      return api.sendMessage(`✅ تم إضافة ${amount} نقطة لـ ${userID}`, threadID);
    }
  }

  if (body.startsWith(".لقب")) {
    const parts = body.split(" ");
    if (parts.length === 2) {
      const newTitle = parts[1];
      if (!users[senderID]) return api.sendMessage("❌ العضو غير موجود", threadID);
      users[senderID].title = newTitle;
      saveUsers(users);
      return api.sendMessage(`🏆 تم تغيير لقبك إلى: ${newTitle}`, threadID);
    }
  }

  if (body.startsWith(".رصيد")) {
    if (!users[senderID]) return api.sendMessage("❌ العضو غير موجود", threadID);
    const money = users[senderID].money || 0;
    const points = users[senderID].points || 0;
    return api.sendMessage(`💰 رصيدك: ${money} عملة\n⭐ نقاطك: ${points}`, threadID);
  }
};
