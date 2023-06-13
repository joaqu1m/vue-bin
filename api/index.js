const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const con4Router = require("./src/routes/con4.route")

app.use("/con4", con4Router)

app.listen(3001)