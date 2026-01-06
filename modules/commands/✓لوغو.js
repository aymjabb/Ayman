const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "logo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "عمر",
  description: "إنشاء شعارات مزخرفة بالنصوص",
  commandCategory: "خدمات",
  usages: "logo [نوع] [النص]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const text = args.slice(1).join(" ");
  const type = args[0]?.toLowerCase();

  if (!type || !text) 
    return api.sendMessage("❌ استخدم: logo [نوع] [النص]\nمثال: logo fire مرحبا", threadID, messageID);

  const pathImg = __dirname + "/cache/logo.png"; // مسار الصورة المؤقت
  let apiUrl, message;

  switch(type) {
    case "skeleton":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/skeleton?text=${encodeURIComponent(text)}`;
      message = "[𝑺𝑲𝑬𝑳𝑬𝑻𝑶𝑵] Logo created";
      break;
    case "sketch":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/sketch?text=${encodeURIComponent(text)}`;
      message = "[𝑺𝑲𝑬𝑻𝑪𝑯] Logo created";
      break;
    case "stone":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/stone?text=${encodeURIComponent(text)}`;
      message = "[𝑺𝑻𝑶𝑵𝑬] Logo created";
      break;
    case "fire":
      apiUrl = `https://chards-bot-api.richardretadao1.repl.co/api/photooxy/flaming?text=${encodeURIComponent(text)}`;
      message = "[𝑭𝑰𝑹𝑬] Logo created";
      break;
    case "love":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/lovetext?text=${encodeURIComponent(text)}`;
      message = "[LOVETEXT] Logo created";
      break;
    case "naruto":
      apiUrl = `https://rest-api-2.faheem007.repl.co/api/photooxy/naruto?text=${encodeURIComponent(text)}`;
      message = "[𝑵𝑨𝑹𝑼𝑻𝑶] Logo created";
      break;
    default:
      return api.sendMessage("❌ النوع غير موجود، جرب: fire, love, naruto, stone, skeleton, sketch", threadID, messageID);
  }

  // رسالة مؤقتة للانتظار
  api.sendMessage("⏳ جاري إنشاء الشعار...", threadID, messageID);

  try {
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(pathImg, Buffer.from(response.data, "utf-8"));

    // إرسال الصورة مع الكريدت
    await api.sendMessage({
      body: `تم إنشاء شعارك بواسطة عمر 💠\n${message}`,
      attachment: fs.createReadStream(pathImg)
    }, threadID, () => fs.unlinkSync(pathImg));

  } catch (error) {
    return api.sendMessage("❌ حدث خطأ أثناء إنشاء الشعار. جرب مرة أخرى.", threadID, messageID);
  }
};
