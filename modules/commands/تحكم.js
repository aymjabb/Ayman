const fs = require("fs-extra"); // استدعاء مكتبة التعامل مع الملفات
const path = require("path"); // استدعاء مكتبة التعامل مع المسارات
const { exec } = require("child_process"); // استدعاء exec لتنفيذ أوامر التيرمنال

module.exports.config = {
  name: "control", // اسم الأمر بالإنجليزية لتجنب مشاكل GitHub
  version: "5.0.0",
  hasPermssion: 2, // صلاحية المطور فقط
  credits: "Ayman & Sera", // المطورين
  description: "أدوات السيطرة الملكية للمطور (تحديث، جلب ملفات، تنفيذ أوامر)",
  commandCategory: "Developer", // تصنيف الأمر بالإنجليزية
  usages: "[file / update / command / leave]",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const DEV_ID = "61577861540407"; // أيديك (المطور الرئيسي)

  // التحقق من أن المستخدم هو المطور
  if (senderID !== DEV_ID) 
    return api.sendMessage("❌ هذا الأمر مخصص للمطور فقط.", threadID, messageID);

  const action = args[0]; // الإجراء المطلوب

  // 1️⃣ جلب أي ملف من ملفات البوت
  if (action === "file") {
    const fileName = args[1]; // اسم الملف المطلوب
    if (!fileName) 
      return api.sendMessage("📩 أرسل اسم الملف، مثال: control.js", threadID, messageID);

    const pathFile = path.join(__dirname, fileName); // تحديد المسار
    if (!fs.existsSync(pathFile)) 
      return api.sendMessage("❌ الملف غير موجود.", threadID, messageID);

    return api.sendMessage(
      { body: `📄 ملف: ${fileName}`, attachment: fs.createReadStream(pathFile) }, 
      threadID, 
      messageID
    );
  }

  // 2️⃣ تحديث البوت (Restart)
  if (action === "update") {
    await api.sendMessage("🔄 جاري إعادة تشغيل البوت.. سأعود أقوى!", threadID);
    process.exit(1); // إنهاء العملية لإعادة التشغيل (يعمل مع PM2 أو nodemon)
  }

  // 3️⃣ تنفيذ أمر ترمنال
  if (action === "command") {
    const cmd = args.slice(1).join(" "); // استخراج الأمر
    if (!cmd) 
      return api.sendMessage("💻 أرسل الأمر المراد تنفيذه في السيرفر.", threadID, messageID);

    exec(cmd, (error, stdout, stderr) => {
      if (error) return api.sendMessage(`❌ خطأ: ${error.message}`, threadID, messageID);
      if (stderr) return api.sendMessage(`⚠️ تنبيه: ${stderr}`, threadID, messageID);
      return api.sendMessage(`✅ النتيجة:\n${stdout}`, threadID, messageID);
    });
  }

  // 4️⃣ مغادرة البوت من مجموعة معينة
  if (action === "leave") {
    const id = args[1] || threadID; // استخدام المعرف المرسل أو المجموعة الحالية
    api.sendMessage("🚀 بأمر المطور، البوت يغادر الآن. وداعاً!", id, () => {
      api.removeUserFromGroup(api.getCurrentUserID(), id); // تنفيذ المغادرة
    });
  }

  // 5️⃣ عرض قائمة التحكم إذا لم يتم إرسال خيار
  if (!action) {
    const menu = `
👑 أهلاً بك يا زعيم
──────────────────
🛠️ قائمة التحكم الملكية:
──────────────────
❶ control file [filename]: لجلب كود أي أمر
❷ control update: لإعادة تشغيل البوت فوراً
❸ control command [cmd]: لتنفيذ أوامر السيرفر
❹ control leave [threadID]: لمغادرة أي مجموعة
──────────────────
🐾 نظام البوت تحت أمرك دائماً
`;
    return api.sendMessage(menu, threadID, messageID);
  }
};
