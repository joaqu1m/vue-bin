const express = require("express")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors())

const routes = {
    con4: require("./src/routes/con4.route"),
    fisherman: require("./src/routes/fisherman.route"),
    globe: require("./src/routes/globe.route")
}
const sockets = {
    con4: require("./src/socket/con4.socket"),
    fisherman: require("./src/socket/fisherman.socket"),
    globe: require("./src/socket/globe.socket")
}

app.use("/con4", routes.con4)
app.use("/fisherman", routes.fisherman)
app.use("/globe", routes.globe)

const io = require("socket.io")(app.listen(3001), {
    cors: {
        origin: "http://localhost:3000",
        methods: "*"
    }
})

io.on("connection", socket => {
    const userId = socket.conn.id

    sockets.con4(io, socket, userId)
    sockets.fisherman(io, socket, userId)
    sockets.globe(io, socket, userId)
})