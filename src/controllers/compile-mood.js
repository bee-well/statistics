const express = require("express");
const protected = require("../middlewares/protected")

const router = express.Router();

router.get("/statistics", protected, (req, res) => {
    res.send("h")
})

module.exports = router