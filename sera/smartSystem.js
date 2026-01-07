const fs = require("fs-extra");
const path = require("path");

const DATA_DIR = __dirname;
const USERS_PATH = path.join(DATA_DIR, "users.json");

// تأكد من وجود ملف البيانات
if (!fs.existsSync(USERS_PATH)) fs.writeJsonSync(USERS_PATH, {});

// حالة النظام التكاملي
let SYSTEM_ENABLED = true;

// ==========================================
// دوال النظام
function toggleSystem(state) {
  SYSTEM_ENABLED = state;
}

function isEnabled() {
  return SYSTEM_ENABLED;
}

function getUsers() {
  return fs.readJsonSync(USERS_PATH);
}

function saveUsers(data) {
  fs.writeJsonSync(USERS_PATH, data, { spaces: 2 });
}

// ==========================================
// تهيئة مستخدم جديد
function initUser(id, name) {
  const users = getUsers();
  if (!users[id]) {
    users[id] = {
      id,
      nameFB: name,
      realName: null,
      country: null,
      interests: [],
      points: 0,
      money: 0,
      title: "عضو جديد",
      messages: 0,
      commands: {},
      lastAsked: 0
    };
    saveUsers(users);
  }
}

// ==========================================
// تسجيل التفاعل
function logInteraction(id, msg, cmd = null) {
  if (!SYSTEM_ENABLED) return;

  const users = getUsers();
  const u = users[id];
  if (!u) return;

  u.messages++;
  u.points += 1;
  u.money += 2;

  if (cmd) {
    u.commands[cmd] = (u.commands[cmd] || 0) + 1;
  }

  // تحليل الذكاء الشخصي حسب الكلمات
  if (msg.includes("لعبة")) addInterest(id, "ألعاب");
  if (msg.includes("كرة")) addInterest(id, "رياضة");
  if (msg.includes("برمجة")) addInterest(id, "برمجة");
  if (msg.includes("اغنية")) addInterest(id, "موسيقى");

  saveUsers(users);
}

// ==========================================
// إضافة اهتمامات
function addInterest(id, interest) {
  const users = getUsers();
  if (!users[id].interests.includes(interest)) {
    users[id].interests.push(interest);
    saveUsers(users);
  }
}

// ==========================================
// الأسئلة الذكية
function getSmartQuestion(user) {
  if (!SYSTEM_ENABLED) return null;

  const now = Date.now();
  if (now - user.lastAsked < 6 * 60 * 60 * 1000) return null; // كل 6 ساعات

  if (!user.realName) return "👋 شنو اسمك الحقيقي؟";
  if (!user.country) return "🌍 من وين انت؟";
  if (user.interests.length < 2) return "🎯 شنو أكثر شي تحبه؟";

  return null;
}

function applyAnswer(id, text) {
  const users = getUsers();
  const u = users[id];

  if (!u) return;

  if (!u.realName) u.realName = text;
  else if (!u.country) u.country = text;
  else addInterest(id, text);

  u.lastAsked = Date.now();
  saveUsers(users);
}

// ==========================================
// زيادة نقاط وعملات (للأوامر بالبادئة -)
function rewardUser(id, points = 10, money = 50) {
  const users = getUsers();
  const u = users[id];
  if (!u) return;

  u.points += points;
  u.money += money;
  saveUsers(users);
}

module.exports = {
  initUser,
  logInteraction,
  getSmartQuestion,
  applyAnswer,
  toggleSystem,
  isEnabled,
  rewardUser,
  getUsers,
  saveUsers
};
