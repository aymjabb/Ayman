module.exports.config = {
  name: "نشر",
  version: "1.0.0",
  hasPermssion: 2, // للمطور فقط
  credits: "Ayman",
  description: "إرسال رسالة لجميع المجموعات",
  commandCategory: "المطور",
  usages: ".نشر [النص]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  if (senderID !== "61577861540407") return; // حماية إضافية لك

  const content = args.join(" ");
  if (!content) return api.sendMessage("📩 أرسل النص الذي تريد نشره يا زعيم.", threadID, messageID);

  const allThreads = await api.getThreadList(500, null, ["INBOX"]);
  let count = 0;

  for (const thread of allThreads) {
    if (thread.isGroup && thread.threadID !== threadID) {
      await api.sendMessage(`📢 إعلان من المطور أيمن:\n──────────────────\n${content}`, thread.threadID);
      count++;
    }
  }

  return api.sendMessage(`✅ تم نشر الرسالة بنجاح في ${count} مجموعة.`, threadID, messageID);
};
