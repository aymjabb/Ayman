module.exports.config = {
  name: "قبر",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "عمر • مزخرف بواسطة Sera Chan",
  description: "تسويلك قبر أو للتسويله منشن مع طابع Sera Chan 🐱",
  commandCategory: "ترفيه",
  usages: " ",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "canvas": "",
    "jimp": "",
    "node-superfetch": ""
  }
};

module.exports.circle = async (image) => {
    const jimp = global.nodemodule['jimp'];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

// رسائل عفوية من Sera Chan بعد عمل القبر
function randomSeraMessage() {
  const messages = [
    "😼 هذا القبر لفناننا اليوم!",
    "🐾 تبا لروحك يا صغيري 😹",
    "✨ Sera Chan تقول: ارحم الفقيد!",
    "😺 كل الاحترام للراحل، استمع للقوانين!",
    "🐱 البوت يراقب كل شيء 😼"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports.run = async ({ event, api, args, Users }) => {
  try {
    const Canvas = global.nodemodule['canvas'];
    const request = global.nodemodule["node-superfetch"];
    const jimp = global.nodemodule["jimp"];
    const fs = global.nodemodule["fs-extra"];
    const path_toilet = __dirname+'/cache/damma.jpg'; 
    const id = Object.keys(event.mentions)[0] || event.senderID;

    const canvas = Canvas.createCanvas(500, 670);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('https://i.imgur.com/A4quyh3.jpg');

    let avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avatar = await this.circle(avatar.body);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(await Canvas.loadImage(avatar), 160, 70, 160, 160);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(path_toilet, imageBuffer);

    const seraMessage = randomSeraMessage(); // رسالة Sera Chan عفوية

    api.sendMessage(
      { 
        attachment: fs.createReadStream(path_toilet, {'highWaterMark': 128 * 1024}), 
        body: `اقرأ الفاتحة 😂🥂\n${seraMessage}`
      }, 
      event.threadID, 
      () => fs.unlinkSync(path_toilet), 
      event.messageID
    );
  } catch(e) {
    api.sendMessage(`❌ حدث خطأ:\n${e.stack}`, event.threadID);
  }
}
