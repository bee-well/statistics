const express = require("express")
const cors = require("cors")
const amqp = require("amqplib")

const compileMoodRouter = require("./controllers/compile-mood")
const onMoodReported = require("./controllers/on-mood-reported")

const app = express()
app.use(cors())

// Set up routes
app.use(compileMoodRouter)

// Set up event handlers
const connectMq = async () => {
    let i
    while (i < 3) {
        try {
            const connection = await amqp.connect(process.env.MQ_CONNECTION_URL)
            const channel = await connection.createChannel()
            await channel.assertQueue("moods")
            await channel.consume("moods", onMoodReported)
            break
        } catch (err) {
            console.log(err)
            if (i == 2) {
                process.exit(1)
            }
            await new Promise((res, _) => setTimeout(res, 5000))
        }
    }
}

connectMq()

app.set('port', process.env.PORT || 8082)

module.exports = app