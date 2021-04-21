const mongoose = require("mongoose")

const mood = new mongoose.Schema({
    user: Number,
    mood: Number,
    tags: [
        {type: String}
    ],
    reported: Date
})

module.exports = mongoose.model("Mood", mood)