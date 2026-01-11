module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    if(!body.startsWith(".eval")) return;
    let code = body.replace(".eval", "").trim();

    try {
        let result = eval(code);
        if(typeof result !== "string") result = require("util").inspect(result);
        api.sendMessage(`📥 Eval Result:\n────────────\n${result}`, threadID, messageID);
    } catch(e) {
        api.sendMessage(`❌ Error:\n────────────\n${e}`, threadID, messageID);
    }
};
