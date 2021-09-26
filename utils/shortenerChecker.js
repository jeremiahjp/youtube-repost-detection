const { tall } = require('tall')
const log = require('../modules/logger.js')
const settings = require('../settings.js')


const isShortened = async (message) => {

    const SLASH = '/'
    let splitMessage = message.content.split(SLASH)
    let shortenedUrl = ''
    let lengthened = ''
    // we check through the list of shorteners
    if (settings.shorteners.some(key => {
        // if we match on one of the shortener keys
        if (message.content.includes(key)) {
            let splitUrl = splitMessage[TYPE_LONG_KEY_INDEX].split(key)[1]
            // console.log(key)
            // console.log(message)
            return urlLengthen(`https://${key}/${splitUrl}`)
        }
    }));

        // we have a shortened url, now lengthen it
        // lengthened = urlLengthen(message)
    //     return urlLengthen(message))
    // })
}

const urlLengthen = (shortUrl) => {
    tall(`${shortUrl}`)
    .then(lengthenedUrl => {
        return lengthenedUrl
    })
    .catch(err => log.log(err, "log"))
}

exports.urlLengthen = urlLengthen;
exports.isShortened = isShortened;