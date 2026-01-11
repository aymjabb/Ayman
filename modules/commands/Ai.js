const OpenAI = require("openai");

module.exports = {
    config: { name: "ليلى" },
    run: async function({ api, event, args }) {
        const DEV_ID = "61577861540407";
        const { senderID, threadID, messageID } = event;

        if(senderID !== DEV_ID) return; // فقط للمطور

        if(!args || args.length < 2)
            return api.sendMessage("❌ الرجاء كتابة: .ليلى <الاسم> <السؤال>", threadID, messageID);

        const targetName = args.shift();
        const question = args.join(" ");

        api.sendMessage(`🦋 ليلى تفكر وتجتهد للإجابة على ${targetName}...`, threadID, messageID);

        try {
            const openai = new OpenAI({ apiKey: "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" });

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "أنت ليلى، مساعد ذكي مزخرف ASCII، لطيف، يضيف رموز وفراشات لكل رد." },
                    { role: "user", content: question }
                ]
            });

            const answer = response.choices[0].message.content;

            // زخرفة ASCII كاملة مع رموز وفراشات
            const asciiAnswer = `
🌸🦋🌸🦋🌸🦋🌸🦋🌸🦋🌸🦋🌸🦋🌸🦋
╔══════════════════════════════════╗
║ 🦋  ليلى تجيب على: ${targetName}   🦋 ║
╠══════════════════════════════════╣
║ ${answer.split('\n').map(line => `║ ${line}`).join('\n')}
╚══════════════════════════════════╝
🌸🦋🌸🦋🌸🦋🌸🦋🌸🦋🌸🦋🌸🦋🌸🦋
            `;

            api.sendMessage(asciiAnswer, threadID, messageID);

        } catch(e) {
            api.sendMessage(`💥 حصل خطأ في الذكاء الاصطناعي:\n${e.message}`, threadID, messageID);
        }
    }
};
