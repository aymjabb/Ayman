module.exports.config = {
  name: "تصفية",
  version: "1.0.1",
  hasPermssion: 2, // للمطور فقط
  credits: "Ayman & Sera",
  description: "طرد جميع الأصنام (الخاملين) الذين لم يرسلوا أي رسالة",
  commandCategory: "المطور",
  cooldowns: 30
};

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const DEV_ID = "61577861540407"; // أيديك يا زعيم

  // التحقق من صلاحية المستخدم
  if (senderID !== DEV_ID) 
    return api.sendMessage("⚠️ هذا الأمر خطر جداً ومخصص للمطور أيمن فقط!", threadID, messageID);

  try {
    // جلب معلومات المجموعة وبياناتها
    const threadInfo = await api.getThreadInfo(threadID);
    const threadData = await Threads.getData(threadID);
    const members = threadInfo.participantIDs;

    // سجل الرسائل لكل عضو (أو افتراضي فارغ)
    const storage = threadData.threadInfo?.totalMsgDict || {};

    // تحديد الأصنام (0 رسائل) واستثناء البوت والمطور
    const ghosts = members.filter(id => {
      const msgCount = storage[id] || 0;
      return msgCount === 0 && id !== api.getCurrentUserID() && id !== DEV_ID;
    });

    if (ghosts.length === 0) {
      return api.sendMessage(
        "✨ المجموعة نظيفة تماماً! لا يوجد أصنام لطردهم.\n🐾 سيرا تشان فخورة بمتفاعلينها!", 
        threadID, 
        messageID
      );
    }

    // رسالة أولية قبل التصفية
    await api.sendMessage(
      `⚠️ تم اكتشاف ${ghosts.length} صنم.. جاري بدء عملية التنظيف الشاملة! 🚀\n🐾 سيرا تشان تعمل على المهمة..`, 
      threadID
    );

    let count = 0;
    for (const id of ghosts) {
      try {
        await api.removeUserFromGroup(id, threadID); // طرد العضو
        count++;
        // تأخير بسيط لتجنب حظر البوت
        await new Promise(resolve => setTimeout(resolve, 1000)); 
      } catch (err) {
        console.error(`فشل طرد العضو: ${id}`);
      }
    }

    // رسالة بعد اكتمال التصفية مع طابع سيرا
    return api.sendMessage(
      `✅ تمت العملية بنجاح!\n──────────────────\n` +
      `💥 تم طرد: ${count} صنم.\n` +
      `🧹 المجموعة الآن منتعشة بالمتفاعلين فقط!\n` +
      `──────────────────\n🐾 سيرا تشان تحت أمرك دائماً!`, 
      threadID
    );

  } catch (e) {
    console.error("خطأ أثناء التصفية:", e);
    return api.sendMessage(
      "❌ حدث خطأ أثناء محاولة التصفية، تأكد أن البوت أدمن ولديه صلاحيات.", 
      threadID, 
      messageID
    );
  }
};
