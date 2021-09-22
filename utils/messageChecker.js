
const settings = require('../settings.js')
const logger = require('../modules/logger.js')
const messageTemplate = require('../templates/message.js')
const author = require('../templates/author.js')
// const { MessageActionRow } = require('discord.js')
const bitlyChecker = require('./shortenerChecker.js')

const TYPE_LONG = settings.ytMatch[0]
const TYPE_SHORT = settings.ytMatch[1]
const TYPE_SHORT_KEY_INDEX = 3;
const TYPE_LONG_KEY_INDEX = 3;
const SLASH = '/'
const WATCH_PARAM = 'watch?v='
const NUM_OF_CHARS_IN_KEY = 11

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
    console.log(isShortened)

    
    let splitMessage = message.content.split(SLASH)
    console.log('splitMessage', splitMessage)
    let youtubeKey = ''
    if (settings.ytMatch.some(key => {
        console.log(key)
        // we matched in the message, continue on
        if (message.content.includes(key)) {
            // we matched on TYPE_LONG
            if (key.toLocaleLowerCase() === TYPE_LONG.toLocaleLowerCase()) {
                logger.log("Matched TYPE_LONG")
                youtubeKey = splitMessage[TYPE_LONG_KEY_INDEX].split(WATCH_PARAM)[1].substring(0,NUM_OF_CHARS_IN_KEY)
            }
            // we matched on TYPE_SHORT
            else if (key.toLocaleLowerCase() === TYPE_SHORT.toLocaleLowerCase()) {
                logger.log("Matched TYPE_SHORT")
                youtubeKey = splitMessage[TYPE_SHORT_KEY_INDEX].substring(0,NUM_OF_CHARS_IN_KEY)
            }
            logger.log(youtubeKey)
        };
    }));
    return youtubeKey
}

module.exports.extractKey = extractKey;
module.exports.setupAuthor = setupAuthor;
module.exports.setupMessage = setupMessage;