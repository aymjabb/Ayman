const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");

// رابط جلسة Render
const RENDER_URL = "https://ayman-38p2.onrender.com";

// مجلدات للتنظيف
const cacheDir = path.join(__dirname, "cache");
const delobyDir = path.join(__dirname, "deloby");

// دالة تنظيف الملفات مع إظهار عدد الملفات المحذوفة
async function clearCacheAndDeloby() {
try {
let deletedCache = 0;
let deletedDeloby = 0;

if (fs.existsSync(cacheDir)) {  
  deletedCache = (await fs.readdir(cacheDir)).length;  
  await fs.emptyDir(cacheDir);  
}  

if (fs.existsSync(delobyDir)) {  
  deletedDeloby = (await fs.readdir(delobyDir)).length;  
  await fs.emptyDir(delobyDir);  
}  

console.log(`✅ تم تنظيف الملفات | Cache: ${deletedCache}, Deloby: ${deletedDeloby}`);

} catch (err) {
console.error("❌ خطأ أثناء تنظيف الملفات:", err);
}
}

// دالة Ping لجلسة Render
async function pingRender() {
try {
const res = await axios.get(RENDER_URL);
if (res.status === 200) {
console.log(🔄 تم تجديد الجلسة على Render: ${new Date().toLocaleTimeString()});
} else {
console.log("⚠️ الجلسة غير متاحة، سيتم إعادة التشغيل");
restartBot();
}
} catch (err) {
console.error("❌ فشل ping الجلسة، سيتم إعادة تشغيل البوت:", err.message);
restartBot();
}
}

// دالة لإعادة تشغيل البوت (Linux/Node.js)
function restartBot() {
console.log("♻️ إعادة تشغيل البوت...");
exec("pm2 restart all || node index.js", (err, stdout, stderr) => {
if (err) console.error("❌ خطأ أثناء إعادة التشغيل:", err);
else console.log("✅ تم إعادة تشغيل البوت");
});
}

// دالة شاملة: تنظيف + Ping
async function refreshSession() {
await clearCacheAndDeloby();
await pingRender();
}

// تشغيل كل 5 دقائق تلقائيًا
setInterval(refreshSession, 5 * 60 * 1000);

// تشغيل مباشر عند بداية التشغيل
refreshSession();

ايش اكتب اسم ملفهم وصيغته
