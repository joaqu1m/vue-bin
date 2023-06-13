const localDB = {
    perfis: []
}

const getMensagens = () => {
    return {
        statusCode: 200,
        send: localDB.perfis
    }
}

const postMensagem = () => {
    localDB.perfis.push("perfil"+(localDB.perfis.length+1))
    return {
        statusCode: 201,
        send: "Perfil criado com sucesso!"
    }
}

module.exports = {
    getMensagens: getMensagens,
    postMensagem: postMensagem
}