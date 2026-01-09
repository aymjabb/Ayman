module.exports.config = {
  name: "تبليغ",
  version: "1.0.1",
  hasPermssion: 1, // للأدمن والمطور
  credits: "Sera Chan",
  description: "إرسال تبليغ هام للمجموعة مع منشن للكل",
  commandCategory: "إدارة",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const content = args.join(" ");

  // التحقق من كتابة التبليغ
  if (!content) 
    return api.sendMessage("📩 أكتب التبليغ الذي تريد إرساله.", threadID, messageID);

  try {
    // جلب قائمة الأعضاء
    const threadInfo = await api.getThreadInfo(threadID);
    const ids = threadInfo.participantIDs;

    // تحضير رسالة التبليغ
    let msg = `📣 ⚠️ تـبـلـيـغ إداري هـام ⚠️ 📣\n──────────────────\n` +
              `${content}\n──────────────────\n` +
              `🐾 من فريق سيرا تشان`;

    // تجهيز mentions لكل الأعضاء
    let mentions = ids.map(id => ({ tag: "@تبليغ", id }));

    // إرسال الرسالة
    return api.sendMessage({ body: msg, mentions }, threadID);

  } catch (err) {
    console.error("خطأ أثناء إرسال التبليغ:", err);
    return api.sendMessage("❌ حدث خطأ أثناء إرسال التبليغ، حاول مرة أخرى.", threadID, messageID);
  }
};
