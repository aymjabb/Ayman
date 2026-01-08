module.exports.config = {
  name: "تجميع",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "لعبة تجميع الكلمات - نسخة مرتبة",
  commandCategory: "العاب",
  cooldowns: 0
};

const questions = [
  { question: "ا ل ظ ل ا م", answer: "الظلام" },
  { question: "ا ل س ع ا د ة", answer: "السعادة" },
  { question: "ا ل م و ت", answer: "الموت" },
  { question: "ا ل ي س ا ر", answer: "اليسار" }
];

module.exports.handleReply = async function ({ api, event, handleReply, Users, Currencies }) {
  const { body, senderID, threadID } = event;
  const userAnswer = body.trim().toLowerCase();
  const correctAnswer = handleReply.correctAnswer.toLowerCase();
  const name = await Users.getNameUser(senderID);

  if (Date.now() > handleReply.endTime) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`⏰ انتهى الوقت يا ${name}!`, threadID);
  }

  if (userAnswer === correctAnswer) {
    Currencies.increaseMoney(senderID, 50);
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`✅ أحسنت يا ${name}! تجميعك صحيح.\n💰 الربح: 50 دولار.`, threadID);
  } else {
    return api.sendMessage(`❌ خطأ يا ${name}، حاول مجدداً!`, threadID);
  }
};

module.exports.run = async function ({ api, event }) {
  const item = questions[Math.floor(Math.random() * questions.length)];
  const msg = `🎮 لـعـبـة الـتـجـمـيـع\n──────────────────\nجمع الكلمة التالية: ✨ [ ${item.question} ]\n──────────────────\n⏱️ الوقت: 15 ثانية فقط!`;
  
  return api.sendMessage(msg, event.threadID, (err, info) => {
    global.client.handleReply.push({
      step: 1,
      name: this.config.name,
      messageID: info.messageID,
      correctAnswer: item.answer,
      endTime: Date.now() + 15000
    });
  });
};
