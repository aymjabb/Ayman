module.exports.config = {
  name: "كتم",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "Ayman",
  description: "كتم عضو ومنعه من الكلام (حذف رسائله تلقائياً)",
  commandCategory: "إدارة",
  cooldowns: 0
};

// مصفوفة الكتم العالمية
if (!global.seraMuted) global.seraMuted = [];

module.exports.handleEvent = async ({ api, event }) => {
  const { senderID, messageID } = event;
  if (!senderID || !messageID) return;

  if (global.seraMuted.includes(senderID)) {
    try {
      await api.unsendMessage(messageID); // حذف الرسالة فوراً
    } catch (err) {
      console.error(`❌ فشل حذف رسالة ${messageID}:`, err.message);
    }
  }
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageReply, mentions, type } = event;
  
  // تحديد العضو المستهدف (رد أو منشن)
  let targetID = (type === "message_reply" && messageReply) ? messageReply.senderID 
                 : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : null);

  if (args[0] && args[0].toLowerCase() === "فك") {
    if (!targetID) return api.sendMessage("👤 منشن الشخص أو رد على رسالته لفك الكتم.", threadID);
    global.seraMuted = global.seraMuted.filter(id => id !== targetID);
    return api.sendMessage("🔓 تم فك الكتم بنجاح، يمكنه الآن إرسال الرسائل.", threadID);
  }

  if (!targetID) return api.sendMessage("👤 منشن الشخص أو رد على رسالته لكتمه.", threadID);

  if (!global.seraMuted.includes(targetID)) global.seraMuted.push(targetID);

  return api.sendMessage(
    `🤫 تم كتم العضو بنجاح!\n──────────────────\n📛 أي رسالة يرسلها ستتم حذفها تلقائياً بواسطة سيرا تشان.`,
    threadID
  );
};
