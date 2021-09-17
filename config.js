const { Intents } = require("discord.js");

const config = {
    // Bot Admins, level 9 by default. Array of user ID strings.
    "admins": [],

    // Bot Support, level 8 by default. Array of user ID strings
    "support": [],

    // Intents the bot needs.
    // By default GuideBot needs Guilds, Guild Messages and Direct Messages to work.
    // For join messages to work you need Guild Members, which is privileged and requires extra setup.
    // For more info about intents see the README.
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES ]
    // Partials your bot may need should go here, CHANNEL is required for DM's
    //   partials: ["CHANNEL"]
}
module.exports = config;