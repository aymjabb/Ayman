module.exports = {
    config: { name: "كروب" },
    run: async function({ api, event, args, globalData }) {
        const { threadID, messageID } = event;
        const action = args[0];

        if(action === "اون") {
            globalData.groupLock[threadID] = true;
            api.sendMessage("🔒 تم غلق المجموعة! أي شخص يدخل سيتم طرده تلقائياً.", threadID, messageID);
        } else if(action === "اوف") {
            globalData.groupLock[threadID] = false;
            api.sendMessage("🔓 تم فتح المجموعة الآن.", threadID, messageID);
        }
    }
};
