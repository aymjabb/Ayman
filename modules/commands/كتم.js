module.exports.config = {
  name: "كتم",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Ayman",
  description: "كتم عضو ومنعه من الكلام (حذف رسائله تلقائياً)",
  commandCategory: "إدارة",
  cooldowns: 0
};

if (!global.seraMuted) global.seraMuted = [];

module.exports.handleEvent = async ({ api, event }) => {
  if (global.seraMuted.includes(event.senderID)) {
    api.unsendMessage(event.messageID); // حذف الرسالة فوراً
  }
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageReply, mentions, type } = event;
  let targetID = (type == "message_reply") ? messageReply.senderID : Object.keys(mentions)[0];

  if (args[0] == "فك") {
    global.seraMuted = global.seraMuted.filter(id => id != targetID);
    return api.sendMessage("🔓 تم فك الكتم، يمكنك الكلام الآن بحذر.", threadID);
  }

  if (!targetID) return api.sendMessage("👤 رد على الشخص أو منشنه لكتمه.", threadID);
  
  global.seraMuted.push(targetID);
  return api.sendMessage("🤫 تم كتم العضو.. أي رسالة سيرسلها ستحذفها سيرا فوراً!", threadID);
};
