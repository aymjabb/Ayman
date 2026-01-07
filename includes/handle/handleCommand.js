module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require("string-similarity"),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    logger = require("../../utils/log.js");
  const moment = require("moment-timezone");

  // ⏳ دالة التأخير العامة (4 ثواني)
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return async function ({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, DeveloperMode, adminOnly, YASSIN } = global.config;

    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;

    var { body, senderID, threadID, messageID } = event;

    senderID = String(senderID);
    threadID = String(threadID);

    const threadSetting = threadData.get(threadID) || {};
    const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : PREFIX;
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(prefix)})\\s*`);

    const [matchedPrefix] = body.match(prefixRegex) || [null];
    const args = matchedPrefix
      ? body.slice(matchedPrefix.length).trim().split(/ +/)
      : body.trim().split(/ +/);

    const commandName = args.shift().toLowerCase();
    var command = commands.get(commandName);

    if (YASSIN === "true" && !ADMINBOT.includes(senderID)) return;

    if (!command) {
      var allCommandName = [];
      for (const cmd of commands.keys()) allCommandName.push(cmd);

      const checker = stringSimilarity.findBestMatch(commandName, allCommandName);

      if (checker.bestMatch.rating >= 0.8) {
        command = commands.get(checker.bestMatch.target);
      } else if (matchedPrefix) {
        api.sendMessage(
          `😺 ماكو أمر بهالاسم بابا!\nيمكن تقصد: 「 ${checker.bestMatch.target} 」`,
          threadID,
          messageID
        );
        return;
      }
    }

    // 🚫 الحظر
    if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox === false && senderID == threadID)) {
      if (!ADMINBOT.includes(senderID)) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID) || {};
          return api.sendMessage(
            global.getText("handleCommand", "userBanned", reason, dateAdded),
            threadID,
            messageID
          );
        }
        if (threadBanned.has(threadID)) {
          const { reason, dateAdded } = threadBanned.get(threadID) || {};
          return api.sendMessage(
            global.getText("handleCommand", "threadBanned", reason, dateAdded),
            threadID,
            messageID
          );
        }
      }
    }

    // 🚫 حظر أوامر
    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [];
        const banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name) || banUsers.includes(command.config.name)) {
          return api.sendMessage(
            `🙀 هذا الأمر محظور عليك بابا`,
            threadID,
            messageID
          );
        }
      }
    }

    // 🔞 NSFW
    if (
      command.config.commandCategory.toLowerCase() == "nsfw" &&
      !global.data.threadAllowNSFW.includes(threadID) &&
      !ADMINBOT.includes(senderID)
    ) {
      return api.sendMessage(
        global.getText("handleCommand", "threadNotAllowNSFW"),
        threadID,
        messageID
      );
    }

    // 👮‍♂️ الصلاحيات
    let permssion = 0;
    const threadInfoo = threadInfo.get(threadID) || await Threads.getInfo(threadID);
    if (ADMINBOT.includes(senderID)) permssion = 2;
    else if (threadInfoo.adminIDs.some(e => e.id == senderID)) permssion = 1;

    if (command.config.hasPermssion > permssion) {
      return api.sendMessage(
        `😾 ما عندك صلاحية لهالأمر`,
        threadID,
        messageID
      );
    }

    // ⏱️ نظام التبريد
    if (!cooldowns.has(command.config.name)) {
      cooldowns.set(command.config.name, new Map());
    }

    const timestamps = cooldowns.get(command.config.name);
    const expirationTime = (command.config.cooldowns || 1) * 1000;

    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) {
      return api.setMessageReaction("⏳", messageID, () => {}, true);
    }

    // 🌍 اللغات
    let getText2 = () => {};
    if (command.languages && command.languages[global.config.language]) {
      getText2 = (...values) => {
        let lang = command.languages[global.config.language][values[0]] || "";
        for (let i = values.length - 1; i > 0; i--) {
          lang = lang.replace(new RegExp("%" + i, "g"), values[i]);
        }
        return lang;
      };
    }

    try {
      const Obj = {
        api,
        event,
        args,
        models,
        Users,
        Threads,
        Currencies,
        permssion,
        getText: getText2
      };

      // 🐱⏳ تأخير سيرا تشان (4 ثواني)
      await delay(4000);

      command.run(Obj);
      timestamps.set(senderID, dateNow);

      if (DeveloperMode) {
        logger(
          `[DEV] ${commandName} | ${senderID} | ${threadID} | ${Date.now() - dateNow}ms`
        );
      }
    } catch (e) {
      return api.sendMessage(
        `💥 صار خطأ بابا:\n${e.message}`,
        threadID
      );
    }
  };
};
