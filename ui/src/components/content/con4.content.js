const translate = require("./main.content")

const texts = [
    {
        lang: "en",
        body: [
            "Connect-4",
            "Choose a game mode",
            "Create a server",
            "Search for a server",
            "Type a nickname to continue",
            "Continue",
            "Insert your server password",
            "Keep blank to make it public",
            "Done",
            (param) => `${param}'s server`,
            "Solo",
            "Local",
            "Online",
            (param) => `${param} won!`,
            "Return to home",
            "Nickname",
            "Start Game",
            "Players:"
        ]
    },
    {
        lang: "pt",
        body: [
            "Ligue-4",
            "Escolha um modo de jogo",
            "Criar seu servidor",
            "Pesquise por um servidor",
            "Escolha um nickname para continuar",
            "Avançar",
            "Insira a senha do seu servidor",
            "Deixe vazio para que seja público",
            "Pronto",
            (param) => `Servidor de ${param}`,
            "Solo",
            "Local",
            "Online",
            (param) => `${param} venceu!`,
            "Retornar ao início",
            "Nickname",
            "Iniciar jogo",
            "Jogadores:"
        ]
    },
    {
        lang: "pt-BR",
        body: [
            "Ligue-4",
            "Escolha um modo de jogo",
            "Criar seu servidor",
            "Pesquise por um servidor",
            "Escolha um nickname para continuar",
            "Avançar",
            "Insira a senha do seu servidor",
            "Deixe vazio para que seja público",
            "Pronto",
            (param) => `Servidor de ${param}`,
            "Solo",
            "Local",
            "Online",
            (param) => `${param} venceu!`,
            "Retornar ao início",
            "Nickname",
            "Iniciar jogo",
            "Jogadores:"
        ]
    }

]

const con4language = (userLangArray) => translate.default(texts, userLangArray)

export default con4language