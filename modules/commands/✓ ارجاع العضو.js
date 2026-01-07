const fs = require("fs");
const path = require("path");

// استدعاء موديل الترحيب
const welcomeModule = require("./ترحيب"); // تأكد أن اسم الملف مطابق

module.exports.config = {
  name: "ارجاع",
  version: "1.0.1",
  hasPermssion: 2, // 1 = المشرفين، 2 = المطور
  credits: "Sera Chan",
  description: "يرجع أي شخص يخرج من الكروب ويرحب به برسالة دلع مع تسجيله للاستثناء",
  commandCategory: "الادارة",
  usages: ".ارجاع [ID الشخص]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  const { threadID } = event;
  if (!args[0]) return api.sendMessage("❌ استخدم: .ارجاع <ID الشخص>", threadID);

  const userID = args[0].trim();

  try {
    // إعادة العضو للكروب
    await api.addUserToGroup(userID, threadID);

    // تسجيل العضو كمعفى من الترحيب التلقائي
    welcomeModule.markReturnedUser(threadID, userID);

    // رسالة ترحيب دلع
    const name = await Users.getNameUser(userID);
    api.sendMessage(
      `🥳 تم إعادة ${name} للكروب بنجاح!\n😹 سيرا تشان تقول: "تعال نلعب مجددًا!"`,
      threadID
    );
  } catch (e) {
    console.log("❌ خطأ في إعادة العضو:", e.message);
    api.sendMessage(`❌ لم أستطع إعادة العضو: ${e.message}`, threadID);
  }
};
