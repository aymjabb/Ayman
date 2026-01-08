module.exports = {
  name: "adminDev",
  description: "اوامر ادارية خاصة بالمطور فقط",
  role: "admin",
  cooldown: 0,

  async execute({ api, event, args, Users, Threads }) {

    const DEV_ID = "61577861540407";
    if (event.senderID !== DEV_ID) return;

    const command = event.body.trim();

    // ====== .استيقظ ======
    if (command === ".استيقظ") {
      return api.sendMessage(
        "…تم تفعيل الوعي\nالنظام لم يكن نائمًا",
        event.threadID
      );
    }

    // ====== .صمت ======
    if (command === ".صمت") {
      await api.setChatPermissions(event.threadID, { send_messages: false });
      return api.sendMessage(
        "الصوت غير مسموح\nالصمت فُرض بالقوة",
        event.threadID
      );
    }

    // ====== .تحرير ======
    if (command === ".تحرير") {
      await api.setChatPermissions(event.threadID, { send_messages: true });
      return api.sendMessage(
        "تم رفع القيود\nلكن المراقبة مستمرة",
        event.threadID
      );
    }

    // ====== .محو ======
    if (command === ".محو") {
      return api.sendMessage(
        "بعض الرسائل لم تعد موجودة\nالذاكرة عُدلت",
        event.threadID,
        () => api.unsendMessage(event.messageID)
      );
    }

    // ====== .إنذار ======
    if (command.startsWith(".إنذار")) {
      return api.sendMessage(
        "هذا تحذير نهائي\nالخطأ القادم لن يُغتفر",
        event.threadID
      );
    }

    // ====== .عقاب ======
    if (command.startsWith(".عقاب")) {
      return api.sendMessage(
        "تم تسجيل المخالفة\nالعقوبة نُفذت",
        event.threadID
      );
    }

    // ====== .طرد ======
    if (command.startsWith(".طرد ")) {
      const id = Object.keys(event.mentions)[0];
      if (!id) return;
      await api.removeUserFromGroup(id, event.threadID);
      return api.sendMessage(
        "تم الإبعاد من النظام\nلا عودة قريبة",
        event.threadID
      );
    }

    // ====== .طرد الكل ======
    if (command === ".طرد الكل") {
      const info = await api.getThreadInfo(event.threadID);
      for (const user of info.participantIDs) {
        if (user !== DEV_ID && user !== api.getCurrentUserID()) {
          await api.removeUserFromGroup(user, event.threadID);
        }
      }
      return api.sendMessage(
        "لم يتبقَ أحد\nالصمت يسيطر",
        event.threadID
      );
    }

    // ====== .قفل ======
    if (command === ".قفل") {
      await api.setChatPermissions(event.threadID, { send_messages: false });
      return api.sendMessage(
        "تم قفل الكروب\nالدخول غير مسموح",
        event.threadID
      );
    }

    // ====== .فتح ======
    if (command === ".فتح") {
      await api.setChatPermissions(event.threadID, { send_messages: true });
      return api.sendMessage(
        "تم فتح الكروب\nتحركوا بحذر",
        event.threadID
      );
    }

    // ====== .تطهير ======
    if (command === ".تطهير") {
      return api.sendMessage(
        "التطهير بدأ\nلا أحد فوق النظام",
        event.threadID
      );
    }

    // ====== .مراقبة ======
    if (command === ".مراقبة") {
      return api.sendMessage(
        "كل شيء يُسجل\nحتى الصمت",
        event.threadID
      );
    }

    // ====== .إخفاء ======
    if (command === ".إخفاء") {
      return api.sendMessage(
        "تم تعطيل الردود\nلكن العين مفتوحة",
        event.threadID
      );
    }

    // ====== .إنهاء ======
    if (command === ".إنهاء") {
      return api.sendMessage(
        "الجلسة انتهت\nلا أوامر بعد الآن",
        event.threadID
      );
    }
  }
};
