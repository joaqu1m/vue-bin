let serverIdCount = 0

const localDB = {
    serverList: []
}
// [{
//     server: {
//         id: 0,
//         name: "Servidor 1",
//         max: 2,
//         dateCreated: Date
//     },
//     players: [
//         {
//             id: userId,
//             name: "Jogador 1"
//         }
//     ]
// }]

const findAll = () => {
    return {
        statusCode: 200,
        send: localDB
    }
}

const getServerlist = () => {
    const avaliableSvList = []
    for(let i = 0; i < localDB.serverList.length; i++) {
        const sv = localDB.serverList[i]
        if (sv.players.length < sv.server.max && sv.players.length > 0) {
            avaliableSvList.push({
                serverId: sv.server.id,
                serverName: sv.server.name,
                playerCount: sv.players.length,
                playerMax: sv.server.max,
                dateCreated: sv.server.dateCreated,
                hasPassword: sv.server.password != ""
            })
        }
    }
    return {
        statusCode: 200,
        send: avaliableSvList
    }
}

const getServerByUserId = (userId) => {
    for (let i = 0; i < localDB.serverList.length; i++) {
        const sv = localDB.serverList[i]
        for (let j = 0; j < sv.players.length; j++) {
            const player = sv.players[j]
            if (player.id == userId) {
                return {
                    serverId: sv.server.id,
                    serverName: sv.server.name,
                    playerCount: sv.players.length,
                    playerMax: sv.server.max,
                    dateCreated: sv.server.dateCreated,
                    hasPassword: sv.server.password != ""
                }
            }
        }
    }
}

const checkServerAvaliability = (serverId, validarZero) => {
    for(let i = 0; i < localDB.serverList.length; i++) {
        const sv = localDB.serverList[i]
        if (sv.server.id == serverId) {
            return sv.players.length < sv.server.max && (validarZero ? sv.players.length > 0 : true)
        }
    }
    return false
}

const createServer = (serverName, maxPlayers, password) => {
    
    serverIdCount++

    const newServer = {
        server: {
            id: serverIdCount,
            name: serverName,
            max: maxPlayers,
            dateCreated: new Date(),
            password
        },
        players: []
    }

    localDB.serverList.push(newServer)

    return newServer
}

const joinServer = (serverId, userId, userName) => {
    for(let i = 0; i < localDB.serverList.length; i++) {
        const sv = localDB.serverList[i]
        if (sv.server.id == serverId) {
            sv.players.push({
                id: userId,
                name: userName
            })
            return sv
        }
    }
}

const leaveServer = (userId) => {
    const serverIds = []
    for(let i = 0; i < localDB.serverList.length; i++) {
        let foiEncontrado = false
        localDB.serverList[i].players = localDB.serverList[i].players.filter(p => {
            if (p.id == userId) {
                return false
            }
            foiEncontrado = true
            return true
        })
        if (foiEncontrado) serverIds.push(localDB.serverList[i].server.id)
    }
    return checkDeleteableServers()
}

const checkDeleteableServers = () => {
    const deletedServers = []
    localDB.serverList = localDB.serverList.filter(sv => {
        if (sv.players.length == 0) {
            deletedServers.push(sv)
            return false
        } else return true
    })
    return deletedServers
}

const procurarPorServerId = (serverId) => {
    const server = localDB.serverList.filter(sv => sv.server.id = serverId)
    return server[0].players
}

const serverExists = (serverId) => {
    for(let i = 0; i < localDB.serverList.length; i++) {
        const sv = localDB.serverList[i]
        if (sv.server.id == serverId) {
            return true
        }
    }
    return false
}

module.exports = {
    findAll,
    getServerlist,
    checkServerAvaliability,
    createServer,
    joinServer,
    leaveServer,
    checkDeleteableServers,
    procurarPorServerId,
    serverExists,
    getServerByUserId
}