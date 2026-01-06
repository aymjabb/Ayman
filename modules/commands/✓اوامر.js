module.exports.config = {
  name: "اوامر",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "انس • مزخرف بواسطة Sera Chan",
  description: "قائمة أوامر البوت مرتبة حسب الفئة مع تفعيل الأوامر بالرد على الرقم",
  commandCategory: "النظام",
  usages: ".اوامر",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 10 // 10 ثوانٍ
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "┌─ Command: %1 ─┐\nDescription: %2\nUsage: %3\nCategory: %4\nCooldown: %5 sec\nPermission: %6\nCredits: %7\n└─────────────────┘",
    "user": "User",
    "adminGroup": "Group Admin",
    "adminBot": "Bot Admin"
  }
};

module.exports.handleEvent = async function({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body, messageReply } = event;
  if (!body) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];

  // ترتيب الأوامر حسب الفئة
  const categories = {};
  for (let [name, cmd] of commands) {
    if (!categories[cmd.config.commandCategory]) categories[cmd.config.commandCategory] = [];
    categories[cmd.config.commandCategory].push(cmd);
  }

  // إذا رد المستخدم على رسالة الأوامر
  if (messageReply && messageReply.body && messageReply.body.includes("قائمة أوامر البوت")) {
    const categoryName = body.trim().toLowerCase();
    if (!categories[categoryName]) return; // الفئة غير موجودة

    let msg = `== أوامر فئة: ${categoryName.toUpperCase()} ==\n`;
    categories[categoryName].sort((a, b) => a.config.name.localeCompare(b.config.name)).forEach((cmd, index) => {
      msg += `${index + 1}. ${cmd.config.name} - ${cmd.config.description}\n`;
    });

    // إرسال رسالة قائمة الأوامر
    const info = await api.sendMessage(msg, threadID);

    // حذف الرسالة بعد 10 ثواني
    if (autoUnsend) {
      setTimeout(() => api.unsendMessage(info.messageID).catch(() => {}), delayUnsend * 1000);
    }

    return;
  }

  // إذا رد المستخدم على رقم أمر لتفعيله
  if (messageReply && messageReply.body && messageReply.body.startsWith("== أوامر فئة:")) {
    const lines = messageReply.body.split("\n").slice(1); // تجاهل العنوان
    const num = parseInt(body.trim());
    if (isNaN(num) || num < 1 || num > lines.length) return;

    const line = lines[num - 1];
    const cmdName = line.split(" - ")[0].trim();
    const command = commands.get(cmdName.toLowerCase());
    if (!command) return;

    // تشغيل الأمر
    if (command.run) {
      command.run({ api, event, args: [], getText });
    }
    return;
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];

  let msg = "╔════════════════════════╗\n";
  msg += "║  قائمة أوامر البوت  ║\n";
  msg += "╠════════════════════════╣\n\n";
  msg += "اكتب اسم الفئة بالرد على هذه الرسالة لعرض أوامرها.\n\n";

  // عرض الفئات
  const categories = {};
  for (let [name, cmd] of global.client.commands) {
    if (!categories[cmd.config.commandCategory]) categories[cmd.config.commandCategory] = [];
    categories[cmd.config.commandCategory].push(cmd);
  }

  Object.keys(categories).sort().forEach((cat, i) => {
    msg += ` ${i + 1}. ${cat}\n`;
  });

  msg += "\n╚════════════════════════╝";

  const info = await api.sendMessage(msg, threadID, messageID);

  // حذف بعد 10 ثوانٍ
  if (autoUnsend) {
    setTimeout(() => api.unsendMessage(info.messageID).catch(() => {}), delayUnsend * 1000);
  }
};
