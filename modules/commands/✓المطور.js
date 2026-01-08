const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// مصفوفة القصائد
const poems = [
  { poet: "المتنبي", lines: ["إِذَا غـــامَرْتَ فِي شَـرَفٍ مَــرُومِ", "فَــلا تَـقْـنَــعْ بِـمَا دُونَ النُّجُــومِ"] },
  { poet: "أحمد شوقي", lines: ["قِـمْ لِلْمُعَلِّمِ وَفِّهِ التَّبْجِيـلَا", "كَـادَ الْـمُعَلِّمُ أَنْ يَـكُونَ رَسُـولَا"] },
  { poet: "نزار قباني", lines: ["هـو الحُـبُ أَنْ تـع-يـشَ مَعَ مَن تُ-حِبُّ", "هـو أَنْ تَمُ-وتَ عَلَى فِكْ-رَةِ الحُ-بِّ"] }
];

module.exports.config = {
  name: "المطور",
  version: "12.0.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "معلومات المطور مع صور شخصية وصور أنمي هيبة متغيرة ✨",
  commandCategory: "المطور",
  usages: ".المطور",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID } = event;
  const ayID = "61577861540407"; // الآيدي الخاص بك

  // --- قائمة صورك الشخصية (تتغير عشوائياً) ---
  const aymanImages = [
    "https://i.ibb.co/Mx3x6c4y/temp-1767664619825.jpg",
    "https://i.imgur.com/k6O6P6X.jpg",
    "https://i.imgur.com/mXWf9Z0.jpg"
  ];

  // --- قائمة صور أنمي هيبة وفخمة (ثابتة وليست GIF) ---
  const animeHighQuality = [
    "https://i.pinimg.com/originals/7e/1a/0b/7e1a0b368739167c71f544f84c98f804.jpg",
    "https://i.pinimg.com/originals/cf/d0/5d/cfd05d70f900e57628859736c96b7978.jpg",
    "https://i.pinimg.com/originals/2d/e3/3e/2de33e72081f9a1f49673836886e37e9.jpg",
    "https://i.pinimg.com/originals/60/9e/f4/609ef478c909e735e02798f98d578b61.jpg",
    "https://i.pinimg.com/originals/94/d9/3c/94d93c1b69d95f462a42080a90586e36.jpg"
  ];

  try {
    const randomImg = aymanImages[Math.floor(Math.random() * aymanImages.length)];
    const randomAnime = animeHighQuality[Math.floor(Math.random() * animeHighQuality.length)];
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];

    const imgPath = path.join(__dirname, "cache", `ayman_${Date.now()}.jpg`);
    const animePath = path.join(__dirname, "cache", `anime_${Date.now()}.jpg`);

    const imgRes = await axios.get(randomImg, { responseType: "arraybuffer" });
    const animeRes = await axios.get(randomAnime, { responseType: "arraybuffer" });

    fs.outputFileSync(imgPath, Buffer.from(imgRes.data));
    fs.outputFileSync(animePath, Buffer.from(animeRes.data));

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

📘┃ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 :
「 https://www.facebook.com/xvk1c 」

${poemText}

🤖┃ 𝗦𝗘𝗥𝗔 𝗖𝗛𝗔𝗡 𝗕𝗢𝗧
⚡┃ 𝗗𝗲𝘃 • 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆 • 𝗚𝗮𝗺𝗲𝘀
🔥┃ 𝗔𝗻𝗶𝗺𝗲 • 𝗛𝗮𝗰𝗸𝗲𝗿 • 𝗩𝗜𝗣

✨ 「 الهيبة تُخلق معك، ولا تُستعار.. بصمة أيمن البكري 」 ✨
`;

    return api.sendMessage({
      body: infoMsg,
      attachment: [fs.createReadStream(imgPath), fs.createReadStream(animePath)]
    }, threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      if (fs.existsSync(animePath)) fs.unlinkSync(animePath);
    }, messageID);

  } catch (e) {
    return api.sendMessage("🥺 سيرا واجهت مشكلة في تحميل الصور.. جرب مرة ثانية!", threadID, messageID);
  }
};
