module.exports.run = async function({ api, event, Users }) {
  const { threadID, messageID, senderID, mentions } = event;
  if (!Object.keys(mentions).length) 
    return api.sendMessage("😹 منشن شخص عشان تحضنه!", threadID, messageID);

  const targetID = Object.keys(mentions)[0];

  // ترتيب جديد: المرسل هو الحاضن دائماً
  const nameSender = await Users.getNameUser(senderID);
  const nameTarget = await Users.getNameUser(targetID);

  // الآن المرسل هو 'two' أي على الجانب الذي يمثل الحاضن
  const imagePath = await makeImage({ one: targetID, two: senderID, nameOne: nameTarget, nameTwo: nameSender });

  return api.sendMessage({
    body: `🥰 حضن أنمي دافئ لك ولـ ${nameTarget} 🐱😺`,
    attachment: fs.createReadStream(imagePath)
  }, threadID, () => fs.unlinkSync(imagePath), messageID);
};
