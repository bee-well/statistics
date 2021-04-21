const mongoose = require("mongoose")

const mood = new mongoose.Schema({
    user: Number,
    mood: Number,
    tags: [
        {type: String}
    ],
    reported: Date
})

const config = {
    model: null
}

const createModel = () => {
    if (!config.model) {
        config.model = mongoose.model("Mood", mood)
    }
    return config.model
}

module.exports = createModel
module.exports.config = config