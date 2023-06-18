const controller = require("../controllers/con4.controller")

module.exports = (io, socket, userId) => {
    socket.on("disconnect", () => {
        const deletedServers = controller.leaveServer(userId)
        if (deletedServers.length > 0) io.emit("con4:SERVER_DELETED", deletedServers.map(sv => sv.server.id))
    })
    socket.on("con4:CREATE_SERVER", payload => {
        const sv = controller.createServer(payload.serverName, payload.maxPlayers)
        
        io.emit("con4:SERVER_CREATED", {
            serverId: sv.server.id,
            serverName: sv.server.name,
            userId: userId,
            playerCount: sv.players.length+1,
            playerMax: sv.server.max,
            dateCreated: sv.server.dateCreated
        })
    })
    socket.on("con4:CONNECT_SERVER", payload => {
        const svId = payload.serverId
        if (controller.checkServerAvaliability(svId, false)) {
            const sv = controller.joinServer(svId, userId, payload.userName)
            socket.join(svId)
            
            io.to(svId).emit("con4:SERVER_CONNECTED", controller.procurarPorServerId(svId))
            if (!controller.checkServerAvaliability(svId, true)) io.emit("con4:SERVER_DELETED", [svId])
        }
    })
}