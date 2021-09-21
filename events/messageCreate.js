const logger = require('../modules/logger.js')
const records = require('../utils/records.js')
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
   
   // if the message includes the key we are looking for 
   const isYoutube = await messageChecker.isYoutube(message)
   const messageAuthor = await messageChecker.setupAuthor(message)
   const messageInfo = await messageChecker.setupMessage(message, isYoutube)
   const data = await records.cacheGet(isYoutube);

   const newFind = await queries.find(isYoutube)

   console.log('newfind', JSON.stringify(newFind))

   const newData = await queries.insert(messageInfo, messageAuthor)
   console.log(newData)

   // If we saw youtube command, but key is not found in db, store it, silent
   if (isYoutube) {
      if (!data && messageAuthor) {
         console.log("not found in db, store it")
         const data = await records.cacheSet(isYoutube, messageAuthor)
      }
      // key is found in db
      else if (data) {
         console.log("found in db")
         // check to see if the guildID matches our guildID from the message
         // if not, this is new in this guild, so no repost.
         // else, its a repost
         // console.log('before parse', data)
         // console.log('json stringify', JSON.stringify(data))
         // console.log('json parse', JSON.parse(JSON.stringify(data)))
         let dataToJson = JSON.parse(data);
         // let dataStringify = JSON.stringify(data);
         // console.log('dataStringify', dataStringify)
         let reply = '';
         console.log(dataToJson)
         console.log(data.length)
         for (let i = 0; i <= data.length; i++) {
            console.log('looping', i)
            // If an entry matches guildId, we found it
            /// what if we have more than one match in the loop? integrity issue, spammy reply
            if (dataToJson.guildId === message.guildId) {
               console.log("we matched on guild")
               reply = `:regional_indicator_r: :regional_indicator_e: :regional_indicator_p: :regional_indicator_o: :regional_indicator_s: :regional_indicator_t:`;
               reply += `\n\`\`This was posted by ${dataToJson[i].username}#${dataToJson[i].discriminator}\`\`\nhttps://discord.com/channels/${dataToJson[i].guildId}/${dataToJson[i].channelId}/${dataToJson[i].messageId}`;
               message.channel.send(reply);
               await message.react("🇷");
               await message.react("🇪");
               await message.react("🇵");
               await message.react("🇴");
               await message.react("🇸");
               await message.react("🇹");
               await message.react("👎");
            }
            // key is found, however guildID was not. Therefore we have not seen this message
            // in this server before. Insert it.
            else {
               console.log("we see this key, but not this guild. appending")
               const data = await records.appendCacheSet(isYoutube, messageAuthor)
            }
         }
      }
   }

};