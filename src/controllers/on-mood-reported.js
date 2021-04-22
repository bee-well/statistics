const createMoodDao = require("../domain/mood")

const onMoodReported = async msg => {
    console.log("MOOOOOOD", msg)
    const mood = createMoodDao()
    if (msg.type === "created") {
        const m = new mood({
            mood: msg.payload.mood,
            reported: msg.payload.reported,
            tags: msg.payload.tags
        })
        await m.save()
    }
}

module.exports = onMoodReported;