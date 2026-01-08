const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "المطور",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "عرض معلومات المطور مع ميزة تغيير الصور والـ GIFs تلقائياً ✨",
  commandCategory: "المطور",
  usages: ".المطور",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID } = event;
  const ayID = "61577861540407"; // الآيدي الخاص بك (أيمن)

  // --- قائمة صورك الشخصية (أضف روابط صورك هنا) ---
  const aymanImages = [
    "https://i.imgur.com/k6O6P6X.jpg",
    "https://i.imgur.com/mXWf9Z0.jpg",
    "https://i.imgur.com/vHqQ9Wv.png"
  ];

  // --- قائمة GIFs أنمي أسطورية وهيبة ---
  const animeGifs = [
    "https://i.pinimg.com/originals/f3/78/33/f37833054366657c919793f773347b74.gif",
    "https://i.pinimg.com/originals/11/49/71/114971c22c073f3241b7f03577317737.gif",
    "https://i.pinimg.com/originals/81/29/49/8129497e70390467558f3348123c52e1.gif",
    "https://i.pinimg.com/originals/b5/1d/19/b51d199920b784e1169720743f114681.gif"
  ];

  try {
    // اختيار وسائط عشوائية
    const randomAymanImg = aymanImages[Math.floor(Math.random() * aymanImages.length)];
    const randomAnimeGif = animeGifs[Math.floor(Math.random() * animeGifs.length)];

    const imgPath = path.join(__dirname, "cache", `ayman_${Date.now()}.jpg`);
    const gifPath = path.join(__dirname, "cache", `anime_${Date.now()}.gif`);

    // تحميل الصورة والـ GIF
    const imgRes = await axios.get(randomAymanImg, { responseType: "arraybuffer" });
    const gifRes = await axios.get(randomAnimeGif, { responseType: "arraybuffer" });

    fs.outputFileSync(imgPath, Buffer.from(imgRes.data));
    fs.outputFileSync(gifPath, Buffer.from(gifRes.data));

    // إرسال الصور أولاً (صورتك + GIF الأنمي)
    await api.sendMessage({
      body: senderID == ayID ? "𓂀 سـيـد الـهـيـبـة أيـمـن 𓂀" : "✨ الـمـطـور الأسطـوري أيـمـن الـبـكـري ✨",
      attachment: [fs.createReadStream(imgPath), fs.createReadStream(gifPath)]
    }, threadID, () => {
      // حذف الملفات بعد الإرسال
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
    });

    // إرسال المعلومات النصية (ثانية واحدة تأخير لتظهر بعد الصور)
    setTimeout(() => {
      let infoMsg = `╭───━━━━━───╮\n   𓂀 𝔸𝕐𝕄𝔸ℕ 𝔸𝕃𝔹𝔸𝕂ℝ𝕀 𓂀\n╰───━━━━━───╯\n\n`;
      if (senderID == ayID) {
        infoMsg += `👑 أهلاً بك يا بابا أيمن ✨\n\n🐾 الرتبة: المبرمج الأساسي\n🐾 النظام: SERA V10\n🐾 الحالة: الأقوى 🔥\n\n" العظمة تُصنع ولا تُورث.. "`;
      } else {
        infoMsg += `👤 الاسم: أيمن البكري\n🌍 البلد: العراق 🇮🇶\n🎂 العمر: 18 سنة\n💻 مبرمج بوت سيرا تشان\n\n🐾 سيرا تقول: "هذا هو صانعي المبدع!" 🎀`;
      }
      api.sendMessage(infoMsg, threadID, messageID);
    }, 1000);

  } catch (e) {
    console.error(e);
    return api.sendMessage("🥺 سيرا تعبت وهي تحاول تجيب صور الهيبة.. جرب ثاني!", threadID, messageID);
  }
};
