module.exports.config = {
  name: "تصفية",
  version: "1.0.0",
  hasPermssion: 2, // للمطور (أيمن) فقط لحماية المجموعة من الطرد العشوائي
  credits: "Ayman & Sera",
  description: "طرد جميع الأصنام (الخاملين) الذين لم يرسلوا أي رسالة",
  commandCategory: "المطور",
  cooldowns: 30
};

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const DEV_ID = "61577861540407"; // أيديك يا زعيم

  if (senderID !== DEV_ID) return api.sendMessage("⚠️ هذا الأمر خطر جداً ومخصص للمطور أيمن فقط!", threadID, messageID);

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const threadData = await Threads.getData(threadID);
    const members = threadInfo.participantIDs;
    
    // جلب سجل الرسائل
    const storage = threadData.threadInfo.totalMsgDict || {};
    
    // تحديد الأصنام (الذين رسائلهم = 0) مع استثناء البوت والمطور
    const ghosts = members.filter(id => {
      const msgCount = storage[id] || 0;
      return msgCount === 0 && id !== api.getCurrentUserID() && id !== DEV_ID;
    });

    if (ghosts.length === 0) {
      return api.sendMessage("✨ المجموعة نظيفة تماماً! لا يوجد أصنام لطردهم.", threadID, messageID);
    }

    api.sendMessage(`⚠️ تم اكتشاف ${ghosts.length} صنم.. جاري بدء عملية التنظيف الشاملة! 🚀`, threadID);

    let count = 0;
    for (const id of ghosts) {
      try {
        await api.removeUserFromGroup(id, threadID);
        count++;
        // تأخير بسيط لتجنب حظر البوت من قبل فيسبوك
        await new Promise(resolve => setTimeout(resolve, 1000)); 
      } catch (err) {
        console.error(`فشل طرد الأيدي: ${id}`);
      }
    }

    return api.sendMessage(`✅ تمت العملية بنجاح!\n💥 تم طرد: ${count} صنم.\n🧹 المجموعة الآن منتعشة بالمتفاعلين فقط! 🐾`, threadID);

  } catch (e) {
    console.log(e);
    return api.sendMessage("❌ حدث خطأ أثناء محاولة التصفية، تأكد من أنني أدمن.", threadID, messageID);
  }
};
