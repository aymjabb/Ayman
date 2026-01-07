module.exports.config = {
  name: "mainCommands",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "قائمة أوامر البوت وطريقة التفاعل",
  commandCategory: "النظام",
  usages: ".اوامر",
  cooldowns: 5
};

const SMART = require("../sera/smartSystem");
const OWNER_ID = "61577861540407";

const categories = {
  "ترفيه": ["تخييلي","مغادرةالكل","سلاحي","اطرديني","ترامب","مستوى","اكشن","هدية","شخصية","كت","كنية","لوخيروك","اقتباسات","اذكار","باند","كهف","احسب","adc","سرقة","موتي","دراما","فيس","جزاء","رفع","غموض","هكر","اوامر","تيد","ترحيب","مقص","كابوي"],
  "الذكاء والصور": ["اصفعي","حضن","معلمي","المطور","مزخرف"],
  "الإدارة والأنظمة": ["ايقاف","تشغيل","كنية","تسونامي","تقرير"],
  "الألعاب": ["تفكيك","تجميع","تحدي","لعبه_سريعة"],
  "المتفرقات": ["اضحك","مزاح","نكت","معلومات","نقل"]
};

function boxTitle(text) {
  const line = "━".repeat(text.length + 4);
  return `┏${line}┓\n┃  ${text}  ┃\n┗${line}┛`;
}

module.exports.run = async function({ api, event }) {
  const { threadID } = event;
  let msg = `╭━━━━•╭━━━━•  𝑺𝑬𝑹𝑨 𝑪ℎ𝑨𝑵 •━━━━╮\n`;
  msg += `✨ أهلاً بك في قائمة الفئات ✨\n`;
  msg += `اختر رقم الفئة ليتم عرض أوامرها:\n\n`;

  const keys = Object.keys(categories);
  keys.forEach((cat, i) => {
    msg += `${i + 1} ⟢ ${boxTitle(cat)}\n`;
  });

  msg += `╰━━━━━━━━━━━━━━━━╯\n💻 بواسطة: Sera Chan | 2026`;
  return api.sendMessage(msg, threadID);
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, body, messageReply, senderID } = event;
  if (!body) return;

  if (!SMART.isEnabled()) return;

  SMART.initUser(senderID, event.senderName || "User");
  SMART.logInteraction(senderID, body);

  if (messageReply && messageReply.body.includes("أهلاً بك في قائمة الفئات")) {
    const choice = parseInt(body.trim());
    const keys = Object.keys(categories);
    if (!isNaN(choice) && choice >= 1 && choice <= keys.length) {
      const categoryName = keys[choice - 1];
      const commandsList = categories[categoryName];
      let msg = `✨ فئة ${categoryName} ✨ (عدد الأوامر: ${commandsList.length})\n\n`;
      msg += commandsList.join(" – ") + "\n\n";
      msg += `0 ⟢ رجوع للقائمة الرئيسية`;
      return api.sendMessage(msg, threadID);
    }
  }
};
