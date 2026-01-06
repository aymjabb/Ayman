const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const ytSearch = require("yt-search"); // مكتبة للبحث عن الأغاني في يوتيوب

module.exports.config = {
  name: "سمعيني",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "61577861540407",
  description: "البحث عن أغنية وتشغيلها مع بصمة صوتية لكل الأعضاء",
  commandCategory: "ترفيه",
  usages: "<اسم الأغنية>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const songName = args.join(" ");
  
  if (!songName) {
    return api.sendMessage("🤔 من فضلك قدم اسم أغنية للبحث عنها! (أو في حالة كنت مشغول، نقترح عليك الاستماع لأغنيتك المفضلة... 😂)", threadID, messageID);
  }

  try {
    // البحث عن الأغنية في يوتيوب باستخدام yt-search
    const result = await ytSearch(songName);
    const video = result.videos[0];  // اختيار أول نتيجة من البحث

    const videoURL = video.url;
    const songTitle = video.title;
    const songDuration = video.timestamp;

    // جلب رابط الصوت (نسخة MP3) من YouTube
    const audioStream = ytdl(videoURL, { filter: 'audioonly' });

    // توليد البصمة الصوتية للأغنية
    const audioFilePath = `./cache/${songTitle}.mp3`;
    audioStream.pipe(fs.createWriteStream(audioFilePath));

    // بعد تحميل الأغنية، سنولد بصمة صوتية
    audioStream.on("end", () => {
      // توليد البصمة الصوتية
      const waveformImagePath = `./cache/${songTitle}_waveform.png`;
      ffmpeg(audioFilePath)
        .audioFilters('showwaves=s=640x120')  // استخدام الفلتر الصحيح للبصمة الصوتية
        .output(waveformImagePath)
        .on('end', () => {
          // إرسال رسالة تحتوي على معلومات الأغنية
          api.sendMessage({
            body: `🎵 **تم العثور على الأغنية!**\n\n**اسم الأغنية:** ${songTitle}\n**المدة:** ${songDuration}\n\n🔗 **رابط الفيديو:** ${videoURL}\n\n🌟 **استمتع بالأغنية يا خبير!** 🎤\n\nوإذا عجبتك البصمة الصوتية، اضغط "👍"! 😆`,
            attachment: [
              fs.createReadStream(audioFilePath), // إرسال الصوت
              fs.createReadStream(waveformImagePath) // إرسال البصمة الصوتية كصورة
            ]
          }, threadID, messageID);
        })
        .run();
    });

  } catch (err) {
    console.error(err);
    return api.sendMessage("😔 حدث خطأ أثناء البحث عن الأغنية، تأكد من اسم الأغنية وحاول مجددًا، وإذا حصل خطأ عشان ما في مطور هنا للبحث عن الأغنية... 😆", threadID, messageID);
  }
};
