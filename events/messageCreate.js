const log = require('../modules/logger.js')
const messageChecker = require('../utils/messageChecker.js')
const queries = require('../utils/queries.js')

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
   const ytKey = await messageChecker.extractKey(message)
   const messageAuthor = await messageChecker.setupAuthor(message, ytKey)

   // If we saw youtube command, but key is not found in db, store it, silent
   if (ytKey) {
      const found = await queries.find(messageAuthor)
      if (!found && messageAuthor) {
         log.log('not found in db, insert', 'log')
         await queries.insert(messageAuthor)
      }
      // key is found in db
      else if (found) {
         log.log('found in db', 'log')
         if (found.guild_id === message.guildId) {
            let reply = `:regional_indicator_r: :regional_indicator_e: :regional_indicator_p: :regional_indicator_o: :regional_indicator_s: :regional_indicator_t:`;
            reply += `\n\`\`This was posted by ${found.username}#${found.discriminator}\`\`\nhttps://discord.com/channels/${found.guild_id}/${found.channel_id}/${found.message_id}`;
            message.channel.send(reply);
            await message.react("🇷");
            await message.react("🇪");
            await message.react("🇵");
            await message.react("🇴");
            await message.react("🇸");
            await message.react("🇹");
            await message.react("👎");
         }
         // else its not from the same guild, so insert
         else {
            log.log("YT key found in db, but not in this guild. Inserting.", 'info')
            await queries.insert(messageInfo, messageAuthor)
         }
      }
   }

};