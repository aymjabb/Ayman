const os = require("os");

module.exports.config = {
  name: "فحص",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "فحص حالة السيرفر وسرعة البوت",
  commandCategory: "نظام",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const timeStart = Date.now();
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  // ASCII الزخرفة
  const line = "════════════════════════════════";
  const title = "🖥️  فـحـص حـالـة الـسـيـرڤـر 🖥️";
  const footer = "🐾 سـيـرا تـشـان تعمل بكامل طاقتها!";

  const msg =
`${line}
${title}
${line}
⏱️  سرعة الاستجابة: ${Date.now() - timeStart} ms
🧠  الذاكرة المستخدمة: ${memoryUsage.toFixed(2)} MB
⌛  مدة التشغيل: ${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية
🌐  النظام: ${os.type()} ${os.platform()} (${os.arch()})
💻  المعالج: ${os.cpus()[0].model}
${line}
${footer}
${line}`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};
