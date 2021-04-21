const app = require("./app")
const mongoose = require("mongoose")
const mood = require("./domain/mood")

const MQ_CONNECTION_TRIES = 3

const start = async () => {
    let i
    while (i < MQ_CONNECTION_TRIES) {
        try {
            const connection = await amqp.connect(process.env.MQ_CONNECTION_URL)
            const channel = await connection.createChannel()
            await channel.assertQueue("moods")
            await channel.consume("moods", onMoodReported)
            break
        } catch (err) {
            if (i == MQ_CONNECTION_TRIES-1) {
                process.exit(1)
            }
            await new Promise((res, _) => setTimeout(res, 5000))
        }
    }

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

    if (process.env.APP_ENVIRONMENT !== "prod") await insertDummyData()
 
    app.listen(app.get("port"), () => {
        console.log(`server is listening on port ${app.get("port")}`)
    })
}

const insertDummyData = async () => {
    const m1 = new mood({
        user: 123,
        mood: 5,
        tags: [
            "happy",
            "euphoric",
            "exhausted"
        ],
        reported: new Date(2016, 04, 15)
    })
    await m1.save()

    const m2 = new mood({
        user: 123,
        mood: 1,
        tags: [
            "sleepy",
            "happy",
            "angry",
            "exhausted",
        ],
        reported: new Date(2016, 04, 14)
    })
    await m2.save()
}

start()