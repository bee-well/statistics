const app = require("./app")
const mongoose = require("mongoose")
const {subscribe} = require("./mq/mq")
const onMoodReported = require("./controllers/on-mood-reported")

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
 
    app.listen(app.get("port"), () => {
        console.log(`server is listening on port ${app.get("port")}`)
    })
}

start()