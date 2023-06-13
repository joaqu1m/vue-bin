const express = require("express")
const router = express.Router()

const controller = require("../controllers/con4.controller")

router.get("/", (req, res) => {
    const response = controller.getMensagens()
    res.statusCode = response.statusCode
    res.send(response.send)
})

module.exports = router