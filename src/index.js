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
 
    app.listen(app.get("port"), () => {
        console.log(`server is listening on port ${app.get("port")}`)
    })
}

start()