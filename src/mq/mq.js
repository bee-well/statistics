const amqp = require("amqplib")

const connect = async () => {
    for(let i =0; i < 3; i++) {
        try{
        const connection = await amqp.connect(process.env.MQ_CONNECTION_URL)
            return connection;
    } catch{
        await new Promise((resolve, _) => setTimeout(resolve, 5000))
    }}
    process.exit(1)
}

const publish = async (queue, msg) => {
    const connection = await connect()
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)
    channel.sendToQueue(queue, Buffer.from(msg))
}

const subscribe = async (queue, handler) => {
    const connection = await connect()
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)
    channel.consume(queue, async msg => {
        await handler(JSON.parse(msg.content.toString()))
        channel.ack(msg)
    })
}

module.exports.publish = publish
module.exports.subscribe = subscribe