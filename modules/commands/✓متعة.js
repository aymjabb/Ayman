const SERA = {};

SERA.config = {
  name: "نبه",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Ayman",
  description: "🔔 تنبيه لطيف متكرر بواسطة سيرا تشان",
  commandCategory: "أدوات",
  usages: ".سيرا نبه [ID] [عدد] [النص]",
  cooldowns: 10,
};

SERA.run = async function ({ api, event, args }) {

  const DEV_ID = "61577861540407"; // ايديك

  if (event.senderID !== DEV_ID) {
    return api.sendMessage("😼✨ هذا الأمر خاص بسيرا مع بابا أيمن فقط.", event.threadID);
  }

  const uid = args[0];
  const times = parseInt(args[1]);
  const text = args.slice(2).join(" ");

  if (!uid || !times || !text) {
    return api.sendMessage(
      "📌 الاستخدام الصحيح:\n.سيرا نبه [ID] [عدد] [النص]\n\nمثال:\n.سيرا نبه 6157xxxx 3 لا تنسى الصلاة 🤍",
      event.threadID
    );
  }

  if (isNaN(uid) || isNaN(times) || times > 10) {
    return api.sendMessage("⚠️ تأكد من الـ ID والعدد (الحد الأقصى 10 مرات).", event.threadID);
  }

  api.sendMessage("🔔 سيرا تشان بدأت التنبيه بلطف ✨", event.threadID);

  const delay = ms => new Promise(r => setTimeout(r, ms));

  for (let i = 1; i <= times; i++) {
    await api.sendMessage(
      `🌸🔔 تنبيه من سيرا تشان\n\n${text}\n\n✨ (${i}/${times})`,
      uid
    );
    await delay(30000); // 30 ثانية (آمن)
  }

  api.sendMessage("✅ انتهت جميع التنبيهات بنجاح 🌷", event.threadID);
};

module.exports = SERA;
