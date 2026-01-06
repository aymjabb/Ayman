module.exports.config = {
  name: "اصفعي",
  version: "3.2.0",
  hasPermssion: 0,
  credits: "عمر",
  description: "تصفع أحدهم بمنشن بطريقة مرحة وطابع سيرا 🐱💥",
  commandCategory: "ترفية",
  usages: "[@منشن الشخص]",
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
  const path = resolve(__dirname, 'cache/canvas', 'sato.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/dsrmtlg.jpg", path);
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let base_img = await jimp.read(__root + "/sato.png");
  let pathImg = __root + `/sato_${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  let getAvatarOne = (await axios.get(
    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    { responseType: 'arraybuffer' }
  )).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(
    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    { responseType: 'arraybuffer' }
  )).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));

  // تعديل أماكن الصور لتكون أكثر مرحًا ودرامية
  base_img.composite(circleOne.resize(160, 160), 90, 200)
          .composite(circleTwo.resize(160, 160), 280, 70);

  let raw = await base_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);
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
  const mention = Object.keys(event.mentions);

  if (!mention[0]) return api.sendMessage("😹 عليك منشن شخص لتصفعه!", threadID, messageID);

  const one = senderID;
  const two = mention[0];

  return makeImage({ one, two }).then(path => 
    api.sendMessage({
      body: `💥🥳 سيرا تقول: "هاها! ${global.data.userName.get(two) || "صديقك"} تلقت صفعه من ${global.data.userName.get(one) || "أنت"} 😹"`,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID)
  );
}
