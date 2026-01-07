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
async function glowImage(image, size = 15) {
    const clone = image.clone();
    clone.blur(size);
    clone.opacity(0.4);
    const newImg = image.clone();
    newImg.composite(clone, 0, 0);
    return newImg;
}

module.exports.config = {
    name: "معلمي",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "Sera",
    description: "معلومات المعلم بطابع أنمي ASCII + شكر وتقدير متوهج",
    commandCategory: "معلومات",
    usages: ".معلمي",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID } = event;

    const bgURL = "https://i.ibb.co/99N6spNX/temp-1767739835381.jpg"; // الخلفية
    const avatarURL = "https://i.ibb.co/6w7G8Lq/avatar.jpg"; // صورة المعلم المباشرة

    const bgPath = path.join(__dirname, "cache", "bg.jpg");
    const avatarPath = path.join(__dirname, "cache", "avatar.jpg");
    const finalPath = path.join(__dirname, "cache", "teacher_final.png");

    try {
        // تحميل الصور
        fs.writeFileSync(bgPath, Buffer.from((await axios.get(bgURL, { responseType: "arraybuffer" })).data));
        fs.writeFileSync(avatarPath, Buffer.from((await axios.get(avatarURL, { responseType: "arraybuffer" })).data));

        let bg = await jimp.read(bgPath);
        let avatar = await jimp.read(avatarPath);

        // تكبير الصورة الشخصية ووضع توهج عليها
        avatar.resize(200, 200);
        avatar = await glowImage(avatar, 20);

        const avatarX = bg.bitmap.width / 2 - 100;
        const avatarY = 80;
        bg.composite(avatar, avatarX, avatarY);

        // تحميل خط واضح وكبير
        const font = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);

        // المعلومات الأساسية مع زخرفة ASCII
        const infoLines = [
            decorateTextAnime("🌀 الأب الروحي للبوتات والتطوير"),
            decorateTextAnime("🇾🇪 من اليمن"),
            decorateTextAnime("🎂 عمره 20 سنة"),
            decorateTextAnime("💻 مطور ومبرمج")
        ];

        // شكر وتقدير أسفل الصورة
        const thanksLines = [
            decorateTextAnime("🙏 شكر وتقدير للمعلم الكريم 🌸"),
            decorateTextAnime("✨ على كل الدعم والتطوير والمجهود الكبير ✨"),
            decorateTextAnime("🌟 دائما مثال وقدوة لنا في البرمجة والبوتات 🌟")
        ];

        // كتابة المعلومات
        let offsetY = avatarY + 220;
        for (let line of infoLines) {
            bg.print(font, 50, offsetY, { text: line, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, bg.bitmap.width - 100);
            offsetY += 80;
        }

        // كتابة الشكر أسفل المعلومات
        let thanksY = offsetY + 30;
        for (let line of thanksLines) {
            bg.print(font, 50, thanksY, { text: line, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, bg.bitmap.width - 100);
            thanksY += 80;
        }

        // حفظ الصورة النهائية
        await bg.writeAsync(finalPath);

        // إرسال الصورة
        await api.sendMessage({
            body: "✨ معلومات المعلم + شكر وتقدير بطابع أنمي ASCII متوهج 🌸",
            attachment: fs.createReadStream(finalPath)
        }, threadID, () => {
            fs.unlinkSync(bgPath);
            fs.unlinkSync(avatarPath);
            fs.unlinkSync(finalPath);
        });

    } catch (e) {
        console.error(e);
        api.sendMessage("❌ حدث خطأ أثناء تجهيز الصورة.", threadID);
    }
};
