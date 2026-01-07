const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "اصفعي",
  version: "3.3.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "تصفع أحدهم بمنشن أو رد بطريقة مرحة 😹💥",
  commandCategory: "ترفيه",
  usages: "[@منشن أو رد]",
  cooldowns: 5
};

module.exports.onLoad = async() => {
  const dir = path.join(__dirname, "cache/canvas/");
  const bgPath = path.join(dir, "sato.png");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(bgPath)) {
    const url = "https://i.imgur.com/dsrmtlg.jpg";
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, Buffer.from(res.data));
  }
};

async function circle(image) {
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache/canvas");
  const base_img = await jimp.read(path.join(__root, "sato.png"));
  const pathImg = path.join(__root, `sato_${one}_${two}.png`);
  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);

  // تحميل الصور الشخصية
  const avatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const avatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne));
  fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo));

  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  // ترتيب الصور: المرسل يكون على اليسار دائماً
  base_img.composite(circleOne.resize(160, 160), 90, 200)
          .composite(circleTwo.resize(160, 160), 280, 70);

  const buffer = await base_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, buffer);

  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return pathImg;
}

// عبارات مضحكة للصفع
const slapTexts = [
  "هاها! تلقت صفعة مرحة من سيرا تشان 😹",
  "أووووه 😆، ها قد صُفعَ!",
  "سيرا تقول: 'استيقظت الآن! 😼'",
  "تفلّت ضحكة صاخبة بعد الصفع 🤣",
  "ووووه! لقد شعرت بالصفعة الخيالية 🐱💥"
];

module.exports.run = async function({ event, api, Users }) {    
  const { threadID, messageID, senderID, messageReply, mentions } = event;

  // دعم التاغ أو الرد
  let targetID;
  if (Object.keys(mentions).length) targetID = Object.keys(mentions)[0];
  else if (messageReply && messageReply.senderID) targetID = messageReply.senderID;
  else return api.sendMessage("😹 عليك منشن شخص أو الرد على مسج لتصفعه!", threadID, messageID);

  const one = senderID; // المرسل
  const two = targetID; // المتلقي

  const nameSender = await Users.getNameUser(senderID);
  const nameTarget = await Users.getNameUser(targetID);

  const imagePath = await makeImage({ one, two });

  // اختيار نص عشوائي
  const text = slapTexts[Math.floor(Math.random() * slapTexts.length)];

  return api.sendMessage({
    body: `💥 ${text}\nمن: ${nameSender} → إلى: ${nameTarget}`,
    attachment: fs.createReadStream(imagePath)
  }, threadID, () => fs.unlinkSync(imagePath), messageID);
};
