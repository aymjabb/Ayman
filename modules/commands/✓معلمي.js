const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "معلمي",
  version: "2.7.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "رسالة شكر وتقدير لصورة المعلم من فيسبوك مباشرة ✨",
  commandCategory: "معلومات",
  usages: ".معلمي",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  // استخراج الأيدي من رابط الفيسبوك للحصول على الصورة مباشرة
  const teacherUID = "61584059280197";
  const imgURL = `https://graph.facebook.com/${teacherUID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`; 
  
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const imgPath = path.join(cacheDir, `sensei_fb_${Date.now()}.jpg`);

  try {
    // تحميل الصورة الشخصية للمعلم
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(res.data));

    // رسالة الشكر والوفاء
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
      // تنظيف الكاش
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, messageID);

  } catch (e) {
    return api.sendMessage("🥺 سـيرا تـشـان لم تستطع جلب الصورة، لكن مشاعر الشكر من أيمن واصلة بكل تأكيد! ✨", threadID, messageID);
  }
};
