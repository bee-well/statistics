const amqp = require("amqplib")

const publish = async (queue, msg) => {
    const connection = await amqp.connect(process.env.MQ_CONNECTION_URL)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)
    channel.sendToQueue(queue, Buffer.from(msg))
}

const subscribe = async (queue, handler) => {
    const connection = await amqp.connect(process.env.MQ_CONNECTION_URL)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)
    channel.consume(queue, async msg => {
        await handler(JSON.parse(msg.content.toString()))
        channel.ack(msg)
    })
}

module.exports.publish = publish
module.exports.subscribe = subscribe