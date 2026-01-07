const SERA = require("../seraCore");

module.exports.config = {
  name: "راقب_زمن",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "مراقبة شخص لمدة محددة",
  commandCategory: "system",
  usages: ".راقب_زمن @شخص 60",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { senderID, threadID, mentions } = event;
  if (senderID !== SERA.OWNER)
    return api.sendMessage("⛔ للمالك فقط.", threadID);

  const id = Object.keys(mentions)[0];
  const minutes = parseInt(args[1]);

  if (!id || isNaN(minutes))
    return api.sendMessage(
      "⚠️ الصيغة: .راقب_زمن @شخص 60",
      threadID
    );

  SERA.WATCH[id] = true;

  setTimeout(() => {
    delete SERA.WATCH[id];
    delete SERA.STRIKES[id];
  }, minutes * 60 * 1000);

  api.sendMessage(
    `⏳ تمت مراقبة الشخص لمدة ${minutes} دقيقة.`,
    threadID
  );
};
