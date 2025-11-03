const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser")
const AuthRouter = require("./router/auth.router")
app.use(bodyParser.json())
app.use("/api/v1", AuthRouter)
app.get("/", (req, res) => {
    console.log("base url is working....")
    res.send({
        message: "Base-url is working fine...."
    })
})

app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Server is working at http://localhost:${PORT}`)
})