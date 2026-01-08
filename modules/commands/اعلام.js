module.exports.config = {
  name: "اعلام",
  version: "2.6.0",
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
  const { threadID, messageID, senderID } = event;
  
  // قائمة أعلام بروابط ثابتة ومجربة
  const questions = [
    { image: "https://flagcdn.com/w640/sa.png", answer: "السعودية" },
    { image: "https://flagcdn.com/w640/eg.png", answer: "مصر" },
    { image: "https://flagcdn.com/w640/iq.png", answer: "العراق" },
    { image: "https://flagcdn.com/w640/dz.png", answer: "الجزائر" },
    { image: "https://flagcdn.com/w640/ma.png", answer: "المغرب" },
    { image: "https://flagcdn.com/w640/ps.png", answer: "فلسطين" },
    { image: "https://flagcdn.com/w640/sy.png", answer: "سوريا" },
    { image: "https://flagcdn.com/w640/tn.png", answer: "تونس" },
    { image: "https://flagcdn.com/w640/ye.png", answer: "اليمن" },
    { image: "https://flagcdn.com/w640/jo.png", answer: "الأردن" },
    { image: "https://flagcdn.com/w640/lb.png", answer: "لبنان" },
    { image: "https://flagcdn.com/w640/ae.png", answer: "الإمارات" },
    { image: "https://flagcdn.com/w640/kw.png", answer: "الكويت" },
    { image: "https://flagcdn.com/w640/qa.png", answer: "قطر" },
    { image: "https://flagcdn.com/w640/om.png", answer: "عمان" },
    { image: "https://flagcdn.com/w640/ly.png", answer: "ليبيا" },
    { image: "https://flagcdn.com/w640/sd.png", answer: "السودان" },
    { image: "https://flagcdn.com/w640/mr.png", answer: "موريتانيا" },
    { image: "https://flagcdn.com/w640/tr.png", answer: "تركيا" },
    { image: "https://flagcdn.com/w640/jp.png", answer: "اليابان" },
    { image: "https://flagcdn.com/w640/br.png", answer: "البرازيل" },
    { image: "https://flagcdn.com/w640/ru.png", answer: "روسيا" },
    { image: "https://flagcdn.com/w640/fr.png", answer: "فرنسا" },
    { image: "https://flagcdn.com/w640/de.png", answer: "ألمانيا" }
  ];

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const cachePath = __dirname + `/cache/flag_${senderID}.png`;

  try {
    // استخدام Headers لتجنب الحظر عند التحميل
    const response = await axios.get(randomQuestion.image, { 
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    fs.outputFileSync(cachePath, Buffer.from(response.data, 'binary'));

    return api.sendMessage({
      body: "╭──── • ◈ • ────╮\n  اسرع واحد يحزر العلم؟ 🚩\n╰──── • ◈ • ────╯\n\nرد على الصورة بالإجابة الصحيحة يا مبدع/ة! ✨",
      attachment: fs.createReadStream(cachePath)
    }, threadID, (err, info) => {
      if (err) return console.error(err);
      
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        correctAnswer: randomQuestion.answer,
        author: senderID
      });
      
      // حذف الصورة بعد ثانية من الإرسال لضمان وصولها
      setTimeout(() => { if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath); }, 2000);
    }, messageID);

  } catch (e) {
    console.log(e);
    return api.sendMessage("سيرا تعبانة شوي وما قدرت تجيب الصورة.. جرب مرة ثانية الحين! 🥺💔", threadID);
  }
};
