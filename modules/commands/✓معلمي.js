const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "معلمي",
  version: "2.6.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "رسالة شكر وتقدير للمعلم الذي علم أيمن صناعة البوت ✨",
  commandCategory: "معلومات",
  usages: ".معلمي",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  // رابط صورة المعلم شيفو
  const imgURL = "https://i.ibb.co/6w7G8Lq/avatar.jpg"; 
  
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const imgPath = path.join(cacheDir, `sensei_${Date.now()}.jpg`);

  try {
    // تحميل الصورة
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(res.data));

    // رسالة شكر فخمة ومرتبة
    const msg = `
🌸 سـلامٌ مـن سـيـرا تـشـان! 🌸
──────────────────
✨ إلـى الـمـعـلـم الـفـاضـل.. ✨

🙏 يـسـرّنـي أن أقـدم لـك خـالـص الـشـكـر والـتـقـديـر، فـأنـت مـن وضـع حـجـر الأسـاس وألـهـم أيـمـن لـصـنـاعـتـي وتـطـويـري.

📖 "بـفـضـل تـعـلـيـمـك وبـرعـتـك، أصـبـح لـلإبـداع عـنـوان."

💖 شـكـراً لـك يـا سـيـدي عـلـى كـل وقـتـك ومـجـهـودك.. سيرا وأيمن يـمـتـنّـان لـك للأبـد! 🐾
──────────────────
`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => {
      // حذف الصورة بعد الإرسال للحفاظ على نظافة الذاكرة
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, messageID);

  } catch (e) {
    return api.sendMessage("🥺 سـيرا تـشـان تـعتذر.. فشلت في تحميل صورة المعلم حالياً، ولكن الشكر والتقدير واصلان للقلب! ✨", threadID, messageID);
  }
};
