module.exports.config = {
  name: "تقرير",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "عبالرحمن",
  description: "تقرير أنمي منسق وجميل بطابع سيرا 🐱",
  commandCategory: "خدمات",
  usages: "[اسم الانمي]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const Scraper = require("mal-scraper");
  const request = require("request");
  const fs = require("fs");

  // استخرج اسم الأنمي من الرسالة
  let input = event.body || "";
  if (!input) return api.sendMessage("⚠️ | يرجى كتابة اسم الأنمي بعد الأمر.", event.threadID, event.messageID);
  let query = input.replace(/^\S+\s*/, ""); // إزالة الأمر من بداية الرسالة

  api.sendMessage(`🔎 | جاري البحث عن "${query}"... 🐱`, event.threadID, event.messageID);

  let Anime;
  try {
    Anime = await Scraper.getInfoFromName(query);
  } catch (err) {
    return api.sendMessage("⚠️ | حدث خطأ أثناء البحث عن الأنمي: " + err, event.threadID, event.messageID);
  }

  // التحقق من بعض الحقول
  if (!Anime.genres || Anime.genres.length === 0) Anime.genres = ["None"];
  if (!Anime.studios || Anime.studios.length === 0) Anime.studios = ["Unknown"];
  if (!Anime.producers || Anime.producers.length === 0) Anime.producers = ["Unknown"];
  
  const {
    title,
    japaneseTitle,
    type,
    status,
    premiered,
    broadcast,
    aired,
    producers,
    studios,
    source,
    episodes,
    duration,
    genres,
    popularity,
    ranked,
    score,
    rating,
    synopsis,
    picture,
    url,
    end_date
  } = Anime;

  // تنسيق الرسالة بشكل جميل
  const message = 
`🐱✨ تقرير أنمي سيرا ✨🐱
💖 الاسم: ${title}
🈶 الاسم بالياباني: ${japaneseTitle}
🎬 النوع: ${type}
📊 الحالة: ${status}
📅 بدأ العرض: ${premiered || "Unknown"}
🕒 البث: ${broadcast || "Unknown"}
📅 المدة: ${aired || "Unknown"}
🏢 الاستوديو: ${studios.join(", ")}
🎥 الإنتاج: ${producers.join(", ")}
📚 المصدر: ${source || "Unknown"}
📺 الحلقات: ${episodes || "Unknown"}
⏳ مدة الحلقة: ${duration || "Unknown"}
📌 التصنيف: ${rating || "Unknown"}
🏆 الترتيب: ${ranked || "Unknown"}
🔥 الشعبية: ${popularity || "Unknown"}
⭐ التقييم: ${score || "Unknown"}
🎭 الأنواع: ${genres.join(", ")}

📝 ملخص: 
${synopsis}

🔗 رابط MAL: ${url}
🆔 التقرير من تطوير: عبالرحمن | آيدي: ${event.senderID}
`;

  // تحميل الصورة
  const ext = picture.substring(picture.lastIndexOf(".") + 1);
  const pathImg = __dirname + `/cache/mal.${ext}`;

  request(picture)
    .pipe(fs.createWriteStream(pathImg))
    .on("close", () => {
      api.sendMessage(
        { body: message, attachment: fs.createReadStream(pathImg) },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        event.messageID
      );
    });
};
