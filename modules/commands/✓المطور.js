const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// مصفوفة القصائد
const poems = [
  { poet: "المتنبي", lines: ["أَنَا الَّذي نَظَرَ الأَعمَى إِلى أَدَبي", "وَأَسمَعَت كَلِماتي مَن بِهِ صَمَمُ"] },
  { poet: "عنترة بن شداد", lines: ["لا تَسقِني ماءَ الحَياةِ بِذِلَّةٍ", "بَل فَاِسقِني بِالعِزِّ كَأسَ الحَنظَلِ"] },
  { poet: "المتنبي", lines: ["الخَيلُ وَاللَيلُ وَالبَيداءُ تَعرِفُني", "وَالسَيفُ وَالرُمحُ وَالقِرطاسُ وَالقَلَمُ"] },
  { poet: "عمرو بن كلثوم", lines: ["إِذا بَلَغَ الفِطامَ لَنا صَبِيٌّ", "تَخِرُّ لَهُ الجَبابِرُ ساجِدينا"] }
];

module.exports.config = {
  name: "المطور",
  version: "19.0.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "معلومات المطور الملكية مع نظام رد النقاط بالعربي ✨",
  commandCategory: "المطور",
  usages: ".المطور",
  cooldowns: 5
};

// --- نظام الرد التلقائي على "أيمن عمي" ---
module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body, type, messageReply } = event;
  if (type === "message_reply" && body && body === "أيمن عمي") {
    if (messageReply.senderID === api.getCurrentUserID()) {
       return api.sendMessage("👑 أيمن عمك هداك ألف نقطة! ✨🐾", threadID, messageID);
    }
  }
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  const aymanImages = [
    "https://i.ibb.co/TBG49mD7/temp-1767907624235.jpg",
    "https://i.ibb.co/snyCVJc/temp-1767907662462.jpg",
    "https://i.ibb.co/Q3fGr403/temp-1767907681100.jpg",
    "https://i.ibb.co/vx06HXZJ/temp-1767907698120.jpg",
    "https://i.ibb.co/Q3rn3Fd0/temp-1767907725039.jpg",
    "https://i.ibb.co/whfb1v1L/temp-1767907729123.jpg",
    "https://i.ibb.co/r2868txC/temp-1767907735004.jpg",
    "https://i.ibb.co/qYLFDFjY/temp-1767907744764.jpg",
    "https://i.ibb.co/KzFzxwCX/temp-1767907791544.jpg"
  ];

  try {
    const randomImg = aymanImages[Math.floor(Math.random() * aymanImages.length)];
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];
    const imgPath = path.join(__dirname, "cache", `ayman_royal_${Date.now()}.jpg`);

    const imgRes = await axios.get(randomImg, { responseType: "arraybuffer" });
    fs.outputFileSync(imgPath, Buffer.from(imgRes.data));

    let poemBox = `┏━━━━━━━ 𓂀 ━━━━━━━┓\n`;
    poemBox += `  📜 الـقـول لـلـشـاعـر: ${randomPoem.poet}\n\n`;
    randomPoem.lines.forEach(line => { poemBox += `  » ${line}\n`; });
    poemBox += `┗━━━━━━━ 𓂀 ━━━━━━━┛`;

    const infoMsg = `
   𓂀 𝔸𝕐𝕄𝔸ℕ 𝔸𝕃𝔹𝔸𝕂ℝ𝕀 𓂀
   ──────────────────
  ♛ صـاحـب الـسـيـادة والـتـطـويـر ♛

  🆔 الإسم: 「 ᎯᎽᎷᎯᏁ ᎯᏝᏰᎯᏦᏒᎨ 」
  🇮🇶 الموطن: 「 بـلاد الرافـدين 」
  📅 العمر: 「 𝟙𝟠 𝕐𝕖𝕒𝕣𝕤 𝕆𝕝𝕕 」
  💻 الوظيفة: 「 𝔽𝕦𝕝𝕝-𝕊𝕥𝕒𝕔𝕜 𝔻𝕖𝕗𝕖𝕟𝕕𝕖𝕣 」

  🌐 الـتـواصـل الـرسـمـي:
  ──────────────────
  📸 INSTA: https://www.instagram.com/x_v_k1
  📘 FACE: https://www.facebook.com/xvk1c

  ${poemBox}

  🛡️ 𝗦𝗘𝗥𝗔 𝗖𝗛𝗔𝗡 𝗦𝗬𝗦𝗧𝗘𝗠 𝗩𝗜𝗣
  ⚡ 𝗖𝗵𝗶𝗲𝗳 𝗘𝗻𝗴𝗶𝗻𝗲𝗲𝗿 • 𝗦𝘆𝘀𝘁𝗲𝗺 𝗔𝗿𝗰𝗵𝗶𝘁𝗲𝗰𝘁

  " الـهـيـبـة لا تـُكـتـسـب، الـهـيـبـة تـُخـلـق مـعـنـا "
   ──────────────────
       💎 𝗞𝗜𝗡𝗚 𝗢𝗙 𝗖𝗢𝗗𝗘 💎

  (رد عـلـى الـرسـالـة بـ "أيمن عمي" لـكـسـب 1000 نـقـطـة)
`;

  return api.sendMessage({
      body: infoMsg,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, messageID);

  } catch (e) {
    return api.sendMessage("❌ حدث خطأ في جلب البيانات.. حاول مجدداً!", threadID, messageID);
  }
};
