const express = require("express");
const protected = require("../middlewares/protected")
const compileMood = require("../services/compile-mood")

const router = express.Router();

router.get("/statistics", protected, async (req, res) => {
    const {from, to} = req.query;

    if (!from || from === "" || !to || to === "") {
        return res.status(400).send("invalid dates")
    } 

    if (Date.parse(from) === NaN || Date.parse(to) === NaN) {
        return res.status(400).send("invalid dates")
    }

    if (Date.parse(from) > Date.parse(to)) {
        return res.status(400).send("invalid dates")
    }
    
    const statistics = await compileMood(req.user.id, from, to)
    res.status(200).send(statistics)
})

module.exports = router