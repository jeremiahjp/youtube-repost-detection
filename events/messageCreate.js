const logger = require('../modules/logger.js')
const records = require('../utils/records.js')
const messageChecker = require('../utils/messageChecker.js')

module.exports = async (client, message) => {

   // Ignore all bots
   if (message.author.bot) 
      return;

	/* types of YT Urls
       https://www.youtube.com/watch?v=abcdefghijk
       https://youtu.be/abcdefghijk
       https://www.youtube.com/watch?v=abcdefghijk&feature=youtu.be
       https://www.youtube.com/watch?time_continue=113&v=abcdefghijk
       https://youtu.be/abcdefghijk?t=91
   */
   
   // if the message includes the key we are looking for 
   const isYoutube = await messageChecker.isYoutube(message)
   const messageAuthor = await messageChecker.setupAuthor(message)
   const data = await records.cacheGet(isYoutube);

   // If we saw youtube command, but it is not found in db, store it, silent
   if (isYoutube) {
      if (!data && messageAuthor) {
         const data = await records.cacheSet(isYoutube, messageAuthor)
      }
      else if (data) {
         let reply = `:regional_indicator_r: :regional_indicator_e: :regional_indicator_p: :regional_indicator_o: :regional_indicator_s: :regional_indicator_t:`;
         reply += `\n\`\`This was posted by ${data.username}#${data.discriminator}\`\`\nhttps://discord.com/channels/${data.guildId}/${data.channelId}/${data.messageId}`;
         await message.react("🇷");
         await message.react("🇪");
         await message.react("🇵");
         await message.react("🇴");
         await message.react("🇸");
         await message.react("🇹");
         await message.react("👎");
         return message.channel.send(reply);
      }
   }

};