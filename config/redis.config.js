const { createClient } = require("redis");

let client;
let isConnected = false;

const initRedis = async () => {
    if (client && isConnected) return client; // prevent reconnecting if already connected

    client = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
        socket: {
            reconnectStrategy: (retries) => {
                if (retries > 10) {
                    console.error("❌ Redis reconnect limit reached, giving up.");
                    return new Error("Retry limit reached");
                }
                console.warn(`⚠️ Redis reconnecting... attempt ${retries}`);
                return Math.min(retries * 200, 2000); // delay between retries (ms)
            },
        },
    });

    // Connection event listeners
    client.on("connect", () => console.log("✅ Redis connected successfully"));
    client.on("ready", () => {
        isConnected = true;
        console.log("🚀 Redis client ready to use");
    });
    client.on("end", () => {
        isConnected = false;
        console.warn("⚠️ Redis connection closed");
    });
    client.on("error", (err) => {
        console.error("❌ Redis error:", err.message);
    });

    await client.connect();
    return client;
};

const getClient = () => {
    if (!client || !isConnected) {
        throw new Error("Redis client is not connected. Call initRedis() first.");
    }
    return client;
};

module.exports = { initRedis, getClient };
