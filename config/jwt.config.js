module.exports = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "supersecretkey123",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "refreshsecretkey123",
    ACCESS_TOKEN_EXPIRES_IN: "8h",
    REFRESH_TOKEN_EXPIRES_IN: "7d"
}