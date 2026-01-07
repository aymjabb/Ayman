const SERA = require("../seraCore");

module.exports.config = {
  name: "اضف",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "إضافة شخص للمراقبة من السجل",
  commandCategory: "system",
  usages: ".ضيفي رقم",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { senderID, threadID, messageReply } = event;
  if (senderID !== SERA.OWNER)
    return api.sendMessage("⛔ للمالك فقط.", threadID);

  if (!messageReply)
    return api.sendMessage("⚠️ رد على رسالة السجل.", threadID);

  const index = parseInt(args[0]) - 1;
  if (isNaN(index))
    return api.sendMessage("⚠️ اكتب رقم صحيح.", threadID);

  const lines = messageReply.body.split("\n");
  const line = lines[index + 1];
  if (!line) return api.sendMessage("❌ الرقم غير موجود.", threadID);

  const id = line.split(" ").pop();
  SERA.WATCH[id] = true;

  api.sendMessage(
    `👁️ تم إضافة ${id} للمراقبة.`,
    threadID
  );
};
