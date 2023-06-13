module.exports = (io, socket) => {
    socket.on("con4:ENVIAR_TESTE", payload => {
        io.emit("con4:TESTE", payload)
    })
}