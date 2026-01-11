module.exports = {
    config: { name: "سكوتر" },
    run: async function({ api, event, args, globalData }) {
        const { threadID, messageID } = event;
        const action = args[0];
        if(action === "اون") {
            globalData.gameMode[threadID] = true;
            api.sendMessage(`
╔═════════════════════
║ 🎮 وضع اللعبة مفعل
╠═════════════════════
║ أي شخص يتكلم سيتم تحذيره مرتين ثم طرده إلا من يرد على رسائل اللعبة.
╚═════════════════════
            `, threadID, messageID);
        } else if(action === "اوف") {
            globalData.gameMode[threadID] = false;
            api.sendMessage("❌ تم إيقاف وضع اللعبة.", threadID, messageID);
        }
    }
};
