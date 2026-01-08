module.exports.config = {
  name: "اعلام",
  version: "2.5.0",
  hasPermssion: 0,
  credits: "عمر & سيرا تشان",
  description: "لعبة احزر العلم مع سيرا اللطيفة ✨",
  usages: ["اعلام"],
  commandCategory: "العاب سيرا",
  cooldowns: 5
};

const fs = require('fs-extra');
const axios = require('axios');

module.exports.handleReply = async function ({ api, event, handleReply, Currencies }) {
  const userAnswer = event.body.trim();
  const correctAnswer = handleReply.correctAnswer;
  
  if (userAnswer === correctAnswer) {
      await Currencies.increaseMoney(event.senderID, 150); 
      return api.sendMessage(`✨ كفوووو يـا بطل/ة! ✨\n\nإجابتك صحيحة مية بالمية: 【 ${correctAnswer} 】 ✅\nهدية سيرا لك: 💰 150 دولار تم إضافتها لمحفظتك! 🥳`, event.threadID, () => {
          api.unsendMessage(handleReply.messageID);
      }, event.messageID);
  } else {
      return api.sendMessage(`اوووه.. للأسف إجابة غلط 🥺💔\nركز منيح وحاول مرة ثانية يا شاطر/ة! ✨`, event.threadID, event.messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  const questions = [
    { image: "https://i.imgur.com/vHqQ9Wv.png", answer: "السعودية" },
    { image: "https://i.imgur.com/k9vE8p0.png", answer: "مصر" },
    { image: "https://i.imgur.com/6XN5lOa.png", answer: "العراق" },
    { image: "https://i.imgur.com/r6O5Msh.png", answer: "الجزائر" },
    { image: "https://i.imgur.com/3N4oU9F.png", answer: "المغرب" },
    { image: "https://i.imgur.com/8N4N3u8.png", answer: "فلسطين" },
    { image: "https://i.imgur.com/wVf590z.png", answer: "سوريا" },
    { image: "https://i.imgur.com/XU7qE80.png", answer: "تونس" },
    { image: "https://i.imgur.com/Dba8SLo.png", answer: "اليمن" },
    { image: "https://i.imgur.com/jV7vE5z.png", answer: "الأردن" },
    { image: "https://i.imgur.com/9O3X8uC.png", answer: "لبنان" },
    { image: "https://i.imgur.com/pYxH9pY.png", answer: "الإمارات" },
    { image: "https://i.imgur.com/4zYfF0S.png", answer: "الكويت" },
    { image: "https://i.imgur.com/vL7X6M0.png", answer: "قطر" },
    { image: "https://i.imgur.com/mUvN9O8.png", answer: "عمان" },
    { image: "https://i.imgur.com/L7X6M0p.png", answer: "ليبيا" },
    { image: "https://i.imgur.com/R3zY8nC.png", answer: "السودان" },
    { image: "https://i.imgur.com/2X8pYnC.png", answer: "موريتانيا" },
    { image: "https://i.imgur.com/vH9Pz8L.png", answer: "تركيا" },
    { image: "https://i.imgur.com/pYvM8nC.png", answer: "اليابان" },
    { image: "https://i.imgur.com/9O3mPzL.png", answer: "البرازيل" },
    { image: "https://i.imgur.com/mU8P0zK.png", answer: "روسيا" },
    { image: "https://i.imgur.com/6XzY7pL.png", answer: "فرنسا" },
    { image: "https://i.imgur.com/8VvD3pM.png", answer: "ألمانيا" }
  ];

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const cachePath = __dirname + `/cache/flag_${event.senderID}.jpg`;

  try {
    const response = await axios.get(randomQuestion.image, { responseType: 'arraybuffer' });
    fs.outputFileSync(cachePath, Buffer.from(response.data, 'binary'));

    return api.sendMessage({
      body: "╭──── • ◈ • ────╮\n  اسرع واحد يحزر العلم؟ 🚩\n╰──── • ◈ • ────╯\n\nرد على الصورة بالإجابة الصحيحة يا مبدع/ة! ✨",
      attachment: fs.createReadStream(cachePath)
    }, event.threadID, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        correctAnswer: randomQuestion.answer,
        author: event.senderID
      });
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, event.messageID);
  } catch (e) {
    return api.sendMessage("سيرا تعبانة شوي وما قدرت تجيب الصورة.. حاول مرة ثانية 🥺💔", event.threadID);
  }
};
