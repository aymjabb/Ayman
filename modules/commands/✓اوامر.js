module.exports.config = {
  name: "اوامر",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "قائمة أوامر البوت مزخرفة بطابع أنمي مع اختيار الفئات بالرد على الرقم",
  commandCategory: "النظام",
  usages: ".اوامر",
  cooldowns: 5
};

// تعريف الفئات والأوامر
const categories = {
  "ترفيه": ["تخييلي", "مغادرةالكل", "سلاحي", "اطرديني", "ترامب", "مستوى", "اكشن", "هدية", "شخصية", "كت",
             "كنية", "لوخيروك", "اقتباسات", "اذكار", "باند", "كهف", "احسب", "adc", "سرقة", "موتي",
             "دراما", "فيس", "جزاء", "رفع", "غموض", "هكر", "اوامر", "تيد", "ترحيب", "مقص", "كابوي"],
  "الذكاء والصور": ["اصفعي", "حضن", "معلمي", "المطور", "مزخرف"],
  "الإدارة والأنظمة": ["ايقاف", "تشغيل", "كنية", "تسونامي", "تقرير"],
  "الألعاب": ["تفكيك", "تجميع", "تحدي", "لعبه_سريعة"],
  "المتفرقات": ["اضحك", "مزاح", "نكت", "معلومات", "نقل"]
};

// دالة زخرفة بسيطة
function decorateTitle(text) {
  const symbols = ["✨", "🌸", "💫", "🌟", "💖"];
  return text.split("").map(c => {
    if (c === " ") return " ";
    return symbols[Math.floor(Math.random()*symbols.length)] + c;
  }).join("");
}

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  let msg = `╭━━━━•╭━━━━•  𝑺𝑬𝑹𝑨 𝑪ℎ𝑨𝑵 •━━━━╮\n`;
  msg += `✨ أهلاً بك في قائمة الفئات ✨\n`;
  msg += `اختر رقم الفئة ليتم عرض أوامرها:\n\n`;

  const keys = Object.keys(categories);
  keys.forEach((cat, i) => {
    msg += `${i + 1} ⟢ فئة ${decorateTitle(cat)}\n`;
  });

  msg += `╰━━━━━━━━━━━━━━━━╯\n`;
  msg += `💻 بواسطة: Sera Chan | 2026`;

  return api.sendMessage(msg, threadID);
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;
  if (!messageReply || !body) return;

  // تحقق أن الرد على رسالة .اوامر
  if (!messageReply.body.includes("أهلاً بك في قائمة الفئات")) return;

  const choice = parseInt(body.trim());
  const keys = Object.keys(categories);
  if (isNaN(choice) || choice < 1 || choice > keys.length) return;

  const categoryName = keys[choice - 1];
  const commandsList = categories[categoryName];

  let msg = `✨ فئة ${categoryName} ✨ (عدد الأوامر: ${commandsList.length})\n\n`;
  msg += commandsList.join(" – ") + "\n\n";
  msg += `0 ⟢ رجوع للقائمة الرئيسية`;

  return api.sendMessage(msg, threadID);
};
