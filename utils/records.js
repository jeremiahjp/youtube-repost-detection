
const { promisify } = require('util');
const redis = require('redis');
const client = redis.createClient()

/* Promisfy so we can have promise base functionality */
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const setAppendAsync = promisify(client.append).bind(client);
const setexAsync = promisify(client.setex).bind(client);
const ttlAsync = promisify(client.ttl).bind(client);

/**
* Writes strigify data to cache
* @param {string} key key for the cache entry
* @param {*} value any object/string/number 
*/
const cacheSet = async (key, value) => {
    return await setAsync(key, JSON.stringify(value));
};

/**
* Append strigify data to cache
* @param {string} key key for the cache entry
* @param {*} value any object/string/number 
*/
const appendCacheSet = async (key, value) => {
    let a = []
    a.push(value)
    return await setAppendAsync(key, a);
};

/**   
 * Retrieves data for a given key
 * @param {string} key key of the cached entry 
 */
const cacheGet = async (key) => {
    const data = await getAsync(key);

    // console.log(data)
    return JSON.parse(data);
};

exports.cacheSet = cacheSet;
exports.cacheGet = cacheGet;
exports.appendCacheSet = appendCacheSet;

    