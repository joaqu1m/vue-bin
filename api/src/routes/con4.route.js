const express = require("express")
const router = express.Router()

const db = require("../models/con4.model")

const perfis = db.perfis

router.get("/", (req, res) => {
    res.statusCode = 200
    res.send(perfis)
})

router.post("/", (req, res) => {
    res.statusCode = 201
    perfis.push("perfil"+(perfis.length+1))
    res.send("Perfil criado com sucesso!")
})

module.exports = router