const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "معلمي",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Sera Chan",
    description: "شكر وتهنئة للمعلم مع الصورة",
    commandCategory: "معلومات",
    usages: "-معلمي",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID } = event;

    const imgURL = "https://i.ibb.co/6w7G8Lq/avatar.jpg"; // صورة المعلم
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const imgPath = path.join(cacheDir, "teacher.jpg");

    try {
        // تحميل الصورة
        const res = await axios.get(imgURL, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(res.data));

        // رسالة شكر وتهنئة
        const msg = `🌸 سلام من سيرا تشان! 🌸\n\n🙏 شكراً لك أيها المعلم على كل ما قدمته من دعم وتعليم.\n🎉 تهانينا ومزيد من التوفيق والنجاح!`;

        // إرسال الرسالة مع الصورة
        await api.sendMessage({
            body: msg,
            attachment: fs.createReadStream(imgPath)
        }, threadID, () => fs.unlinkSync(imgPath));

    } catch (e) {
        console.error(e);
        api.sendMessage("❌ حدث خطأ أثناء إرسال رسالة المعلم.", threadID);
    }
};
