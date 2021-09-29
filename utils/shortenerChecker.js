const fs = require('fs')
const { tall } = require('tall')
const logger = require('../modules/logger.js')
const yaml = require('js-yaml')

let shorteners = {}
// load in the settings file to use the 
try {
    let settings = fs.readFileSync('settings/shorteners.yaml', 'utf8');
    shorteners = yaml.load(settings);
} catch (e) {
    logger.log(e, "error");
}

const isShortened = async (message) => {
    const shorUrls = shorteners.domains
    // temporary use an ugly bunch of conditionals 
    // for each additional shortener (there aren't THAT many out there)
    for (const url of shorUrls) {
        console.log('short', url)
        if (message.toLowerCase().includes(`https://${url}`)) {
            console.log('message', message)
            const lengthened = await urlLengthen(message)
            return lengthened
        }
    }
}

const urlLengthen = async (shortUrl) => {
    try {
        logger.log(shortUrl, "log")
        return await tall(`${shortUrl}`)
    }
    catch (err) {
        logger.log(err, "error")
        return
    }
}

exports.urlLengthen = urlLengthen;
exports.isShortened = isShortened;