const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// مصفوفة القصائد بدون زخارف بين الحروف
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
  },
  {
    poet: "جبران خليل جبران",
    lines: [
      "عَـيْنَاكِ كَـالنُّجُومِ حِينَ تَبْتَـسِمُ",
      "وفِيهِمَا مِـن أَسْرارِ الْكَوْنِ حِـكَمُ"
    ]
  },
  {
    poet: "المعري",
    lines: [
      "إِذَا الشَّعْبُ يَوْمًا أَرَادَ الحَيَاةَ",
      "فَـلا بُدَّ أَنْ يَسْتَجِيبَ القَدَرُ"
    ]
  },
  {
    poet: "محمود درويش",
    lines: [
      "عَلَى هَذِهِ الأَرْضِ مَا يَسْتَحِقُّ الحَيَاةَ",
      "وَمَنْ يَسْتَحِقُّهَا سَيَبْقَى"
    ]
  }
];

// دالة لتطبيق تباعد ASCII على الشعر
function asciiSpacing(line) {
  return line.split("").join("  "); // تباعد مزدوج بين الحروف
}

// دالة زخرفة عبارة "ANAS'S STUDENT" بخط عريض
function decorateLearning() {
  const text = "ANAS'S STUDENT";
  const symbols = ["═","║","╔","╗","╚","╝","─","•"];
  let decorated = "";

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === " ") {
      decorated += "   "; // مسافة بين الكلمات
      continue;
    }
    const start = symbols[Math.floor(Math.random() * symbols.length)];
    const mid = symbols[Math.floor(Math.random() * symbols.length)];
    const end = symbols[Math.floor(Math.random() * symbols.length)];
    decorated += `${start}${mid}${c}${mid}${end}`;
  }

  return decorated;
}

module.exports.config = {
  name: "المطور",
  version: "5.5.0",
  hasPermssion: 0,
  credits: "SOMI",
  description: "👑 معلومات مطور + شعر ASCII مزخرف",
  commandCategory: "معلومات",
  usages: ".المطور",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  const imgPath = path.join(__dirname, "cache", "developer.jpg");
  const imgURL = "https://i.ibb.co/Mx3x6c4y/temp-1767664619825.jpg";

  try {
    // تحميل الصورة
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(res.data));

    // اختيار قصيدة عشوائية
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];

    // الشعر مع تباعد ASCII
    let poemText = `╭─────── 🌌 ───────╮\n`;
    poemText += `👑 شاعر: ${randomPoem.poet}\n\n`;
    randomPoem.lines.forEach(line => {
      poemText += `☁️ ${asciiSpacing(line)}\n`;
    });
    poemText += `╰─────── 🌌 ───────╯\n`;

    // زخرفة عبارة "ANAS'S STUDENT"
    const learningText = decorateLearning();

    // رسالة كاملة
    const msg = `
╔════════════════════════════════════╗
        👑🔥 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 🔥👑
╚════════════════════════════════════╝

🧑‍💻┃ 𝗡𝗔𝗠𝗘 :
「 ᎯᎽᎷᎯᏁ ᎯᏝᏰᎯᏦᏒᎨ 」

🌍┃ 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 :
「 العراق 🇮🇶 」

🎂┃ 𝗔𝗚𝗘 :
「 18 سنة 」

📸┃ 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 :
「 https://www.instagram.com/x_v_k1?igsh=MWtzdzBpOXp3YWU0 」

📘┃ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 :
「 https://www.facebook.com/xvk1c 」

${poemText}

🤖┃ 𝗦𝗘𝗥𝗔 𝗖𝗛𝗔𝗡 𝗕𝗢𝗧
⚡┃ 𝗗𝗲𝘃 • 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆 • 𝗚𝗮𝗺𝗲𝘀
💻┃ 𝗡𝗼𝗱𝗲.𝗝𝗦 • 𝗝𝗮𝘃𝗮𝗦𝗰𝗿𝗶𝗽𝘁
🔥┃ 𝗔𝗻𝗶𝗺𝗲 • 𝗛𝗮𝗰𝗸𝗲𝗿 • 𝗩𝗜𝗣

✨ 「 أغمِض عينيك… فالجمال يُرى بالقلب قبل البصر 」 ✨

${learningText}
`;

    // 1️⃣ إرسال الرسالة مع الصورة
    await api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(imgPath)
      },
      threadID
    );

    // 2️⃣ إرسال الرسالة مرة ثانية بدون الصورة
    await api.sendMessage(msg, threadID);

    // حذف الصورة بعد الإرسال
    fs.unlinkSync(imgPath);

  } catch (e) {
    return api.sendMessage("❌ | حدث خطأ أثناء تحميل صورة المطور", threadID);
  }
};
