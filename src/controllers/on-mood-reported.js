const createMoodDao = require("../domain/mood")

const onMoodReported = async msg => {
    const mood = createMoodDao()
    if (msg.type === "created") {
        const m = new mood({
            user: msg.payload.user,
            mood: msg.payload.mood,
            reported: new Date(msg.payload.reported).setHours(0,0,0),
            tags: msg.payload.tags
        })
        await m.save()
    }
}

module.exports = onMoodReported;