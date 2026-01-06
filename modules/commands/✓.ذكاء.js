module.exports.config = {
  name: "سيرا",
  version: "5.0.0",
  hasPermssion: 1,
  credits: "عمر",
  description: "تحدث مع سيرا تشان 🐱😺\nاستخدم: .سيرا تشغيل / .سيرا ايقاف / .سيرا [رسالة]",
  commandCategory: "خدمات",
  usages: "[تشغيل/ايقاف/نص]",
  cooldowns: 3,
  dependencies: {
      axios: ""
  }
};

const emojis = ["🐱", "😺", "😹", "😻", "🙀", "✨", "💫"];
function getRandomEmoji(count = 2) {
  let res = "";
  for (let i = 0; i < count; i++) res += emojis[Math.floor(Math.random() * emojis.length)];
  return res;
}

async function talkSimsimi(message) {
  const axios = global.nodemodule.axios;
  try {
      const { data } = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=ar&message=${encodeURIComponent(message)}&filter=true`);
      return { error: false, data };
  } catch (err) {
      return { error: true, data: {} };
  }
}

module.exports.onLoad = async function () {
  if (typeof global === "undefined") global = {};
  if (!global.sira) global.sira = new Map(); // لكل محادثة
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body } = event;

  if (!global.sira.has(threadID)) return;
  if (!body || senderID == api.getCurrentUserID()) return;

  const { data, error } = await talkSimsimi(body);
  if (error) return; // تجاهل الخطأ
  if (!data.success) return api.sendMessage(`${getRandomEmoji()} آسفة 😹 لم أفهمك!`, threadID, messageID);

  const responses = [
    `${getRandomEmoji()} ${data.success}`,
    `😺 سيرا تقول: ${data.success} ${getRandomEmoji()}`,
    `🐱 هاها! ${data.success}`,
    `✨ ${data.success} ${getRandomEmoji()}`
  ];

  return api.sendMessage(responses[Math.floor(Math.random() * responses.length)], threadID, messageID);
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const send = (msg) => api.sendMessage(msg, threadID, messageID);

  if (args.length == 0) return send(`${getRandomEmoji()} هاي! استخدم .سيرا تشغيل لتشغيل البوت أو اكتب رسالة للتحدث معي 😺`);

  switch (args[0].toLowerCase()) {
    case "تشغيل":
      if (global.sira.has(threadID)) return send(`🐱 سيرا بالفعل تعمل هنا! ${getRandomEmoji()}`);
      global.sira.set(threadID, true);
      return send(`✨ تم تشغيل سيرا تشان في هذه المحادثة! ${getRandomEmoji(3)}`);
    case "ايقاف":
      if (!global.sira.has(threadID)) return send(`🙀 سيرا متوقفة أصلاً! ${getRandomEmoji()}`);
      global.sira.delete(threadID);
      return send(`😺 تم إيقاف سيرا تشان بنجاح! ${getRandomEmoji(3)}`);
    default:
      const { data, error } = await talkSimsimi(args.join(" "));
      if (error) return send(`😹 عذرًا! حدث خطأ ولم أستطع الرد. ${getRandomEmoji()}`);
      if (!data.success) return send(`🐱 لم أفهمك 😺 حاول صياغة الرسالة بطريقة مختلفة!`);
      const replies = [
        `😺 ${data.success} ${getRandomEmoji()}`,
        `🐱 سيرا تقول: ${data.success}`,
        `${getRandomEmoji()} هاها: ${data.success}`,
        `✨ ${data.success} ${getRandomEmoji()}`
      ];
      return send(replies[Math.floor(Math.random() * replies.length)]);
  }
};
