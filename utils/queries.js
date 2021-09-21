const postgres = require('postgres')
const {Pool} = require('pg')
const log = require('../modules/logger.js')

const pool = new Pool({
        user: "postgres",
        host: "localhost",
        password: "",
        port: "5432"
})

// const settings = require('settings'


const insert = async (message, author) => {
    log.log(JSON.stringify(author), 'error')
    log.log(JSON.stringify(message), 'log')
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        
        const usersIns = 'INSERT INTO users(user_id, username, discriminator) VALUES($1, $2, $3) RETURNING user_id'
        const values = [author.id, author.username, author.discriminator]
        const user = await client.query(usersIns, values)

        const inserGuilds = 'INSERT INTO guilds(guild_id) VALUES($1) RETURNING guild_id'
        const insertGuildValues = [message.guildId]
        const guild = await client.query(inserGuilds, insertGuildValues)

        const insertMessages = 'INSERT INTO messages(message_id, user_id, channel_id, guild_id, youtube_id) VALUES($1, $2, $3, $4, $5) RETURNING *'
        const insertMessagesVals = [message.messageId, user.rows[0].user_id, message.channelId, guild.rows[0].guild_id, message.context]
        await client.query(insertMessages, insertMessagesVals)

        await client.query('COMMIT')
    } catch(err) {
        log.log(err.message, "error")
    } finally {
        client.release()
    }
};


const find = async (key) => {
    const client = await pool.connect()
    const select = `SELECT * 
                    FROM messages m
                    JOIN guilds g
                    on m.guild_id = g.guild_id
                    JOIN users u
                    ON u.user_id = m.user_id
                    WHERE LOWER(m.youtube_id) = LOWER('${key}')`

    return await client.query(select).rows
};
exports.find = find;
exports.insert = insert;