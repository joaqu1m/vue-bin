const express = require("express")
const cors = require("cors")
const app = express()
app.use(express.json())
//app.use(cors("http://localhost:3000"))
app.use(cors())

const routes = {
    con4: require("./src/routes/con4.route"),
    fisherman: require("./src/routes/fisherman.route")
}
const sockets = {
    con4: require("./src/socket/con4.socket"),
    fisherman: require("./src/socket/fisherman.socket")
}

app.use("/con4", routes.con4)
app.use("/con4", routes.fisherman)

const io = require("socket.io")(app.listen(3001), {
    cors: {
        origin: "http://10.18.6.155:3000",
        methods: "*"
    }
})

io.on("connection", socket => {
    const userId = socket.conn.id

    sockets.con4(io, socket, userId)
    sockets.fisherman(io, socket, userId)
})