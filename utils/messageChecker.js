
const settings = require('../settings.js')
const logger = require('../modules/logger.js')
const messageTemplate = require('../templates/message.js')
const author = require('../templates/author.js')
// const { MessageActionRow } = require('discord.js')
const bitlyChecker = require('./shortenerChecker.js')

const TYPE_LONG = settings.ytMatch[0]
const TYPE_SHORT = settings.ytMatch[1]
const SLASH = '/'
const SPACE =' '
const WATCH_PARAM = 'watch?v='
const YOUTU_BE = "youtu.be/"
const NUM_OF_CHARS_IN_KEY = 11
const YOUTUBE_SHORT_SPLIT_INDEX = 3
const YOUTUBE_LONG_SPLIT_INDEX = 1

const setupAuthor = async (message, youtubeKey) => {
    let authorInfo = author.User
    authorInfo.userId = message.author.id
    authorInfo.username = message.author.username
    authorInfo.discriminator = message.author.discriminator
    authorInfo.channelId = message.channelId
    authorInfo.messageId = message.id
    authorInfo.guildId = message.guildId,
    authorInfo.youtubeKey = youtubeKey
    return authorInfo
 }

 const setupMessage = async (message, context) => {
    let messageInfo = messageTemplate.Message
    messageInfo.channelId = message.channelId
    messageInfo.messageId = message.id
    messageInfo.guildId = message.guildId
    messageInfo.context = context
    return messageInfo
 }

const extractKey = async (message) => {

    const isShortened =  await bitlyChecker.isShortened(message);
    // console.log(isShortened)

    
    let splitMessage = message.content.split(SPACE)
    // console.log('splitMessage', splitMessage)
    let youtubeKey = ''
    // loop through the message, split by space and look for youtube key
    for (const word of splitMessage) {
        let found = false
        // compare word with each element in our ytMatch array 
        if (settings.ytMatch.some(key => {
            // we matched in the message, continue on
            if (word.includes(key)) {
                // we matched on TYPE_LONG
                if (key.toLocaleLowerCase() === TYPE_LONG.toLocaleLowerCase()) {
                    logger.log("Matched TYPE_LONG", 'log')
                    // console.log('word split:' ,word.split(WATCH_PARAM))
                    youtubeKey = word.split(WATCH_PARAM)[YOUTUBE_LONG_SPLIT_INDEX].substring(0,NUM_OF_CHARS_IN_KEY)
                    logger.log(`youtubeKey: ${youtubeKey}`, 'log')
                }
                // we matched on TYPE_SHORT
                else if (key.toLocaleLowerCase() === TYPE_SHORT.toLocaleLowerCase()) {
                    logger.log("Matched TYPE_SHORT", 'log')
                    youtubeKey = word.split(SLASH)[YOUTUBE_SHORT_SPLIT_INDEX].substring(0,NUM_OF_CHARS_IN_KEY)
                    // return true
                }
                logger.log(youtubeKey, 'warn')
            }
        }));
        if (found)
            break
    }
    return youtubeKey
}

module.exports.extractKey = extractKey;
module.exports.setupAuthor = setupAuthor;
module.exports.setupMessage = setupMessage;