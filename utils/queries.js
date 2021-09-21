const {Pool} = require('pg')
const log = require('../modules/logger.js')
const yaml = require('js-yaml');
const fs   = require('fs');

let data = {}
try {
    let secrets = fs.readFileSync('secrets.yaml', 'utf8');
    data = yaml.load(secrets);
} catch (e) {
    log.log(e, "error");
}
const pool = new Pool({
        user: data.postgres.username,
        host: data.postgres.hostname,
        password: data.postgres.password,
        port: data.postgres.port
})

/**
 * Insert into the database
 * @param {Object} author information about the author
 */
const insert = async (author) => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const insertMessages = 'INSERT INTO messages(user_id, username, discriminator, message_id, channel_id, guild_id, youtube_key) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
        const insertMessagesVals = [author.userId, author.username, author.discriminator, author.messageId, author.channelId, author.guildId, author.youtubeKey]
        await client.query(insertMessages, insertMessagesVals)

        await client.query('COMMIT')
    } catch(err) {
        log.log(err.message, "error")
    } finally {
        client.release()
    }
};

/**
 * Finds the database entry
 * @param {Object} author information about the author
 * @returns If exists, returns the database entry.
 */
const find = async (author) => {
    const client = await pool.connect()
    const select = `SELECT * 
                    FROM messages m
                    WHERE m.guild_id = '${author.guildId}'
                    AND m.user_id = '${author.userId}'
                    AND LOWER(m.youtube_key) = LOWER('${author.youtubeKey}')`

    
    try {
        const res = await client.query(select)
        return res.rows[0]
    } catch (err)  {
        log.log(err.message, "error")
    }
};
exports.find = find;
exports.insert = insert;