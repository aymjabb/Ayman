module.exports.config = {
  name: "زواج",
  version: "3.2.0",
  hasPermssion: 0,
  credits: "61577861540407", // تم تغييرها لإيديك
  description: "زواج بمنشن أو بالرد على رسالة 😂🐱",
  commandCategory: "ترفية",
  usages: "[@منشن أو الرد على رسالة]",
  cooldowns: 5,
  dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
  }
};

module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'marriedv4.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.ibb.co/7wnhpcD/temp-1767737362455.jpg", path); // الصورة الجديدة
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let baseImg = await jimp.read(__root + "/marriedv4.png");
  let pathImg = __root + `/married_${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  // جلب صور الحسابات
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));

  // دمج الصور على الخلفية
  baseImg.composite(circleOne.resize(130, 130), 200, 70)
         .composite(circleTwo.resize(130, 130), 350, 150);

  let raw = await baseImg.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);

  // مسح الصور المؤقتة
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {    
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;

  // تحديد الشخص الثاني: منشن أو رد على رسالة
  let two;
  if (event.type == "message_reply") {
    two = event.messageReply.senderID;
  } else if (Object.keys(event.mentions).length > 0) {
    two = Object.keys(event.mentions)[0];
  } else {
    return api.sendMessage("🐱😺 أوه! لازم تعمل منشن لشخص أو ترد على رسالة الشخص 😹", threadID, messageID);
  }

  const one = senderID;

  return makeImage({ one, two }).then(path => {
    api.sendMessage({
      body: `💍🎉 أوه لا! ${event.senderName} و${Object.keys(event.mentions)[0] || "المختار بالرد"} صاروا رسميًا زوجين! 😻🐱\n\nسيرا تشان تقول: "هههههه شو هالعالم الغريب 😂"`,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  });
};
