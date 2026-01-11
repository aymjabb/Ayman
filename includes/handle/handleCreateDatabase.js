module.exports = function ({ Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");

    // 🛠️ معرف المطور الأساسي
    const MAIN_DEVELOPER = "61577861540407";

    return async function ({ event }) {
        const { allUserID, allCurrenciesID, allThreadID, userName, threadInfo } = global.data;
        const { autoCreateDB } = global.config;

        if (!autoCreateDB) return;

        let senderID = String(event.senderID);
        let threadID = String(event.threadID);

        try {
            // ╔═══📂 إنشاء قاعدة بيانات للمجموعة
            if (!allThreadID.includes(threadID) && event.isGroup) {
                const threadDataRaw = await Threads.getInfo(threadID);
                const threadDataFormatted = {
                    threadName: threadDataRaw.threadName,
                    adminIDs: threadDataRaw.adminIDs,
                    participantIDs: threadDataRaw.participantIDs,
                    isGroup: threadDataRaw.isGroup
                };

                allThreadID.push(threadID);
                threadInfo.set(threadID, threadDataFormatted);

                await Threads.setData(threadID, { threadInfo: threadDataFormatted, data: {} });

                // 🌟 إضافة كل المستخدمين الجدد في المجموعة
                for (const singleUser of threadDataRaw.userInfo) {
                    if (!singleUser.gender) continue;

                    const userIdStr = String(singleUser.id);
                    userName.set(userIdStr, singleUser.name);

                    if (!allUserID.includes(userIdStr)) {
                        await Users.createData(userIdStr, {
                            name: singleUser.name,
                            gender: singleUser.gender,
                            data: {}
                        });
                        allUserID.push(userIdStr);
                        logger(`🆕 تم إنشاء مستخدم جديد: ${singleUser.name} | ID: ${userIdStr}`, 'USER');
                    } else {
                        await Users.setData(userIdStr, { name: singleUser.name });
                    }
                }

                logger(`🗂️ تم إنشاء قاعدة بيانات للمجموعة: ${threadID}`, 'THREAD');
            }

            // ╔═══👤 إنشاء قاعدة بيانات للمستخدم
            if (!allUserID.includes(senderID) || !userName.has(senderID)) {
                const userInfo = await Users.getInfo(senderID);
                await Users.createData(senderID, {
                    name: userInfo.name,
                    gender: userInfo.gender,
                    data: {}
                });
                allUserID.push(senderID);
                userName.set(senderID, userInfo.name);

                logger(`🆕 تم إنشاء مستخدم جديد: ${userInfo.name} | ID: ${senderID}`, 'USER');
            }

            // ╔═══💰 إنشاء بيانات العملات
            if (!allCurrenciesID.includes(senderID)) {
                await Currencies.createData(senderID, { data: {} });
                allCurrenciesID.push(senderID);
            }

            // ╔═══🔮 تمييزك كمطور
            if (senderID === MAIN_DEVELOPER) {
                // هنا يمكن إضافة أي صلاحيات خاصة أو دمج OpenAI مستقبلًا
                // مثال: يمكن تفعيل أوامر Dev أو التحكم بالذكاء الاصطناعي
                event.isDeveloper = true;
            }

        } catch (err) {
            console.log(`💥 خطأ في إنشاء قاعدة البيانات: ${err.message}`);
        }
    };
};
