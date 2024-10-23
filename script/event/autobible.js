const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
    name: "autobible",
    version: "1.0.0",
};

let isCronStarted = false;

module.exports.handleEvent = async function({ api }) {
    if (!isCronStarted) {
        startAutoPost(api);
        isCronStarted = true;
    }
};

module.exports.onLoad = async ({ api }) => {
    const getBibleVerse = async () => {
        try {
            const { data } = await axios.get("https://labs.bible.org/api/?passage=random&type=json");
            if (data.length > 0) {
                const { bookname, chapter, verse, text } = data[0];
                return `🔔 𝚁𝙰𝙽𝙳𝙾𝙼 𝙱𝙸𝙱𝙻𝙴𝚅𝙴𝚁𝚂𝙴:\n\n${bookname} ${chapter}:${verse} - ${text}`;
            }
        } catch (error) {
            console.error("Error fetching Bible verse:", error);
        }
        return "Sorry, an error occurred while getting the Bible verse.";
    };

    const sendMessageToThreads = async (message) => {
        if (global.db?.allThreadData) {
            const threadIDs = global.db.allThreadData.map(i => i.threadID);
            for (const threadID of threadIDs) {
                await api.sendMessage(message, threadID);
            }
        } else {
            console.warn("No thread data available.");
        }
    };

    const checkTimeAndSendMessage = async () => {
        const message = await getBibleVerse();
        await sendMessageToThreads(message);
        const nextMinute = moment().add(1, 'minute').startOf('minute').toDate();
        const delay = nextMinute - new Date();
        setTimeout(checkTimeAndSendMessage, delay);
    };

    checkTimeAndSendMessage();
};

module.exports.onStart = () => {
    console.log(`${module.exports.config.name} module started!`);
};
