
module.exports.config = {
  name: "القوانين",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "عمر • مزخرف بواسطة Sera Chan",
  description: "تعديل وعرض قواعد المجموعة مع طابع Sera Chan 🐱",
  commandCategory: "مسؤولي المجموعات",
  usages: "[اضف/حذف/قائمة] [رقم القاعدة]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
}

module.exports.onLoad = () => {
  const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const pathData = join(__dirname, "cache", "rules.json");
  if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

// زخرفة ASCII لطابع Sera Chan
function decorateSeraChan() {
  const text = "Sera Chan Rules 🐱";
  const symbols = ["═","╔","╗","╚","╝","─","•","✨","🐾"];
  return text.split("").map(c => c === " " ? "   " : symbols[Math.floor(Math.random()*symbols.length)] + c).join("");
}

// دوال للرسائل العفوية من البوت
function randomSeraMessage() {
  const messages = [
    "😼 استمع لقوانين بابا!",
    "🐾 خليك محترم يا صغيري، الأدمنز يراقبون!",
    "😺 هذه القواعد مهمة، تابعها وإلا…",
    "✨ Sera Chan تقول: كل شيء تمام إذا اتبعت القواعد!",
    "🐱 تابع القواعد وكن نشيطًا في المجموعة!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports.run = ({ event, api, args, permssion }) => {
  const { threadID, messageID } = event;
  const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];

  const pathData = join(__dirname, "cache", "rules.json");
  const content = (args.slice(1)).join(" ");
  var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
  var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

  const seraChanText = decorateSeraChan();
  const randomMessage = randomSeraMessage();

  switch (args[0]) {
    case "اضف": {
      if (permssion == 0) return api.sendMessage("❌ آسف، لا تمتلك صلاحية إضافة قاعدة!", threadID, messageID);
      if (content.length == 0) return api.sendMessage("⚠️ لا تترك مكان فارغ، أدخل نص القاعدة!", threadID, messageID);

      if (content.includes("\n")) {
        const contentSplit = content.split("\n");
        for (const item of contentSplit) thisThread.listRule.push(item);
      } else {
        thisThread.listRule.push(content);
      }
      if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
      writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
      return api.sendMessage(`✅ تم إضافة قاعدة جديدة! 🐱\n${seraChanText}\n${randomMessage}`, threadID, messageID);
    }

    case "قائمة":
    case "all": {
      if (thisThread.listRule.length == 0) return api.sendMessage("⚠️ لا توجد أي قواعد في هذه المجموعة!", threadID, messageID);
      let msg = `=== 🐾 قائمة قواعد المجموعة 🐾 ===\n\n`;
      thisThread.listRule.forEach((rule, i) => msg += `${i + 1}/ ${rule}\n`);
      msg += `\n✨ طابع Sera Chan: ${seraChanText}\n${randomMessage}`;
      return api.sendMessage(msg, threadID, messageID);
    }

    case "rm":
    case "حذف":
    case "مسح": {
      if (permssion == 0) return api.sendMessage("❌ آسف، لا تمتلك صلاحية حذف القواعد!", threadID, messageID);
      if (!isNaN(content) && content > 0) {
        if (thisThread.listRule.length == 0) return api.sendMessage("⚠️ لا توجد أي قواعد لحذفها!", threadID, messageID);
        thisThread.listRule.splice(content - 1, 1);
        writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
        return api.sendMessage(`✅ تم حذف القاعدة رقم ${content} 🐱\n${seraChanText}\n${randomMessage}`, threadID, messageID);
      } else if (content == "all") {
        thisThread.listRule = [];
        writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
        return api.sendMessage(`✅ تم مسح جميع القواعد! 🐱\n${seraChanText}\n${randomMessage}`, threadID, messageID);
      }
      break;
    }

    default: {
      if (thisThread.listRule.length != 0) {
        let msg = `=== 🐾 قائمة قواعد المجموعة 🐾 ===\n\n`;
        thisThread.listRule.forEach((rule, i) => msg += `${i + 1}/ ${rule}\n`);
        msg += `\n✨ طابع Sera Chan: ${seraChanText}\n${randomMessage}\n[🚨 جميع القواعد يجب اتباعها، مخالفتها قد تؤدي للعقاب!]`;
        return api.sendMessage(msg, threadID, messageID);
      } else {
        return api.sendMessage("⚠️ لا توجد أي قواعد في هذه المجموعة!", threadID, messageID);
      }
    }
  }

  if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
  writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}
