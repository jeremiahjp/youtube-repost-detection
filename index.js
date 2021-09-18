const {Client, Intents} = require("discord.js");

const secret = require('./secrets.json')
const Enmap = require("enmap");
const { readdirSync } = require("fs");
const logger = require("./modules/logger.js");
const { intents } = require("./config.js")

const client = new Client({ intents })

const settings = require("./settings.js") // Settings for prefix, and other info

// We also need to make sure we're attaching the settings to the CLIENT so it's accessible everywhere!
client.settings = settings;


// This loop reads the /events/ folder and attaches each event file to the appropriate event.
const init = async () => {
  
    // Then we load events, which will include our message and ready event.
    const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
      const eventName = file.split(".")[0];
      logger.log(`Loading Event: ${eventName}. 👌`, "log");
      const event = require(`./events/${file}`);
      // Bind the client to any event, before the existing arguments
      // provided by the discord.js event. 
      // This line is awesome by the way. Just sayin'.
      client.on(eventName, event.bind(null, client));
    }  
  
    // Threads are currently in BETA.
    // This event will fire when a thread is created, if you want to expand
    // the logic, throw this in it's own event file like the rest.
    client.on("threadCreate", (thread) => thread.join());
  
    // Here we login the client.

    client.login(secret.client_secret);
    logger.log(`Running bot on ` + new Date().toString());
  
  // End top-level async/await function.
};
  
init();