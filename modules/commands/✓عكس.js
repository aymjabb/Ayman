module.exports.config = {
  name: "عكس",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "61577861540407 • مزخرف بواسطة Sera Chan 🐱",
  description: "لعبة عكس الكلمة مع طابع Sera Chan 🐾",
  usages: ["لعبة"],
  commandCategory: "🎮 العاب 🎮",
  cooldowns: 0
};

// قائمة الأسئلة
const questions = [
  { question: "ما هو عكس النور؟", answer: "الظلام" },
  { question: "ما هو عكس الشقاء؟", answer: "السعادة" },
  { question: "ما هو عكس الفقر؟", answer: "الثروة" },
  { question: "ما هو عكس البرد؟", answer: "الحرارة" },
  { question: "ما هو عكس الجفاف؟", answer: "الرطوبة" },
  { question: "ما هو عكس الصمت؟", answer: "الضوضاء" },
  { question: "ما هو عكس الحياة؟", answer: "الموت" },
  { question: "ما هو عكس البداية؟", answer: "النهاية" },
  { question: "ما هو عكس الأعلى؟", answer: "الأدنى" },
  { question: "ما هو عكس الداخل؟", answer: "الخارج" },
  { question: "ما هو عكس الأمام؟", answer: "الخلف" },
  { question: "ما هو عكس اليمين؟", answer: "اليسار" },
  { question: "ما هو عكس القريب؟", answer: "البعيد" },
  { question: "ما هو عكس السهل؟", answer: "الصعب" },
  { question: "ما هو عكس اللين؟", answer: "القاسي" },
  { question: "ما هو عكس الفرح؟", answer: "الحزن" },
  { question: "ما هو عكس الحب؟", answer: "الكراهية" },
  { question: "ما هو عكس الصبر؟", answer: "العصبية" },
  { question: "ما هو عكس الحلم؟", answer: "الحقيقة" },
  { question: "ما هو عكس الحاضر؟", answer: "الماضي" },
  { question: "ما هو عكس المستقبل؟", answer: "الحاضر" }
];

// زخرفة نصية لطابع Sera Chan
function seraChanVibe() {
  const phrases = [
    "😻 استمع لقوانين بابا وادمنز تبقى! 🐾",
    "✨ واو! أنت شاطر جدًا! 😸",
    "🐱 حاول مرة أخرى وكن أسرع!",
    "😺 سيرا تشان تقول: لا تتأخر بالجواب!"
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// التعامل مع الردود
module.exports.handleReply = async function({ api, event, handleReply, Currencies }) {
  const userAnswer = event.body.trim().toLowerCase();
  const correctAnswer = handleReply.correctAnswer.toLowerCase();
  const userName = global.data.userName.get(event.senderID) || await Users.getNameUser(event.senderID);

  if (userAnswer === correctAnswer) {
      Currencies.increaseMoney(event.senderID, 20);
      api.sendMessage(`✅ تهانينا ${userName}! إجابتك صحيحة، حصلت على 20 دولار 🐱\n${seraChanVibe()}`, event.threadID);
      api.unsendMessage(handleReply.messageID); 
  } else {
      api.sendMessage(`❌ خطأ! حاول مرة أخرى 😺\n${seraChanVibe()}`, event.threadID);
  }
};

// بدء اللعبة
module.exports.run = async function({ api, event, args }) {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const correctAnswer = randomQuestion.answer;
  const question = randomQuestion.question;

  api.sendMessage({ body: `🎮 لعبة عكس الكلمة 🐱\n\n❓ السؤال: ${question}` }, event.threadID, (error, info) => {
      if (!error) {
          global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              correctAnswer: correctAnswer
          });
      }
  });
};
