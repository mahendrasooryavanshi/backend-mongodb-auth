require("./config/database.config")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser")
const AuthRouter = require("./router/auth.router")
const { initRedis } = require("./config/redis.config")


app.use(bodyParser.json())

app.use("/api/v1", AuthRouter)
app.use("/api/v1", require("./router/post.router"))



app.get("/", (req, res) => {
    console.log("base url is working....")
    res.send({
        message: "Base-url is working fine...."
    })
})

// Initialize Redis once at startup
initRedis()
    .then(() => console.log("Redis ready for use"))
    .catch((err) => console.error("Redis init failed:", err));

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    });
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error("Error stack:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Server is working at http://localhost:${PORT}`)
})