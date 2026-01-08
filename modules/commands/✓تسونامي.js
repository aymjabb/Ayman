const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "تسونامي",
  version: "5.0.0",
  hasPermssion: 2, 
  credits: "Sera Chan & Ayman",
  description: "نظام حماية الإدارة المطلق - حماية أيمن والبوت تلقائياً 🌊",
  commandCategory: "حماية",
  cooldowns: 5
};

// آيدي الزعيم أيمن (ثابت)
const AYMAN_ID = "61577861540407";

const statusPath = path.join(__dirname, "cache", "tsunamiStatus.json");
if (!fs.existsSync(statusPath)) fs.writeFileSync(statusPath, "{}");

module.exports.handleEvent = async ({ api, event }) => {
  const { logMessageType, logMessageData, threadID, author } = event;
  const status = JSON.parse(fs.readFileSync(statusPath, "utf-8"));

  if (status[threadID] === "OFF") return;

  // جلب آيدي البوت الحالي تلقائياً دون الحاجة لكتابته
  const botID = api.getCurrentUserID();
  const PROTECTED_LIST = [AYMAN_ID, botID];

  // مراقبة تغييرات الإدارة
  if (logMessageType === "log:thread-admins") {
    const targetID = String(logMessageData?.TARGET_ID);
    
    // إذا تمت محاولة إنزالك أو إنزال البوت من الإدارة
    if (PROTECTED_LIST.includes(targetID)) {
      
      // 1. طرد المعتدي فوراً (إلا إذا كان المعتدي هو أنت)
      if (String(author) !== AYMAN_ID) {
        try {
          await api.removeUserFromGroup(author, threadID);
        } catch (e) { console.log("فشل طرد المعتدي") }
      }

      // 2. تنظيف الإدارة من البقية لضمان السيطرة
      const info = await api.getThreadInfo(threadID);
      for (const admin of info.adminIDs) {
        if (!PROTECTED_LIST.includes(String(admin.id))) {
          try {
            await api.changeAdminStatus(threadID, admin.id, false);
          } catch (e) {}
        }
      }

      // 3. إعادة تنصيب العضو المحمي (أنت أو البوت)
      try {
        await api.changeAdminStatus(threadID, targetID, true);
      } catch (e) {}

      return api.sendMessage(
`🌊 إعـصـار الـتـسـونـامـي!! 🌊
──────────────────
⚠️ كشف محاولة غدر ضد الإدارة العليا!
👑 تم سحق المعتدي وإعادة السيطرة لـ أيمن وسيرا.

النظام الآن تحت الحماية المطلقة.`, threadID);
    }
  }
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const status = JSON.parse(fs.readFileSync(statusPath, "utf-8"));

  if (args[0] === "تشغيل") {
    status[threadID] = "ON";
    fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
    return api.sendMessage("🌊 تسونامي الحماية مفعل! أنت والبوت في أمان كامل. 🛡️", threadID, messageID);
  } 
  
  if (args[0] === "إيقاف") {
    status[threadID] = "OFF";
    fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
    return api.sendMessage("🚫 تم إيقاف التسونامي..", threadID, messageID);
  }

  return api.sendMessage(
`❓ التحكم في تسونامي:
──────────────────
🌊 للتشغيل: .تسونامي تشغيل
🚫 للإيقاف: .تسونامي إيقاف`, threadID, messageID);
};
