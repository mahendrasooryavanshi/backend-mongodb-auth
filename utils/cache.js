const { getClient } = require("../config/redis.config");

const Cache = {
    async get(key) {
        try {
            const client = getClient();
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Redis GET error:", error.message);
            return null; // fail-safe (don’t crash app)
        }
    },

    async set(key, value, ttl = 60) {
        try {
            const client = getClient();
            await client.set(key, JSON.stringify(value), { EX: ttl });
            return true;
        } catch (error) {
            console.error("Redis SET error:", error.message);
            return false;
        }
    },

    async del(key) {
        try {
            const client = getClient();
            await client.del(key);
            return true;
        } catch (error) {
            console.error("Redis DEL error:", error.message);
            return false;
        }
    },

    async flushAll() {
        try {
            const client = getClient();
            await client.flushAll();
            console.log("🧹 Redis cache cleared");
        } catch (error) {
            console.error("Redis flushAll error:", error.message);
        }
    },
};

module.exports = Cache;
