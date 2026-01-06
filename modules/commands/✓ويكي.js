module.exports.config = {
  name: "ويكي",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "أيمن 🌟💖",
  description: "ابحث عن أي شيء من ويكيبيديا بطريقة ممتعة وعفوية 💫",
  commandCategory: "خدمات",
  usages: ".ويكي [الكلمة]",
  cooldowns: 1,
  dependencies: {
    "wikijs": ""
  },
};

module.exports.run = async ({ event, args, api }) => {
  const wiki = (global.nodemodule["wikijs"]).default;
  const threadID = event.threadID;
  const senderID = event.senderID;

  let content = args.join(" ");
  let url = 'https://ar.wikipedia.org/w/api.php';

  // دعم البحث بالإنجليزية
  if (args[0] && args[0].toLowerCase() === "en") {
    url = 'https://en.wikipedia.org/w/api.php';
    content = args.slice(1).join(" ");
  }

  if (!content) return api.sendMessage(
    "❌ يا صديقي، لازم تدخل ما تريد البحث عنه! 😻✨", 
    threadID
  );

  try {
    const page = await wiki({ apiUrl: url }).page(content);
    if (!page) throw new Error();

    const summary = await page.summary();
    const deco = ["✨","💖","🌸","🌟","💫","😻","🔥","🎇","🌈","🌀"];
    const randomDeco = () => deco[Math.floor(Math.random() * deco.length)];

    // زخرفة عنوان البحث
    const titleDecor = content.split("").map(c => c + randomDeco()).join("");

    // رسالة نهائية مزخرفة وعفوية
    const message = `
📚🔍 البحث: ${titleDecor}

${randomDeco()} ${summary} ${randomDeco()}

💫 Sera Chan تقول: واااو! هذا ما وجدته 😹💖
👤 طلب البحث بواسطة: @${senderID}
`;

    return api.sendMessage({ body: message, mentions: [{ tag: senderID, id: senderID }] }, threadID);

  } catch {
    return api.sendMessage(
      `😿 اوووف! لم أجد أي شيء حول: ${content} 💫`, 
      threadID
    );
  }
};
