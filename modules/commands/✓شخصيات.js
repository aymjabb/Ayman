const fs = require("fs");
const axios = require("axios");
const tempImageFilePath = __dirname + "/cache/tempImage12.jpg";

module.exports.config = {
  name: "شخصيات",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "أيمن", // تم تغيير اسم المطور لاسمك
  description: "احزر اسم الشخصيه من الصوره 🎭😏",
  usages: ["لعبة"],
  commandCategory: "العاب",
  cooldowns: 0
};

module.exports.handleReply = async function ({ api, event, handleReply, Currencies, Users }) {
  const userAnswer = event.body.trim().toLowerCase();
  const correctAnswer = handleReply.correctAnswer.toLowerCase();
  const userName = global.data.userName.get(event.senderID) || await Users.getNameUser(event.senderID);

  if (userAnswer === correctAnswer) {
      await Currencies.increaseMoney(event.senderID, 50);
      api.sendMessage(`🎉 تهانينا يا ${userName}! لقد عرفت الشخصية الصحيحة 😎💖\n💰 حصلت على 50 دولار! ما شاء الله عليك 😏`, event.threadID);
      api.unsendMessage(handleReply.messageID);
  } else {
      api.sendMessage(`😅 هههه لا، هذا مو صحيح يا ${userName}… حاول مرة ثانية! 🔄💫`, event.threadID);
  }

  fs.unlinkSync(tempImageFilePath);
};

module.exports.run = async function ({ api, event, args, Users, Currencies }) {
  const questions = [
    { image: "https://i.imgur.com/yrEx6fs.jpg", answer: "كورومي" },
    { image: "https://i.imgur.com/cAFukZB.jpg", answer: "الينا" },
    { image: "https://i.pinimg.com/236x/63/c7/47/63c7474adaab4e36525611da528a20bd.jpg", answer: "فوليت" },
    { image: "https://i.pinimg.com/236x/b3/cd/6a/b3cd6a25d9e3451d68628b75da6b2d9e.jpg", answer: "ليفاي" },
    { image: "https://i.pinimg.com/236x/eb/a1/c6/eba1c6ed1611c3332655649ef405490a.jpg", answer: "مايكي" },
    { image: "https://i.pinimg.com/236x/34/81/ba/3481ba915d12d27c1b2a094cb3369b4c.jpg", answer: "كاكاشي" },
    { image: "https://i.pinimg.com/236x/3a/df/87/3adf878c1b6ef2a90ed32abf674b780c.jpg", answer: "ميدوريا" },
    { image: "https://i.pinimg.com/564x/d2/c0/42/d2c042eeb8a92713b3f6e0a6dba2c353.jpg", answer: "وين" },
    { image: "https://i.pinimg.com/236x/f6/85/2b/f6852bfa6a09474771a17aca9018852e.jpg", answer: "نينم" },
    { image: "https://i.pinimg.com/236x/b6/0e/36/b60e36d13d8c11731c85b73e89f63189.jpg", answer: "هانكو" }
    // ممكن تضيف باقي الشخصيات هنا بنفس الشكل
  ];

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const correctAnswer = randomQuestion.answer;

  const imageResponse = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
  fs.writeFileSync(tempImageFilePath, Buffer.from(imageResponse.data, "binary"));

  const attachment = [fs.createReadStream(tempImageFilePath)];
  const message = `🎭 احزر اسم هذه الشخصية الأنمي 😏✨\nها، هل تعرف من هي؟ 🍀🌸`;

  api.sendMessage({ body: message, attachment }, event.threadID, (error, info) => {
      if (!error) {
          global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              correctAnswer: correctAnswer
          });
      }
  });
};
