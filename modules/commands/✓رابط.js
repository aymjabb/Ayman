const axios = require('axios');

module.exports.config = {
  name: "رابط",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "عمر & سيرا تشان",
  description: "تحويل صورك لروابط Imgur دائمة ✨",
  usePrefix: true,
  commandCategory: "خدمات سيرا",
  usages: "[رد على صورة]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, messageReply, type, attachments } = event;
  let links = [];

  // جلب الروابط من الرد أو المرفقات المباشرة
  if (type === "message_reply" && messageReply.attachments.length > 0) {
    for (let item of messageReply.attachments) {
      if (item.type === "photo") links.push(item.url);
    }
  } else if (attachments.length > 0) {
    for (let item of attachments) {
      if (item.type === "photo") links.push(item.url);
    }
  }

  if (links.length === 0) {
    return api.sendMessage('╭──── • ◈ • ────╮\n  يوه! وين الصورة؟ ✨\n╰──── • ◈ • ────╯\n\nرد على صورة أو أرسلها مع الأمر عشان سيرا تعطيك الرابط! 🐾', threadID, messageID);
  }

  api.sendMessage(`✨ لحظة بس يا عسل.. سيرا جالسة ترفع ${links.length} صورة... 🐾`, threadID, messageID);

  let result = [];
  try {
    for (let url of links) {
      // استخدام API مستقر لرفع الصور على Imgur
      const res = await axios.get(`https://api.imgbb.com/1/upload?key=6032488a033f67a21696237c04192b0e&image=${encodeURIComponent(url)}`);
      if (res.data && res.data.data && res.data.data.url) {
        result.push(res.data.data.url);
      }
    }

    if (result.length === 0) throw new Error("فشل الرفع");

    let replyMsg = `╭──── • ◈ • ────╮\n  تـم تـجـهـيـز الـروابـط ✨\n╰──── • ◈ • ────╯\n\n`;
    result.forEach((link, i) => {
      replyMsg += `🖼️ الـرابط ${i + 1}:\n🔗 ${link}\n\n`;
    });
    replyMsg += `🐾 سيرا تتمنى لك يوماً سعيداً! ✨`;

    return api.sendMessage(replyMsg, threadID, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage('🥺 سيرا اعتذرت! فشل رفع الصور، يمكن الرابط الأصلي فيه مشكلة أو السيرفر مضغوط.', threadID, messageID);
  }
};
