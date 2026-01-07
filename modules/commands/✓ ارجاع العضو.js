const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "ارجاع",
  version: "1.0.0",
  hasPermssion: 2, // 1 = المشرفين، 2 = المطور
  credits: "Sera Chan",
  description: "يرجع أي شخص يخرج من الكروب ويرحب به برسالة دلع",
  commandCategory: "الادارة",
  usages: ".ارجاع",
  cooldowns: 5
};

let enabledGroups = {}; // حفظ حالة التفعيل لكل مجموعة

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;

  // تفعيل/تعطيل النظام
  if (!args[0]) return api.sendMessage("❌ استخدم: .ارجاع تشغيل/ايقاف", threadID);
  if (args[0].toLowerCase() === "تشغيل") {
    enabledGroups[threadID] = true;
    return api.sendMessage("✅ تم تفعيل نظام إرجاع الأعضاء في هذه المجموعة", threadID);
  }
  if (args[0].toLowerCase() === "ايقاف") {
    enabledGroups[threadID] = false;
    return api.sendMessage("⚠️ تم تعطيل نظام إرجاع الأعضاء في هذه المجموعة", threadID);
  }

  return api.sendMessage("❌ الخيار غير معروف، استخدم تشغيل أو ايقاف", threadID);
};

// يجب إضافة هذا الحدث في بوتك الرئيسي
module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, logMessageType, logMessageData } = event;

  if (!enabledGroups[threadID]) return; // النظام غير مفعل في هذه المجموعة

  // مراقبة خروج الأعضاء
  if (logMessageType === "log:unsubscribe") {
    const leftUserID = logMessageData.leftParticipantFbId;

    // إعادة الإضافة بعد 2 ثانية
    setTimeout(async () => {
      try {
        await api.addUserToGroup(leftUserID, threadID);

        // إرسال رسالة دلع وترحيب
        const name = await Users.getNameUser(leftUserID);
        api.sendMessage(
          `🥳 أهلاً مجددًا ${name}! لا تحاول الهرب 😹\nسيرا تشان تقول: "تعال نلعب!"`,
          threadID
        );
      } catch (e) {
        console.log("❌ لم أستطع إعادة العضو:", e.message);
      }
    }, 2000);
  }
};
