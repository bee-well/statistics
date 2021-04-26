const app = require("./app")
const mongoose = require("mongoose")
const {subscribe} = require("./mq/mq")
const onMoodReported = require("./controllers/on-mood-reported")
const createMoodDao = require("./domain/mood")

const start = async () => {
    await subscribe("moods", onMoodReported)
    try {
        await mongoose.connect(
            process.env.MONGO_CONNECTION_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            }
        )
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
    await insertDummyData()
    app.listen(app.get("port"), () => {
        console.log(`server is listening on port ${app.get("port")}`)
    })
}

start()

const insertDummyData = async () => {
    const mood = createMoodDao()
    const m1 = new mood({ mood: 4, reported: new Date("2016-04-12"), tags: ["happy"], user: 1 })
    const m2 = new mood({ mood: 1, reported: new Date("2016-04-13"), tags: ["sad", "stressed"], user: 1 })
    const m3 = new mood({ mood: 2, reported: new Date("2016-04-14"), tags: ["anxious"], user: 1 })
    const m4 = new mood({ mood: 5, reported: new Date("2016-04-15"), tags: ["happy"], user: 1 })
  
    await m1.save()
    await m2.save()
    await m3.save()
    await m4.save()
  }