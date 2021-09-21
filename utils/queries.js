// const postgres = require('postgres')
const {Pool} = require('pg')
const log = require('../modules/logger.js')

const pool = new Pool({
        user: "postgres",
        host: "localhost",
        password: "Polkm123!",
        port: "5432"
})

// const settings = require('settings'


const insert = async (message, author) => {
    log.log(JSON.stringify(author), 'error')
    log.log(JSON.stringify(message), 'log')
    const client = await pool.connect()

    // if the same user posts a link in different discord servers
    // that is not a dupe. 
    //further, we cannot insert into the users because that user exists previously
    // 
    try {
        await client.query('BEGIN')
        console.log('author', author)
        const insertMessages = 'INSERT INTO messages(user_id, message_id, channel_id, guild_id, youtube_key) VALUES($1, $2, $3, $4, $5) RETURNING *'
        const insertMessagesVals = [author.userId, author.messageId, author.channelId, author.guildId, author.youtubeKey]
        await client.query(insertMessages, insertMessagesVals)

        await client.query('COMMIT')
    } catch(err) {
        log.log(err.message, "error")
    } finally {
        client.release()
    }
};


const find = async (author) => {
    const client = await pool.connect()
    const select = `SELECT * 
                    FROM messages m
                    WHERE m.guild_id = ${author.guildId}
                    AND m.user_id = ${author.userId}
                    AND LOWER(m.youtube_id) = LOWER('${author.youtubeKey}')`

    
    const res = await client.query(select)
    return res.rows[0]
};
exports.find = find;
exports.insert = insert;