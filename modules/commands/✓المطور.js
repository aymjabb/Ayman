const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// مصفوفة القصائد
const poems = [
  { poet: "المتنبي", lines: ["إِذَا غـــامَرْتَ فِي شَـرَفٍ مَــرُومِ", "فَــلا تَـقْـنَــعْ بِـمَا دُونَ النُّجُــومِ"] },
  { poet: "أحمد شوقي", lines: ["قِـمْ لِلْمُعَلِّمِ وَفِّهِ التَّبْجِيـلَا", "كَـادَ الْـمُعَلِّمُ أَنْ يَـكُونَ رَسُـولَا"] },
  { poet: "نزار قباني", lines: ["هـو الحُـبُ أَنْ تـعـيـشَ مَعَ مَن تُـحِبُّ", "هـو أَنْ تَمُـوتَ عَلَى فِكْـرَةِ الحُـبِّ"] }
];

module.exports.config = {
  name: "المطور",
  version: "13.0.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "معلومات المطور مع تبديل الصور الجديدة ✨",
  commandCategory: "المطور",
  usages: ".المطور",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID } = event;
  const ayID = "61577861540407"; // الآيدي الخاص بك

  // --- قائمة صورك (الأصلية + الـ 9 الجديدة) ---
  const aymanImages = [
    "https://i.ibb.co/Mx3x6c4y/temp-1767664619825.jpg", // صورتك الأصلية
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
    // اختيار صورة واحدة عشوائية من القائمة الجديدة
    const randomImg = aymanImages[Math.floor(Math.random() * aymanImages.length)];
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];

    const imgPath = path.join(__dirname, "cache", `ayman_dev_${Date.now()}.jpg`);

    const imgRes = await axios.get(randomImg, { responseType: "arraybuffer" });
    fs.outputFileSync(imgPath, Buffer.from(imgRes.data));

    let poemText = `╭─────── ✦🌌✦ ───────╮\n👑 شاعر: ${randomPoem.poet}\n`;
    randomPoem.lines.forEach(line => { poemText += `☁️ ${line}\n`; });
    poemText += `╰─────── ✦🌌✦ ───────╯`;

    const infoMsg = `
╔════════════════════════════════════╗
        👑🔥 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 🔥👑
╚════════════════════════════════════╝

🧑‍💻┃ 𝗡𝗔𝗠𝗘 :
「 ᎯᎽᎷᎯᏁ ᎯᏝᏰᎯᏦᏒᎨ 」

🌍┃ 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 : 「 العراق 🇮🇶 」
🎂┃ 𝗔𝗚𝗘 : 「 18 سنة 」

📸┃ 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 :
「 https://www.instagram.com/x_v_k1?igsh=MWtzdzBpOXp3YWU0 」

📘┃ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢Ｋ :
「 https://www.facebook.com/xvk1c 」

${poemText}

🤖┃ 𝗦𝗘𝗥𝗔 𝗖𝗛𝗔𝗡 𝗕𝗢𝗧
⚡┃ 𝗗𝗲𝘃 • 𝗦𝗲𝗰ｕ𝗿ｉｔｙ • 𝗚𝗮𝗺ｅ𝘀
🔥┃ 𝗔𝗻𝗶𝗺𝗲 • 𝗛𝗮𝗰𝗸𝗲ｒ • 𝗩𝗜𝗣

✨ 「 الهيبة لا تُستعار، بل تُصنع بيد أيمن البكري 」 ✨
`;

    return api.sendMessage({
      body: infoMsg,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, messageID);

  } catch (e) {
    return api.sendMessage("🥺 سيرا واجهت مشكلة في تحميل صورك الجديدة.. جرب مرة ثانية!", threadID, messageID);
  }
};
