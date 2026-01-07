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

// تعريف الفئات والأوامر
const categories = {
  "ترفيه": ["تخييلي","مغادرةالكل","سلاحي","اطرديني","ترامب","مستوى","اكشن","هدية","شخصية","كت","كنية","لوخيروك","اقتباسات","اذكار","باند","كهف","احسب","adc","سرقة","موتي","دراما","فيس","جزاء","رفع","غموض","هكر","اوامر","تيد","ترحيب","مقص","كابوي"],
  "الذكاء والصور": ["اصفعي","حضن","معلمي","المطور","مزخرف"],
  "الإدارة والأنظمة": ["ايقاف","تشغيل","كنية","تسونامي","تقرير"],
  "الألعاب": ["تفكيك","تجميع","تحدي","لعبه_سريعة"],
  "المتفرقات": ["اضحك","مزاح","نكت","معلومات","نقل"]
};

// دالة لصنع صندوق مزخرف حول النص
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

  msg += `╰━━━━━━━━━━━━━━━━╯\n`;
  msg += `💻 بواسطة: Sera Chan | 2026`;

  return api.sendMessage(msg, threadID);
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, body, messageID, messageReply, senderID } = event;
  if (!body) return;

  // أوامر المطوّر
  if (senderID === OWNER_ID) {
    if (body === ".اون") {
      SMART.toggleSystem(true);
      return api.sendMessage("✅ تم تشغيل النظام الذكي", threadID);
    }
    if (body === ".اوف") {
      SMART.toggleSystem(false);
      return api.sendMessage("⛔ تم إيقاف النظام الذكي", threadID);
    }

    if (body.startsWith("-زيادة ")) {
      const parts = body.split(" ");
      if (parts.length === 3) {
        const userID = parts[1].replace("@","");
        const amount = parseInt(parts[2]);
        const users = require("../sera/users.json");
        if (!users[userID]) return api.sendMessage("❌ هذا العضو غير موجود", threadID);
        users[userID].money = (users[userID].money || 0) + amount;
        require("fs-extra").writeJsonSync("./sera/users.json", users, { spaces: 2 });
        return api.sendMessage(`💰 تم إضافة ${amount} عملات لـ ${userID}`, threadID);
      }
    }
  }

  // التحقق من تفعيل النظام
  if (!SMART.isEnabled()) return;

  // التفاعل الذكي
  const name = event.senderName || "User";
  SMART.initUser(senderID, name);
  SMART.logInteraction(senderID, body);

  const users = require("../sera/users.json");
  const user = users[senderID];
  const q = SMART.getSmartQuestion(user);

  if (q && !body.startsWith(".") && !body.startsWith("-")) {
    return api.sendMessage(q, threadID);
  }

  if (q) SMART.applyAnswer(senderID, body);

  // التفاعل مع الرد على .اوامر
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
