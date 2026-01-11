module.exports = {
    config: {
        name: "eval",
        description: "تنفيذ أي كود JS مباشرة",
        developerOnly: true
    },
    run: async function({ api, event, args }) {
        const { threadID, messageID } = event;
        try {
            let code = args.join(" ");
            let result = eval(code);
            api.sendMessage(
                `╔═══════════════════\n║ 🧪 Eval Result\n╠═══════════════════\n║ ${result}\n╚═══════════════════`,
                threadID,
                messageID
            );
        } catch (e) {
            api.sendMessage(`❌ خطأ: ${e.message}`, threadID, messageID);
        }
    }
};
