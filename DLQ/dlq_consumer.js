const amqp = require("amqplib");

async function readDLQ() {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const queue = "attack_dlq";

  await ch.assertQueue(queue, { durable: true });

  console.log("💀 DLQ consumer listening...");

  ch.consume(queue, (msg) => {
    if (!msg) return;

    console.log("💀 Dead message received:", msg.content.toString());

    ch.ack(msg);
  });
}

readDLQ();