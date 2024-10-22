const moment = require('moment-timezone');
const axios = require('axios');

module.exports.config = {
    name: "autobible",
    version: "1.0.0",
    role: 0,
    credits: "kylepogi",
    description: "Get a random Bible verse.",
    hasPrefix: false,
    aliases: ["bibleverse", "randombibbleverse"],
    usage: "Bibleverse",
    cooldown: 5,
};

module.exports.onLoad = async ({ api, getLang, utils }) => {
  const getBibleVerse = async () => {
    try {
      const response = await axios.get("https://labs.bible.org/api/?passage=random&type=json");

      if (response.status === 200 && response.data.length > 0) {
        const verse = response.data[0];
        return `🔔 𝚁𝙰𝙽𝙳𝙾𝙼 𝙱𝙸𝙱𝙻𝙴𝚅𝙴𝚁𝚂𝙴:\n\n${verse.bookname} ${verse.chapter}:${verse.verse} - ${verse.text}`;
      } else {
        return "Sorry, an error occurred while getting the Bible verse.";
      }
    } catch (error) {
      console.error("Error fetching Bible verse:", error);
      return "Sorry, an error occurred while getting the Bible verse.";
    }
  };

  const checkTimeAndSendMessage = async () => {
    const now = moment().tz('Asia/Manila');
    const currentTime = now.format('HH:mm:ss'); // 24-hour format for consistency

    // Get the Bible verse message
    const message = await getBibleVerse();

    // Get all thread IDs
    if (global.db && global.db.allThreadData) {
      const threadIDs = global.db.allThreadData.map(i => i.threadID);
      threadIDs.forEach(threadID => {
        api.sendMessage(message, threadID);
      });
    } else {
      console.warn("No thread data available.");
    }

    // Schedule the next check
    const nextMinute = moment().add(1, 'minute').startOf('minute');
    const delay = nextMinute.diff(moment());
    setTimeout(checkTimeAndSendMessage, delay);
  };

  checkTimeAndSendMessage();
};

module.exports.onStart = () => {
  console.log(`${module.exports.config.name} module started!`);
};
