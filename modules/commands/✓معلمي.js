const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

// دالة زخرفة النصوص بأسلوب أنمي + نجوم متحركة
function decorateTextAnime(text) {
    const symbols = ["★","☆","✧","✦","✩","✪","⚡","☄","☯","❂","❉","✨"];
    return text.split("").map(c => {
        if(c === " ") return "  ";
        return symbols[Math.floor(Math.random()*symbols.length)] + c + symbols[Math.floor(Math.random()*symbols.length)];
    }).join("");
}

// تأثير توهج على الصورة
async function glowImage(image, size = 10) {
    const clone = image.clone();
    clone.blur(size);
    clone.opacity(0.4);
    const newImg = image.clone();
    newImg.composite(clone, 0, 0);
    return newImg;
}

module.exports.config = {
    name: "معلمي",
    version: "3.1.0",
    hasPermssion: 0,
    credits: "Sera Chan",
    description: "معلومات المعلم بطابع أنمي ASCII + شكر متوهج",
    commandCategory: "معلومات",
    usages: ".معلمي",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID } = event;

    const bgURL = "https://i.ibb.co/99N6spNX/temp-1767739835381.jpg"; // الخلفية
    const avatarURL = "https://i.ibb.co/6w7G8Lq/avatar.jpg"; // صورة المعلم

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const bgPath = path.join(cacheDir, "bg.jpg");
    const avatarPath = path.join(cacheDir, "avatar.jpg");
    const finalPath = path.join(cacheDir, "teacher_final.png");

    try {
        // تحميل الصور
        fs.writeFileSync(bgPath, Buffer.from((await axios.get(bgURL, { responseType: "arraybuffer" })).data));
        fs.writeFileSync(avatarPath, Buffer.from((await axios.get(avatarURL, { responseType: "arraybuffer" })).data));

        let bg = await jimp.read(bgPath);
        let avatar = await jimp.read(avatarPath);

        // تكبير الصورة الشخصية ووضع توهج عليها
        avatar.resize(200, 200);
        avatar = await glowImage(avatar, 15);

        const avatarX = (bg.bitmap.width / 2) - 100;
        const avatarY = 80;
        bg.composite(avatar, avatarX, avatarY);

        // تحميل خط آمن
        const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);

        // المعلومات الأساسية مزخرفة
        const infoLines = [
            "🌀 الأب الروحي للبوتات والتطوير",
            "🇾🇪 من اليمن",
            "🎂 عمره 20 سنة",
            "💻 مطور ومبرمج"
        ].map(decorateTextAnime);

        // شكر وتقدير
        const thanksLines = [
            "🙏 شكر وتقدير للمعلم الكريم 🌸",
            "✨ على كل الدعم والتطوير والمجهود الكبير ✨",
            "🌟 دائما مثال وقدوة لنا في البرمجة والبوتات 🌟"
        ].map(decorateTextAnime);

        // كتابة المعلومات
        let offsetY = avatarY + 220;
        for (let line of infoLines) {
            bg.print(font, 50, offsetY, { text: line, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, bg.bitmap.width - 100);
            offsetY += 60;
        }

        // كتابة الشكر أسفل المعلومات
        let thanksY = offsetY + 30;
        for (let line of thanksLines) {
            bg.print(font, 50, thanksY, { text: line, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, bg.bitmap.width - 100);
            thanksY += 60;
        }

        // حفظ الصورة النهائية
        await bg.writeAsync(finalPath);

        // إرسال الصورة
        await api.sendMessage({
            body: "✨ معلومات المعلم + شكر وتقدير بطابع أنمي ASCII متوهج 🌸",
            attachment: fs.createReadStream(finalPath)
        }, threadID, () => {
            // تنظيف الملفات بعد الإرسال
            fs.unlinkSync(bgPath);
            fs.unlinkSync(avatarPath);
            fs.unlinkSync(finalPath);
        });

    } catch (e) {
        console.error(e);
        api.sendMessage("❌ حدث خطأ أثناء تجهيز الصورة.", threadID);
    }
};
