module.exports.config = {
  name: "رابط",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "عمر",
  description: "روابط مختصرة للصور التي تُرفق بها 🐱😺",
  usePrefix: false,
  commandCategory: "خدمات",
  usages: "[رد على صور أو إرسالها مباشرة]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const axios = global.nodemodule['axios'];
  let links = [];

  // جلب الروابط من الرد على رسالة أو الصور المرسلة مباشرة
  if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
    for (const attachment of event.messageReply.attachments) {
      if (attachment.type === "photo") links.push(attachment.url);
    }
  } else if (event.attachments && event.attachments.length > 0) {
    for (const attachment of event.attachments) {
      if (attachment.type === "photo") links.push(attachment.url);
    }
  } else {
    return api.sendMessage('🐱😺 أوه لا! ما في صور! رد على صورة أو أرسل صورة مباشرة لكي أعطيك رابطها المختصر.', event.threadID, event.messageID);
  }

  if (links.length === 0) {
    return api.sendMessage('😹 لم أجد أي صورة صالحة في الرسائل المرفقة.', event.threadID, event.messageID);
  }

  const shortenedLinks = [];

  try {
    for (const link of links) {
      const res = await axios.get(`https://bot.api-johnlester.repl.co/imgur?link=${encodeURIComponent(link)}`);
      if (res.data && res.data.uploaded && res.data.uploaded.image) {
        shortenedLinks.push(res.data.uploaded.image);
      } else {
        shortenedLinks.push("❌ فشل الحصول على الرابط");
      }
    }

    const formattedLinks = shortenedLinks.map((link, index) => `📌 صورة ${index + 1}: ${link}`).join('\n');
    return api.sendMessage(`🐱😺 هاهو روابط صورك المختصرة:\n\n${formattedLinks}`, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage(`😹 حدث خطأ أثناء محاولة إنشاء الروابط المختصرة!\n${error.message}`, event.threadID, event.messageID);
  }
};
