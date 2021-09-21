const { Client } = require("discord.js");
const { readdirSync } = require("fs");
const logger = require("./modules/logger.js")
const { intents } = require("./config.js")
const client = new Client({ intents })
const yaml = require('js-yaml');
const fs = require('fs');

let data = {}
try {
    let secrets = fs.readFileSync('secrets.yaml', 'utf8');
    data = yaml.load(secrets);
} catch (e) {
    log.log(e, "error");
}


const init = async () => {

    const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
      const eventName = file.split(".")[0];
      logger.log(`Loading Event: ${eventName}. 👌`, "log");
      const event = require(`./events/${file}`);
      client.on(eventName, event.bind(null, client));
    }

    client.on("threadCreate", (thread) => thread.join());
    client.login(data.client.secret);
    logger.log(`Running bot on ` + new Date().toString());
};

init();