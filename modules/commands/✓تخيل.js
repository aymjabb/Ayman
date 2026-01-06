const axios = require('axios');
const fs = require('fs-extra');
const pathModule = require('path');

module.exports.config = {
  name: "تخيل",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "عمر • مطور ومزخرف من قبل سيرا تشان",
  description: "تخيل أي شيء، توليد صورة AI مع زخارف وعفوية ✨😻",
  usePrefix: true,
  commandCategory: "صور",
  usages: ".تخيل [وصف الصورة]",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  let { threadID, messageID } = event;
  let query = args.join(" ");
  if (!query) return api.sendMessage("💫😸 هاي! قل لي وش تتخيل لأرسمه لك…", threadID, messageID);

  // تحديد مسار حفظ الصورة مؤقتاً
  let path = pathModule.join(__dirname, `/cache/sira_image.png`);

  try {
    // ترجمة النص إلى الإنجليزية (لتوافق API توليد الصور)
    const translationResponse = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(query)}`
    );
    const translation = translationResponse.data[0][0][0];

    // طلب الصورة من Pollinations AI
    const imageData = (await axios.get(`https://image.pollinations.ai/prompt/${translation}`, {
      responseType: "arraybuffer",
    })).data;

    // حفظ الصورة مؤقتاً
    fs.writeFileSync(path, Buffer.from(imageData, "utf-8"));

    // رسائل عفوية مزخرفة
    const decorations = ["✨", "🌸", "💖", "🌟", "💫", "😻", "🔥"];
    const randomDecor = () => decorations[Math.floor(Math.random() * decorations.length)];

    const bodyMessage = `
🌟💖 سيرا تشان تقول: 💖🌟
هاه! هذه صورتك، تخيلتها لك 🖼️✨
${randomDecor()} ${query} ${randomDecor()}
💫 خذ الصورة واحتفظ بها لمدة ساعة! 😻
`;

    // إرسال الصورة
    api.sendMessage(
      {
        body: bodyMessage,
        attachment: fs.createReadStream(path)
      },
      threadID,
      () => fs.unlinkSync(path),
      messageID
    );
  } catch (error) {
    console.error(error);
    api.sendMessage("❌ أوه لا! سيرا تشان لم تستطع توليد الصورة 😿 حاول مرة ثانية…", threadID, messageID);
  }
};
