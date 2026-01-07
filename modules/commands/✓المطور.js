const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const SERA = require("../seraCore"); // للوضع NORMAL / DEVIL

// مصفوفة القصائد بدون زخارف
const poems = [
  {
    poet: "المتنبي",
    lines: [
      "إِذَا غـــامَرْتَ فِي شَـرَفٍ مَــرُومِ",
      "فَــلا تَـقْـنَــعْ بِـمَا دُونَ النُّجُــومِ"
    ]
  },
  {
    poet: "أحمد شوقي",
    lines: [
      "قِـمْ لِلْمُعَلِّمِ وَفِّهِ التَّبْجِيـلَا",
      "كَـادَ الْـمُعَلِّمُ أَنْ يَـكُونَ رَسُـولَا"
    ]
  },
  {
    poet: "نزار قباني",
    lines: [
      "هـو الحُـبُ أَنْ تـعـيـشَ مَعَ مَن تُـحِبُّ",
      "هـو أَنْ تَمُـوتَ عَلَى فِكْـرَةِ الحُـبِّ"
    ]
  }
];

module.exports.config = {
  name: "المطور",
  version: "6.4.0",
  hasPermssion: 0,
  credits: "SOMI",
  description: "مطور ديناميكي حسب الوضع NORMAL/DEVIL مع تغيير الشعر تلقائيًا",
  commandCategory: "معلومات",
  usages: ".المطور أو .المطوز",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, body } = event;

  // تحديد الوضع حسب الأمر
  let modeCommand = body.includes(".المطوز") ? "DEVIL" : "NORMAL";

  // التحقق من توافق الأمر مع الوضع الحالي
  if (SERA.MODE === "DEVIL" && modeCommand === "NORMAL") {
    return api.sendMessage("☠️ الوضع DEVIL، استخدم الأمر .المطوز", threadID);
  }
  if (SERA.MODE === "NORMAL" && modeCommand === "DEVIL") {
    return api.sendMessage("⚡ الوضع NORMAL، استخدم الأمر .المطور", threadID);
  }

  const imgPath = path.join(__dirname, "cache", "developer.jpg");
  const imgURL = "https://i.ibb.co/Mx3x6c4y/temp-1767664619825.jpg";

  try {
    // تحميل الصورة
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.ensureDirSync(path.dirname(imgPath));
    fs.writeFileSync(imgPath, Buffer.from(res.data));

    // اختيار قصيدة عشوائية لكل استخدام
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];

    // الشعر بدون زخرفة
    let poemText = `╭─────── 🌌 ───────╮\n`;
    poemText += `👑 شاعر: ${randomPoem.poet}\n`;
    randomPoem.lines.forEach(line => {
      poemText += `☁️ ${line}\n`;
    });
    poemText += `╰─────── 🌌 ───────╯\n`;

    // رسالة كاملة مع الصورة
    const title = SERA.MODE === "DEVIL" ? "☠️ 𝗗𝗘𝗩𝗜𝗟 𝗗𝗘𝗩 ☠️" : "👑 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 👑";
    let fullMsg = `
╔════════════════════════════════════╗
        ${title}
╚════════════════════════════════════╝

🧑‍💻┃ الاسم : أيمن البكري
🌍┃ البلد : العراق 🇮🇶
🎂┃ العمر : 18 سنة
📘┃ مبرمج SERA
${poemText}
`;

    // إرسال الرسالة مع الصورة
    await api.sendMessage(
      { body: fullMsg, attachment: fs.createReadStream(imgPath) },
      threadID
    );

    // رسالة مختصرة بدون صورة
    const shortMsg = `
╔══════════════════════╗
      ${title}
╠══════════════════════╣
🧑‍💻 الاسم : أيمن البكري
🌍 البلد : العراق 🇮🇶
🎂 العمر : 18 سنة
💻 المهنة : مبرمج SERA
╚══════════════════════╝
`;

    await api.sendMessage(shortMsg, threadID);

    // حذف الصورة بعد الإرسال
    fs.unlinkSync(imgPath);

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ | حدث خطأ أثناء تحميل صورة المطور", threadID);
  }
};
