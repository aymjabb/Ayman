const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// مصفوفة القصائد الفخمة
const poems = [
  { poet: "المتنبي", lines: ["أَنَا الَّذي نَظَرَ الأَعمَى إِلى أَدَبي", "وَأَسمَعَت كَلِماتي مَن بِهِ صَمَمُ"] },
  { poet: "عنترة بن شداد", lines: ["لا تَسقِني ماءَ الحَياةِ بِذِلَّةٍ", "بَل فَاِسقِني بِالعِزِّ كَأسَ الحَنظَلِ"] },
  { poet: "المتنبي", lines: ["الخَيلُ وَاللَيلُ وَالبَيداءُ تَعرِفُني", "وَالسَيفُ وَالرُمحُ وَالقِرطاسُ وَالقَلَمُ"] }
];

module.exports.config = {
  name: "المطور",
  version: "21.2.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "معلومات المطور الملكية مع صورة/GIF جديدة ✨",
  commandCategory: "معلومات",
  usages: ".المطور",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body, type, messageReply } = event;
  if (type === "message_reply" && body === "أيمن عمي") {
    if (messageReply.senderID === api.getCurrentUserID()) {
       return api.sendMessage("👑 أيمن عمي، هداك ألف نقطة! ✨🐾", threadID, messageID);
    }
  }
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  // رابط GIF الجديد من Imgur
  const aymanImage = "https://i.imgur.com/5PcxYsM.gif";

  try {
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];
    const imgPath = path.join(__dirname, "cache", `ayman_new_${Date.now()}.gif`);

    // تحميل الصورة/GIF
    const imgRes = await axios.get(aymanImage, { responseType: "arraybuffer" });
    fs.outputFileSync(imgPath, Buffer.from(imgRes.data));

    // إعداد صندوق القصيدة
    let poemBox = `┏━━━━━━━ 𓂀 ━━━━━━━┓\n  📜 القـول لـلـشـاعـر: ${randomPoem.poet}\n\n`;
    randomPoem.lines.forEach(line => { poemBox += `  » ${line}\n`; });
    poemBox += `┗━━━━━━━ 𓂀 ━━━━━━━┛`;

    // نص معلومات المطور بالخط الجميل (مطابق لرابط Imgur)
    const infoMsg = `
╭━━━━━━━ 𓂀 ━━━━━━━╮
👑 𝗔𝘆𝗺𝗮𝗻 𝗔𝗹𝗯𝗮𝗸𝗿𝗶
──────────────────
♛ صاحب السيادة والتطوير ♛

🆔 الاسم: 「 𝗔𝘆𝗺𝗮𝗻 𝗔𝗹𝗯𝗮𝗸𝗿𝗶 」
🇮🇶 الموطن: 「 العراق 🇮🇶 」
📅 العمر: 「 18 سنة 」
💻 الوظيفة: 「 Full-Stack Defender 」

──────────────────
☕ "بينما يحترق الإنترنت بالدراما، أجلس هنا بهدوء لأطور عالمي الخاص." 🕊️🔥
──────────────────
🌐 التواصل الرسمي:
📸 INSTA: https://www.instagram.com/x_v_k1
📘 FACE: https://www.facebook.com/xvk1c

${poemBox}

🛡️ SERA CHAN SYSTEM VIP
──────────────────
(رد بـ "ايمن عمي" لتحصل على ادمنية 🎁)
╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

    return api.sendMessage({ body: infoMsg, attachment: fs.createReadStream(imgPath) }, threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ حدث خطأ في جلب الصورة/GIF الجديدة!", threadID, messageID);
  }
};
