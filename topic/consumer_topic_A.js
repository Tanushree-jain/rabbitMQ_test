const amqp = require("amqplib");

async function start() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "order_topic_exchange";

  await channel.assertExchange(exchange, "topic", { durable: false });

  const q = await channel.assertQueue("", { exclusive: true });

  // listen to ALL order events
  channel.bindQueue(q.queue, exchange, "order.#");

  console.log("Consumer A waiting for messages...");

  channel.consume(q.queue, (msg) => {
    console.log("Consumer A received:", msg.content.toString());
  }, { noAck: true });
}

start();