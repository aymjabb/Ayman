module.exports.config = {
  name: "مطلوب",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "عمر",
  description: "حط صورتك على بوستر مطلوب الجديد 🐱",
  commandCategory: "صور",
  usages: " ",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "canvas" :"",
    "jimp": "",
    "node-superfetch": ""
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/wanted.png";
  let pathAva = __dirname + "/cache/avt.png";

  // تحديد الشخص: المرسل أو الرد أو منشن
  let uid = senderID;
  if(event.type == "message_reply") uid = event.messageReply.senderID;
  if (args.join().includes('@')) uid = Object.keys(event.mentions)[0];

  // جلب صورة الشخص
  let Avatar = (
    await axios.get(
      `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));

  // جلب البوستر الجديد
  let getWanted = (
    await axios.get(`https://i.ibb.co/m5JXsr8J/temp-1767738984106.jpg`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

  // الرسم على الكانفس
  let baseImage = await loadImage(pathImg);
  let baseAva = await loadImage(pathAva);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  // وضع الصورة الشخصية في المكان المناسب على البوستر
  ctx.drawImage(baseAva, 144, 229, 290, 290);

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAva);

  return api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
