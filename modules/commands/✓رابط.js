const axios = require('axios');

module.exports.config = {
  name: "رابط",
  version: "1.5.0",
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
  if (type === "message_reply" && messageReply.attachments && messageReply.attachments.length > 0) {
    for (let item of messageReply.attachments) {
      if (item.type === "photo") links.push(item.url);
    }
  } else if (attachments && attachments.length > 0) {
    for (let item of attachments) {
      if (item.type === "photo") links.push(item.url);
    }
  }

  if (links.length === 0) {
    return api.sendMessage('╭──── • ◈ • ────╮\n  يوه! وين الصورة؟ ✨\n╰──── • ◈ • ────╯\n\n🐾 رد على صورة أو أرسلها مع الأمر عشان سيرا تعطيك الرابط المباشر! ✨', threadID, messageID);
  }

  api.sendMessage(`✨ ثواني يا عسل.. سيرا قاعدة ترفع الصور للسحاب.. 🐾`, threadID, messageID);

  let result = [];
  
  for (let url of links) {
    try {
      // المحرك الأول: Imgur API المستقر
      const res = await axios.get(`https://api.disite.xyz/imgur?url=${encodeURIComponent(url)}`);
      if (res.data && res.data.url) {
        result.push(res.data.url);
      } else {
        // المحرك الثاني الاحتياطي: Cloudinary/Imgur Proxy
        const res2 = await axios.get(`https://api.sandipbaruwal.com/imgur?url=${encodeURIComponent(url)}`);
        if (res2.data && res2.data.url) {
          result.push(res2.data.url);
        }
      }
    } catch (e) {
      console.log("خطأ في رفع صورة واحدة، جاري المحاولة مرة أخرى...");
    }
  }

  if (result.length === 0) {
    return api.sendMessage('🥺 سيرا اعتذرت! السيرفرات الحين نايمة، جرب ترفع الصورة مرة ثانية بعد شوي.', threadID, messageID);
  }

  let replyMsg = `╭──── • ◈ • ────╮\n  تـم تـجـهـيـز الـروابـط ✨\n╰──── • ◈ • ────╯\n\n`;
  result.forEach((link, i) => {
    replyMsg += `🖼️ الـرابط ${i + 1}:\n🔗 ${link}\n\n`;
  });
  replyMsg += `🐾 سيرا تتمنى لك وقتاً ممتعاً! ✨`;

  return api.sendMessage(replyMsg, threadID, messageID);
};
