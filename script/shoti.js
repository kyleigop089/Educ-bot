const axios = require("axios");
const request = require("request");
const fs = require("fs");

module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  credits: "Kylepogi",
  description: "Generate random tiktok girl videos",
  hasPermssion: 0,
  commandCategory: "other",
  usage: "[shoti]",
  cooldowns: 20,
  dependencies: [],
  usePrefix: false,
};

module.exports.handleEvent = async function ({ api, event }) {

   if (!(event.body.indexOf("shoti") === 0 || event.body.indexOf("Shoti") === 0)) return; 


    try {
     api.setMessageReaction("🔄", event.messageID, (err) => {}, true);


    const response = await axios.get("https://shoti-srv2.onlitegix.com/api/v1/request-f");

      const file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
      const userInfo = response.data.data.user;
                    const username = userInfo.username || "undefined";
                    const nickname = userInfo.nickname || "undefined";
const title = response.data.data.title || "undefined";



      const rqs = request(encodeURI(response.data.data.url));
      rqs.pipe(file);

      file.on("finish", async () => {

      api.setMessageReaction("🟢", event.messageID, (err) => {}, true);


        await api.sendMessage(
          {
            body: `Username: @${username}\nNickname: ${nickname}\nTitle: ${title}`,
            attachment: fs.createReadStream(__dirname + "/cache/shoti.mp4"),
          },
          event.threadID,
          event.messageID
        );
      });

      file.on("error", (err) => {
        api.sendMessage(`Shoti Error: ${err}`, event.threadID, event.messageID);
      });
    } catch (error) {
     api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
    }
  };
module.exports.run = async function ({ api, event }) {
   api.sendMessage(`sending shoti😍`, event.threadID, event.messageID);

};
