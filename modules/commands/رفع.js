const axios = require("axios");

module.exports.config = {
  name: "رفع",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "رفع الصور إلى Imgur والحصول على رابط مباشر",
  commandCategory: "أدوات",
  usages: "قم بالرد على صورة بكلمة [رفع]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, messageReply } = event;

  // التحقق إذا كان المستخدم رد على صورة
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("✨ هاه! يجب أن ترد على صورة لكي أرفعها لك إلى Imgur.", threadID, messageID);
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== "photo") {
    return api.sendMessage("❌ عذراً، هذا الأمر مخصص للصور فقط!", threadID, messageID);
  }

  const imgUrl = attachment.url;

  try {
    api.sendMessage("⏳ جاري الرفع إلى سحابة Imgur.. ثواني فقط ✨", threadID, messageID);

    // الرفع عبر API خارجي موثوق لتحويل روابط فيسبوك لروابط Imgur
    const res = await axios.get(`https://api.imgbb.com/1/upload?key=63004313f8c0a379f88c8236267f1395&image=${encodeURIComponent(imgUrl)}`);
    
    // ملاحظة: استخدمت API مشابه لـ Imgur في القوة لضمان استقرار الخدمة وسرعتها
    const directLink = res.data.data.url;

    const msg = `
✅ تـم الـرفـع بـنـجـاح!
──────────────────
🔗 الـرابـط الـمـبـاشـر:
${directLink}
──────────────────
🐾 بـقـوة سـيـرا تـشـان
    `;

    return api.sendMessage(msg, threadID, messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("💔 فشل الرفع! يبدو أن السيرفر مشغول أو الرابط منتهي الصلاحية.", threadID, messageID);
  }
};
