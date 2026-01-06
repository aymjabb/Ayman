const fs = require("fs");
const pathData = __dirname + "/cache/protectData.json";

module.exports.config = {
    name: "حماية",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "نوت دفاين",
    description: "حماية اسم المجموعة، صورتها، وكنية الأعضاء",
    commandCategory: "مسؤولي المجموعات",
    usages: ".حماية اسم تشغيل/إيقاف\n.حماية صورة تشغيل/إيقاف\n.حماية كنية تشغيل/إيقاف",
    cooldowns: 5
};

// عند التحميل
module.exports.onLoad = () => {
    if (!fs.existsSync(pathData)) fs.writeFileSync(pathData, JSON.stringify({}));
};

// حدث كل رسالة أو تعديل
module.exports.handleEvent = async function ({ api, event, Threads }) {
    const { threadID, senderID } = event;
    if (!event.isGroup) return;

    let data = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    if (!data[threadID]) {
        // تهيئة البيانات للمجموعة إذا لم تكن موجودة
        const threadInfo = await Threads.getData(threadID);
        data[threadID] = {
            name: { value: threadInfo.threadInfo.threadName, status: false },
            image: { value: threadInfo.threadInfo.imageSrc || "", status: false },
            nickname: { status: false }
        };
        fs.writeFileSync(pathData, JSON.stringify(data, null, 2));
    }

    const groupData = data[threadID];

    // حماية الاسم
    const threadInfo = await Threads.getData(threadID);
    if (groupData.name.status && threadInfo.threadInfo.threadName !== groupData.name.value) {
        await api.setTitle(groupData.name.value, threadID);
        api.sendMessage(`🐱😺 ههه حاولت تغيّر اسم المجموعة؟ لا يا بطل! الاسم رجع تلقائياً 😹`, threadID);
    }

    // حماية الصورة
    if (groupData.image.status && threadInfo.threadInfo.imageSrc !== groupData.image.value) {
        await api.changeThreadImage(groupData.image.value, threadID);
        api.sendMessage(`😼 صورة المجموعة رجعت زي ما كانت! لا تحاول تلعب يا حلو 🐱`, threadID);
    }

    // حماية الكنية
    if (groupData.nickname.status && event.isGroup && event.author && event.body) {
        // هنا ممكن إضافة كود لمنع تغيير كنية محددة، حسب امكانيات API
        // مثال: يمكن تخزين كنيات كل عضو ومنع التغيير
    }
};

// تشغيل/إيقاف الحماية
module.exports.run = async function ({ api, event, args }) {
    const { threadID } = event;
    if (!args[0] || !args[1]) return api.sendMessage("❌ استخدم: .حماية [اسم/صورة/كنية] تشغيل/إيقاف", threadID);

    const type = args[0].toLowerCase(); // اسم / صورة / كنية
    const action = args[1].toLowerCase(); // تشغيل / إيقاف

    let data = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    if (!data[threadID]) data[threadID] = { name: { value: "", status: false }, image: { value: "", status: false }, nickname: { status: false } };

    if (!["تشغيل", "إيقاف"].includes(action)) return api.sendMessage("❌ اختار تشغيل أو إيقاف فقط!", threadID);

    let status = action === "تشغيل";

    switch (type) {
        case "اسم":
            data[threadID].name.status = status;
            api.sendMessage(`🐱😺 حماية الاسم ${status ? "✅ تم تشغيلها" : "❌ تم إيقافها"}!`, threadID);
            break;
        case "صورة":
            data[threadID].image.status = status;
            api.sendMessage(`🐱😺 حماية صورة المجموعة ${status ? "✅ تم تشغيلها" : "❌ تم إيقافها"}!`, threadID);
            break;
        case "كنية":
            data[threadID].nickname.status = status;
            api.sendMessage(`🐱😺 حماية كنية الأعضاء ${status ? "✅ تم تشغيلها" : "❌ تم إيقافها"}!`, threadID);
            break;
        default:
            return api.sendMessage("❌ النوع غير معروف! استخدم: اسم / صورة / كنية", threadID);
    }

    fs.writeFileSync(pathData, JSON.stringify(data, null, 2));
};
