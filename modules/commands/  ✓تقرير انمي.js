module.exports.config = {
  name: "تقرير",
  version: "2.5.0",
  hasPermssion: 0,
  credits: "عبالرحمن & سيرا تشان",
  description: "تقرير أنمي منسق وجميل بطابع سيرا اللطيفة 🐱✨",
  commandCategory: "خدمات سيرا",
  usages: "[اسم الانمي]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const Scraper = require("mal-scraper");
  const fs = require("fs-extra");

  const { threadID, messageID, senderID } = event;
  let query = args.join(" ");

  if (!query) return api.sendMessage("╭──── • ◈ • ────╮\n  يوه! اكتب اسم الأنمي أولاً ✨\n╰──── • ◈ • ────╯", threadID, messageID);

  api.sendMessage(`✨ سيرا تبحث لك عن "${query}".. لحظة بس! 🐾`, threadID, messageID);

  try {
    const Anime = await Scraper.getInfoFromName(query);

    if (!Anime) throw new Error("لم يتم العثور على الأنمي");

    // تجهيز المسار للصورة
    const path = __dirname + `/cache/anime_${senderID}.png`;
    const getImg = (await axios.get(Anime.picture, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(getImg, "utf-8"));

    // تنسيق الرسالة بأسلوب سيرا المزخرف
    const message = `╭──── • ◈ • ────╮
  🐾 تـقـريـر أنـمـي سـيـرا 🐾
╰──── • ◈ • ────╯

💖 الـاسـم: ${Anime.title}
🈶 بـالياباني: ${Anime.japaneseTitle || "لا يوجد"}
🎬 الـنـوع: ${Anime.type}
📊 الـحـالـة: ${Anime.status}
📺 الـحـلقـات: ${Anime.episodes || "غير معروف"}
⏳ الـمـدة: ${Anime.duration || "غير معروف"}
⭐ الـتـقـيـيـم: ${Anime.score || "لا يوجد"}
🏆 الـتـرتـيـب: ${Anime.ranked || "غير معروف"}
📌 الـتـصـنيـف: ${Anime.rating || "الكل"}
🎭 الأنـواع: ${Anime.genres ? Anime.genres.join(", ") : "غير محدد"}
🏢 الاسـتوديو: ${Anime.studios ? Anime.studios.join(", ") : "غير معروف"}

📝 مـلـخـص الـقـصـة:
${Anime.synopsis ? Anime.synopsis.slice(0, 500) + "..." : "لا يوجد ملخص متوفر حالياً 🥺"}

🔗 رابـط MAL: ${Anime.url}

✨ سـيـرا تـتـمـنى لـك مـشـاهـدة مـمـتـعـة! ✨`;

    return api.sendMessage({
      body: message,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("🥺 سيرا دورت ودورت بس ما لقت هذا الأنمي.. تأكد من الاسم بالانجليزي يا عسل!", threadID, messageID);
  }
};
