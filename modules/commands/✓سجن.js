module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/wiinted.png";
  let pathAva = __dirname + "/cache/avt.png";

  // تحديد الشخص: المرسل أو الرد أو منشن
  let uid = senderID;
  if(event.type == "message_reply") uid = event.messageReply.senderID;
  if (args.join().indexOf('@') !== -1) uid = Object.keys(event.mentions)[0];

  // تحميل صورة الخلفية (قضبان)
  let Avatar = (
    await axios.get(
      `https://i.postimg.cc/1zmxGQTS/8uv38cfmc74ur1p5rtntitrddi.png`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));

  // تحميل صورة الشخص
  let getWanted = (
    await axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

  // دمج الصور
  let baseImage = await loadImage(pathImg);
  let baseAva = await loadImage(pathAva);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAva, 0, 0, 1024, 2024);
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAva);

  // إرسال الصورة مع طابع سيرا تشان 🐱😺
  return api.sendMessage(
    {
      body: `🐱😺 يا مرحبا! لقد وضعتك خلف القضبان، لا تحاول الهروب 😹💖\n${global.data.userName.get(senderID) || "أنت"}، استمتع بالوضعية الجديدة! 🐱`,
      attachment: fs.createReadStream(pathImg)
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
