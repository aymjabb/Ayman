const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

// مفتاح Gemini الخاص بك
const GEMINI_KEY = "AIzaSyALQBlieI5xur3yh0tT69MY36e353tBjuA";

module.exports.config = {
  name: "تعديل",
  version: "2.5.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "تحويل وتحسين الصور (أنمي / كرتون / جودة عالية)",
  commandCategory: "صور",
  usages: "رد على صورة واكتب (أنمي أو كرتون أو تحسين)",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  try {
    // 1. التحقق من وجود صورة
    if (!messageReply || !messageReply.attachments || messageReply.attachments[0].type !== "photo") {
      return api.sendMessage("🌸 يا هلا! رد على صورة أولاً واكتب نوع التعديل (أنمي، كرتون، تحسين).", threadID, messageID);
    }

    const type = args[0];
    const supportedTypes = ["أنمي", "انمي", "كرتون", "تحسين"];
    
    if (!type || !supportedTypes.some(t => type.includes(t))) {
      return api.sendMessage("✨ حدد نوع التعديل يا بطل: (أنمي / كرتون / تحسين)", threadID, messageID);
    }

    const imgUrl = messageReply.attachments[0].url;
    const imgPath = path.join(__dirname, "cache", `${Date.now()}_in.jpg`);
    const outPath = path.join(__dirname, "cache", `${Date.now()}_out.jpg`);

    // إشعار المستخدم بالبدء
    api.sendMessage("⏳ سيرا تشان بدأت العمل على صورتك.. لحظات فقط ✨", threadID, messageID);

    // 2. تحميل الصورة
    const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.outputFileSync(imgPath, Buffer.from(response.data));

    let apiUrl = "";
    
    // 3. تحديد الرابط بناءً على النوع (استخدام سيرفرات معالجة الصور)
    if (type.includes("أنمي") || type.includes("انمي")) {
      apiUrl = `https://api.zahwazein.xyz/photoeditor/anime?apikey=${GEMINI_KEY}`; 
    } else if (type.includes("كرتون")) {
      apiUrl = `https://api.zahwazein.xyz/photoeditor/cartoon?apikey=${GEMINI_KEY}`;
    } else if (type.includes("تحسين")) {
      apiUrl = `https://api.zahwazein.xyz/photoeditor/enhance?apikey=${GEMINI_KEY}`;
    }

    // 4. إرسال الصورة للمعالجة
    const form = new FormData();
    form.append("image", fs.createReadStream(imgPath));

    const res = await axios.post(apiUrl, form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer"
    });

    // 5. حفظ النتيجة وإرسالها
    fs.writeFileSync(outPath, Buffer.from(res.data));

    return api.sendMessage({
      body: `✨ تم التعديل بنجاح! \n🎨 النوع: ${type}\n──────────────────\n🐾 بـقـوة سـيـرا تـشـان`,
      attachment: fs.createReadStream(outPath)
    }, threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    }, messageID);

  } catch (err) {
    console.error(err);
    // إذا فشل الـ API الخارجي، نحاول استخدام Gemini للتحليل النصي كبديل
    return api.sendMessage("⚠️ المعذرة، السيرفر مشغول حالياً أو الصورة غير مدعومة. جرب مرة أخرى لاحقاً 🌸", threadID, messageID);
  }
};
