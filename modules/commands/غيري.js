const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ==============================
// Canvas loader ذكي مع fallback
// ==============================
let createCanvas, loadImage;
try {
  const canvas = require("canvas");
  createCanvas = canvas.createCanvas;
  loadImage = canvas.loadImage;
  console.log("✅ استخدام canvas العادي");
} catch (e) {
  const napi = require("@napi-rs/canvas");
  createCanvas = napi.createCanvas;
  loadImage = napi.loadImage;
  console.log("✅ fallback إلى @napi-rs/canvas");
}

// ==============================
// إعدادات الأمر
// ==============================
module.exports.config = {
  name: "غيري",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SOMI",
  description: "تغيير خلفية الصورة ذكي مع fallback",
  commandCategory: "🖼️ صور",
  usages: "خلفية <وصف>",
  cooldowns: 15
};

// ==============================
// تنفيذ الأمر
// ==============================
module.exports.run = async function ({ api, event, args }) {
  try {
    if (!event.messageReply || !event.messageReply.attachments?.[0])
      return api.sendMessage(
        "❌ رد على صورة واكتب:\nخلفية <وصف>",
        event.threadID,
        event.messageID
      );

    const query = args.join(" ");
    if (!query)
      return api.sendMessage("❌ اكتب وصف الخلفية", event.threadID);

    const imgUrl = event.messageReply.attachments[0].url;

    const cacheDir = path.join(__dirname, "/cache");
    fs.ensureDirSync(cacheDir);

    const userImg = path.join(cacheDir, "user.png");
    const outImg = path.join(cacheDir, "out.png");

    // ==============================
    // تحميل صورة المستخدم
    // ==============================
    const img = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(userImg, img.data);

    // ==============================
    // تحميل خلفية من Unsplash
    // ==============================
    const bgUrl = `https://source.unsplash.com/800x800/?${encodeURIComponent(query)}`;
    const bg = await loadImage(bgUrl);
    const person = await loadImage(userImg);

    // ==============================
    // دمج الصورة والخلفية
    // ==============================
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // رسم الخلفية كاملة
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);

    // رسم صورة المستخدم بنسبة محسوبة
    const personWidth = bg.width * 0.5;
    const personHeight = bg.height * 0.7;
    const offsetX = (bg.width - personWidth) / 2;
    const offsetY = (bg.height - personHeight) / 2;

    ctx.drawImage(person, offsetX, offsetY, personWidth, personHeight);

    fs.writeFileSync(outImg, canvas.toBuffer("image/png"));

    // ==============================
    // إرسال النتيجة وحذف الملفات المؤقتة
    // ==============================
    api.sendMessage(
      {
        body: `✨ تم تغيير الخلفية: ${query}`,
        attachment: fs.createReadStream(outImg)
      },
      event.threadID,
      () => {
        fs.unlinkSync(userImg);
        fs.unlinkSync(outImg);
      }
    );

  } catch (err) {
    console.error("❌ خطأ في تغيير الخلفية:", err);
    api.sendMessage(
      "⚠️ فشل تغيير الخلفية. تحقق من الصورة أو المكتبات المثبتة.",
      event.threadID
    );
  }
};
