const amqp = require("amqplib");

async function startDashboard() {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const exchange = "attack_exchange";
  const queue = "attack_queue";

  await ch.assertExchange(exchange, "topic", { durable: true });

  await ch.assertQueue(queue, { durable: true });

  await ch.bindQueue(queue, exchange, "attack.live");

  console.log("Dashboard listening (durable)...");

  ch.consume(queue, (msg) => {
    try {
      const data = JSON.parse(msg.content.toString());

      console.log("Processing attack:", data);

      // simulate processing
      // send to frontend / websocket

      ch.ack(msg); // ✅ message safely processed

    } catch (err) {
      console.error("Error processing message");

      ch.nack(msg); // 🔥 requeue message
    }
  }, { noAck: false });
}

startDashboard();