const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/auth-service-db"
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            maxPoolSize: 20,         // important for concurrent requests
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ MongoDB connected");


    } catch (err) {
        console.error("❌ DB Connection Failed:", err);
        process.exit(1);
    }
};

connectDB();


// const mongoose = require("mongoose");

// const connectWithRetry = async (retries, delay, options) => {
//     for (let i = 1; i <= retries; i++) {
//         try {
//             await mongoose.connect(process.env.MONGO_URI, options);
//             console.log("✅ MongoDB connected successfully");
//             return;
//         } catch (err) {
//             console.error(`❌ MongoDB connection failed (attempt ${i}): ${err.message}`);
//             if (i < retries) {
//                 console.log(`🔁 Retrying in ${delay / 1000} seconds...`);
//                 await new Promise((resolve) => setTimeout(resolve, delay));
//             } else {
//                 console.error("🚨 All retry attempts failed. Exiting process...");
//                 process.exit(1);
//             }
//         }
//     }
// };

// const connectDB = async () => {
//     const options = {
//         maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE) || 50,
//         minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE) || 5,
//         serverSelectionTimeoutMS: 5000, // Time to find a server
//         socketTimeoutMS: 45000, // Time before closing inactive sockets
//         connectTimeoutMS: 10000,
//         family: 4,
//         retryWrites: true,
//         w: "majority",
//         readPreference: process.env.MONGO_READ_PREFERENCE || "primary",
//         autoIndex: process.env.NODE_ENV !== "production",
//         // Ensures faster failover to a secondary
//         heartbeatFrequencyMS: 5000,
//     };

//     mongoose.connection.on("connected", () => {
//         console.log(`✅ Connected to MongoDB Replica Set`);
//     });

//     mongoose.connection.on("disconnected", () => {
//         console.warn("⚠️ MongoDB disconnected");
//     });

//     mongoose.connection.on("reconnected", () => {
//         console.log("🔄 MongoDB reconnected");
//     });

//     mongoose.connection.on("error", (err) => {
//         console.error("❌ MongoDB Error:", err.message);
//     });

//     process.on("SIGINT", async () => {
//         await mongoose.connection.close();
//         console.log("🔒 MongoDB connection closed due to app termination");
//         process.exit(0);
//     });

//     await connectWithRetry(
//         parseInt(process.env.MONGO_RETRY_ATTEMPTS) || 5,
//         parseInt(process.env.MONGO_RETRY_DELAY_MS) || 3000,
//         options
//     );
// };

// module.exports = connectDB;
