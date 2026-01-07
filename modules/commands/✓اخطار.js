module.exports.config = {
  name: "اخطار",
  version: "1.1.0",
  hasPermssion: 2, // المطور فقط
  credits: "عمر | Sera Chan",
  description: "ارسال رسالة تحذير لجميع الكروبات التي فيها البوت",
  commandCategory: "المطور",
  usages: "-اخطار <الرسالة>",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const moment = require("moment-timezone");
  const { senderID, threadID, messageID } = event;

  const permission = ["61577861540407"]; // IDs المصرح لهم
  if (!permission.includes(senderID))
    return api.sendMessage("❌ ليس لديك صلاحية استخدام هذا الأمر.", threadID, messageID);

  if (!args.length)
    return api.sendMessage("❌ استخدم: -اخطار <الرسالة>", threadID, messageID);

  const msg = args.join(" ");
  const time = moment.tz("Asia/Baghdad").format("HH:mm:ss D/MM/YYYY");

  const boxMsg = `╭─•⊰ اخطار •⊱•─╮\n${msg}\n╰────────────╯\n⏰ ${time}`;

  try {
    // استدعاء كل الكروبات التي فيها البوت
    const allThreads = await api.getThreadList(100, null, ["inbox"]);
    const groupThreads = allThreads.filter(thread => thread.isGroup);

    for (const thread of groupThreads) {
      await api.sendMessage(boxMsg, thread.threadID);
    }

    return api.sendMessage(`✅ تم إرسال الإخطار لجميع الكروبات (${groupThreads.length})!`, threadID, messageID);

  } catch (e) {
    return api.sendMessage(`❌ حدث خطأ أثناء الإرسال: ${e.message}`, threadID, messageID);
  }
};
