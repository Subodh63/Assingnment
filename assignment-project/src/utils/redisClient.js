const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis error:', err));
client.on('connect', () => console.log('Connected to Redis'));

(async () => {
  if (!client.isOpen) {
    await client.connect();
  }
})();

console.log("About to call redisClient.get");

module.exports = client;