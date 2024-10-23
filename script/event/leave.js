const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');

module.exports.config = {
    name: "leave",
    version: "1.0.0",
    credits: "kylepogi",
    eventType: ["log:unsubscribe"],
    description: "Left notification",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.logMessageType === "log:subscribe") {
        const addedParticipants = event.logMessageData.addedParticipants;
        const senderID = addedParticipants[0].userFbId;
        let name = await api.getUserInfo(senderID).then(info => info[senderID]?.name || senderID);

        // Truncate name if it's too long
        const maxLength = 15; // Reduce length to ensure better fit
        if (name.length > maxLength) {
            name = name.substring(0, maxLength - 3) + '...';
        }

        // Additional functionality can be added here
    }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
    if (event.logMessageData.leftParticipantFbId === api.getCurrentUserID()) return;

    const { threadID } = event;
    const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
    const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
    const type = (event.author === event.logMessageData.leftParticipantFbId) ? "Left the Group... " : "\nKicked by Administrator.";
    const membersCount = await api.getThreadInfo(threadID).then(info => info.participantIDs.length);

    let msg = `Administrator removed ${name} from the group. There are now ${membersCount} members in the group.`;

    const link = ["https://i.imgur.com/dVw3IRx.gif"];
    const randomLink = link[Math.floor(Math.random() * link.length)];
    const gifPath = path.join(__dirname, "cache", "randomly.gif");

    const callback = () => {
        api.sendMessage({ body: msg, attachment: fs.createReadStream(gifPath) }, threadID, () => fs.unlinkSync(gifPath));
    };

    request(encodeURI(randomLink))
        .pipe(fs.createWriteStream(gifPath))
        .on("close", callback)
        .on("error", (err) => {
            console.error("Error downloading GIF:", err);
        });
};
