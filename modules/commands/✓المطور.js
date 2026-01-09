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
  version: "21.0.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "معلومات المطور الملكية مع الصورة الجديدة ✨",
  commandCategory: "معلومات",
  usages: ".المطور",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body, type, messageReply } = event;
  if (type === "message_reply" && body === "أيمن عمي") {
    if (messageReply.senderID === api.getCurrentUserID()) {
       return api.sendMessage("👑 أيمن عمك هداك ألف نقطة! ✨🐾\nبمناسبة يوم سعيد آخر على الإنترنت ☕", threadID, messageID);
    }
  }
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  // الصورة الوحيدة المطلوبة الآن
  const aymanImage = "https://i.imgur.com/8YvU6tS.jpg"; 

  try {
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];
    const imgPath = path.join(__dirname, "cache", `ayman_new_${Date.now()}.jpg`);

    const imgRes = await axios.get(aymanImage, { responseType: "arraybuffer" });
    fs.outputFileSync(imgPath, Buffer.from(imgRes.data));

    let poemBox = `┏━━━━━━━ 𓂀 ━━━━━━━┓\n  📜 الـقـول لـلـشـاعـر: ${randomPoem.poet}\n\n`;
    randomPoem.lines.forEach(line => { poemBox += `  » ${line}\n`; });
    poemBox += `┗━━━━━━━ 𓂀 ━━━━━━━┛`;

    const infoMsg = `
   𓂀 𝔸𝕐𝕄𝔸ℕ 𝔸𝕃𝔹𝔸𝕂ℝ𝕀 𓂀
   ──────────────────
  ♛ صـاحـب الـسـيـادة والـتـطـويـر ♛

  🆔 الإسم: 「 ᎯᎽᎷᎯᏁ ᎯᏝᏰᎯᏦᎨ 」
  🇮🇶 الموطن: 「 العراق 🇮🇶 」
  📅 العمر: 「 𝟙𝟠 𝕐𝕖𝕒𝕣𝕤 𝕆𝕝𝕕 」
  💻 الوظيفة: 「 𝔽𝕦𝕝𝕝-𝕊𝕥𝕒𝕔𝕜 𝔻𝕖𝕗𝕖𝕟𝕕𝕖𝕣 」

  ──────────────────
  ☕ 𝗝𝘂𝘀𝘁 𝗮𝗻𝗼𝘁𝗵𝗲𝗿 𝗵𝗮𝗽𝗽𝘆 𝗱𝗮𝘆...
  "بينما يحترق الإنترنت بالدراما، أجلس هنا بهدوء لأطور عالمي الخاص." 🕊️🔥
  ──────────────────

  🌐 الـتـواصـل الـرسـمـي:
  📸 INSTA: https://www.instagram.com/x_v_k1
  📘 FACE: https://www.facebook.com/xvk1c

  ${poemBox}

  🛡️ 𝗦𝗘𝗥𝗔 𝗖𝗛𝗔𝗡 𝗦𝗬𝗦𝗧𝗘𝗠 𝗩𝗜𝗣
  " الـهـيـبـة لا تـُكـتـسـب، الـهـيـبـة تـُخـلـق مـعـنـا "
   ──────────────────
  (رد بـ "أيمن عمي" ليوم سعيد آخر 🎁)
`;

    return api.sendMessage({ body: infoMsg, attachment: fs.createReadStream(imgPath) }, threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, messageID);

  } catch (e) {
    return api.sendMessage("❌ حدث خطأ في جلب الصورة الجديدة!", threadID, messageID);
  }
};
