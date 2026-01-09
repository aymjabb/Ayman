const fs = require("fs-extra");
const path = require("path");

const cacheDir = path.join(__dirname, "cache");
const warnPath = path.join(cacheDir, "warns.json");

module.exports.config = {
  name: "تحذير",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "Ayman",
  description: "نظام تحذير (3 تحذيرات = إنذار أخير، 4 = طرد)",
  commandCategory: "إدارة",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageReply, mentions, type, messageID } = event;

  try {
    // إنشاء مجلد وملف التحذيرات
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    if (!fs.existsSync(warnPath)) fs.writeJsonSync(warnPath, {});

    const warns = fs.readJsonSync(warnPath);

    // تحديد الشخص
    let targetID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    }

    if (!targetID) {
      return api.sendMessage(
        "👤 رد على رسالة العضو أو منشنه لإعطائه تحذير.",
        threadID,
        messageID
      );
    }

    // معلومات المجموعة
    const threadInfo = await api.getThreadInfo(threadID);
    const botID = api.getCurrentUserID();

    // تحقق أن البوت أدمن
    if (!threadInfo.adminIDs.some(a => a.id == botID)) {
      return api.sendMessage(
        "❌ لا أستطيع تنفيذ التحذير، يجب أن أكون أدمن.",
        threadID,
        messageID
      );
    }

    // منع تحذير الأدمن
    if (threadInfo.adminIDs.some(a => a.id == targetID)) {
      return api.sendMessage(
        "⚠️ لا يمكن تحذير أحد الأدمنية.",
        threadID,
        messageID
      );
    }

    // تهيئة البيانات
    if (!warns[threadID]) warns[threadID] = {};
    if (!warns[threadID][targetID]) warns[threadID][targetID] = 0;

    // زيادة التحذير
    warns[threadID][targetID]++;
    const warnCount = warns[threadID][targetID];

    fs.writeJsonSync(warnPath, warns, { spaces: 2 });

    // الحالات
    if (warnCount < 3) {
      return api.sendMessage(
        `⚠️ تحذير!\nعدد التحذيرات: (${warnCount}/3)\nانتبه لسلوكك.`,
        threadID
      );
    }

    if (warnCount === 3) {
      return api.sendMessage(
        "🚨 تحذير أخير!\nهذه آخر فرصة لك.\nالتحذير القادم = طرد ❌",
        threadID
      );
    }

    // الطرد عند التحذير الرابع
    if (warnCount >= 4) {
      warns[threadID][targetID] = 0;
      fs.writeJsonSync(warnPath, warns, { spaces: 2 });

      await api.removeUserFromGroup(targetID, threadID);

      return api.sendMessage(
        "💥 تم الطرد!\nالعضو تجاوز الحد المسموح من التحذيرات.",
        threadID
      );
    }

  } catch (err) {
    console.error("خطأ أمر تحذير:", err);
    return api.sendMessage(
      "❌ حدث خطأ أثناء تنفيذ أمر التحذير.",
      event.threadID,
      event.messageID
    );
  }
};
