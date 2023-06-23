const controller = require("../controllers/con4.controller")

module.exports = (io, socket, userId) => {
    socket.on("disconnect", () => {
        // const sv = controller.getServerByUserId(userId)
        // console.log(sv)
        // if (sv) io.emit("con4:SESSION", { serverId: sv.serverId, tipoReq: "disconnect", userId: userId })
        const deletedServers = controller.leaveServer(userId)
        if (deletedServers.length > 0) io.emit("con4:SERVER_DELETED", deletedServers.map(sv => sv.server.id))
    })
    socket.on("con4:CREATE_SERVER", payload => {
        const sv = controller.createServer(payload.serverName, payload.maxPlayers, payload.password)
        
        io.emit("con4:SERVER_CREATED", {
            serverId: sv.server.id,
            serverName: sv.server.name,
            userId: userId,
            playerCount: sv.players.length+1,
            playerMax: sv.server.max,
            dateCreated: sv.server.dateCreated,
            hasPassword: sv.server.password != ""
        })
    })
    socket.on("con4:SESSION", payload => {
        const svId = payload.serverId
        switch (payload.tipoReq) {
            case "connect":
                if (controller.checkServerAvaliability(svId, false)) {
                    controller.joinServer(svId, userId, payload.userName)
                    socket.join(svId)
                    
                    controller.serverExists(svId)
                    ? io.to(svId).emit("con4:SESSION_RES", { tipoReq: "connect", info: controller.procurarPorServerId(svId) })
                    : io.to(svId).emit("con4:SESSION_RES", { tipoReq: "unavailable" })
                    if (!controller.checkServerAvaliability(svId, true)) io.emit("con4:SERVER_DELETED", [svId])
                }
                break
            // case "disconnect":
            //     io.to(svId).emit("con4:SESSION_RES", { tipoReq: "disconnect", userId: payload.userId })
            //     break
            case "start":
                if (!controller.serverExists(svId)) {
                    io.to(svId).emit("con4:SESSION_RES", { tipoReq: "unavailable" })
                    return
                }
                const serv = controller.procurarPorServerId(svId)
                io.to(svId).emit("con4:SESSION_RES", { tipoReq: "start", info: serv[Math.floor(Math.random() * serv.length)].id })
                break
            case "round":

                if (!controller.serverExists(svId)) {
                    io.to(svId).emit("con4:SESSION_RES", { tipoReq: "unavailable" })
                    return
                }
                let server = controller.procurarPorServerId(svId)
                server = server.filter(p => p.id !== userId)
                const userEscolhido = server[Math.floor(Math.random() * server.length)]
                if (!userEscolhido) {
                    io.to(svId).emit("con4:SESSION_RES", { tipoReq: "unavailable" })
                    return
                }
                io.to(svId).emit("con4:SESSION_RES", {
                    tipoReq: "round",
                    responsavel: userId,
                    nomeResponsavel: payload.userName,
                    pos: payload.pos,
                    proximo: {
                        userId: userEscolhido.id,
                        userName: userEscolhido.name
                    }
                })
                break
            case "end":

                if (!controller.serverExists(svId)) {
                    io.to(svId).emit("con4:SESSION_RES", { tipoReq: "unavailable" })
                    return
                }

                controller.leaveServer(userId)
                socket.leave(svId)
                break
        }
    })
}