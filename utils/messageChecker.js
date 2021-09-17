
const settings = require('../settings.js')
const logger = require('../modules/logger.js')
const author = require('../templates/author.js')

const TYPE_LONG = settings.ytMatch[0]
const TYPE_SHORT = settings.ytMatch[1]
const TYPE_SHORT_KEY_INDEX = 3;
const TYPE_LONG_KEY_INDEX = 3;
const SLASH = '/'
const WATCH_PARAM = 'watch?v='
const NUM_OF_CHARS_IN_KEY = 11

const setupAuthor = async (message) => {
    let authorInfo = author.User
    authorInfo.id = message.author.id
    authorInfo.username = message.author.username
    authorInfo.discriminator = message.author.discriminator
    authorInfo.channelId = message.channelId
    authorInfo.messageId = message.id
    authorInfo.guildId = message.guildId
    return authorInfo
 }

const isYoutube = async (message) => {
    let splitMessage = message.content.split(SLASH)
    let youtubeKey = ''
    if (settings.ytMatch.some(key => {
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

module.exports.isYoutube = isYoutube;
module.exports.setupAuthor = setupAuthor;