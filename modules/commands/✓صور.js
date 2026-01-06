module.exports.config = {
  name: "صور",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "أيمن • مزخرف بواسطة Sera Chan 🐱",
  description: "بحث صور على Pinterest مع دعم التفاعل ❤ لطباعة المزيد",
  commandCategory: "tools",
  usages: "صور [كلمة البحث] - [عدد الصور ≤ 10]",
  cooldowns: 0
};

const axios = require("axios");
const request = require("request");

module.exports.run = async function({ api, event, args }) {
  let name = args.join(" ").trim().split("-")[0];
  let number = parseInt(args.join(" ").trim().split("-")[1]) || 1;

  if(!name) return api.sendMessage("⚠️ اكتب كلمة البحث!", event.threadID);

  if(number > 10) number = 10; // الحد الأقصى
  const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };

  const options = {
    url: 'https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(name) + '&rs=typed&term_meta[]=' + encodeURIComponent(name) + '%7Ctyped',
    headers
  };

  request(options, async function(error, response, body) {
    if(error || response.statusCode != 200) return api.sendMessage("❌ حدث خطأ أثناء البحث عن الصور.", event.threadID);

    const allImages = body.match(/https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g);
    if(!allImages || allImages.length == 0) return api.sendMessage("⚠️ لم يتم العثور على صور لـ: " + name, event.threadID);

    const imgList = [];
    for(let i = 0; i < Math.min(number, allImages.length); i++) {
      const imgStream = await axios.get(allImages[i], { responseType: "stream" });
      imgList.push(imgStream.data);
    }

    const seraMsg = await api.sendMessage({
      body: `✨ Sera Chan 🐱 تقول: هذه أول دفعة من صور "${name}"\n📸 عدد الصور: ${imgList.length}\nاضغط ❤ لمزيد من الصور إذا أحببت!`,
      attachment: imgList
    }, event.threadID);

    // حفظ بيانات البحث للـ handleReaction
    global.client.handleReaction.push({
      type: "heart_images",
      name: "صور",
      messageID: seraMsg.messageID,
      author: event.senderID,
      search: name,
      allImages,
      shown: number,
      headers
    });
  });
};

module.exports.handleReaction = async function({ api, event }) {
  const index = global.client.handleReaction.findIndex(i => i.messageID == event.messageID);
  if(index < 0) return;

  const data = global.client.handleReaction[index];
  if(event.userID != data.author || event.reaction != "❤") return;

  // عرض الدفعة التالية
  const nextImages = [];
  const start = data.shown;
  const end = Math.min(start + 10, data.allImages.length);

  if(start >= data.allImages.length) {
    return api.sendMessage("💖 لا توجد صور أخرى متبقية!", event.threadID);
  }

  for(let i = start; i < end; i++) {
    const imgStream = await axios.get(data.allImages[i], { responseType: "stream" });
    nextImages.push(imgStream.data);
  }

  data.shown = end; // تحديث العدادات

  api.sendMessage({
    body: `✨ Sera Chan 🐱 تقول: دفعة جديدة من صور "${data.search}"\n📸 عدد الصور: ${nextImages.length}\nاضغط ❤ مرة أخرى إذا أردت المزيد!`,
    attachment: nextImages
  }, event.threadID);
};
