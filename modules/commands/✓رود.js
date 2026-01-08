module.exports.config = {
  name: "goibot",
  version: "1.4.0",
  hasPermssion: 0,
  credits: "Ayman",
  description: "ردود آلية هادئة",
  commandCategory: "نظام",
  cooldowns: 5,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { body, senderID, threadID } = event;
  if (!body || !body.toLowerCase().includes(".سيرا")) return;

  const responses = [
    "نعم، أنا أسمعك.. كيف يمكنني مساعدتك؟ ✨",
    "سيرا تشان في الخدمة دائماً. 🌸",
    "الزعيم أيمن يراقب المكان، كن مهذباً. 👑"
  ];
  
  const rand = responses[Math.floor(Math.random() * responses.length)];
  return api.sendMessage(rand, threadID);
};
