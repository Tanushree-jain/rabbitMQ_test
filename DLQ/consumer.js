const amqp = require("amqplib");

async function startConsumer() {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const exchange = "attack_exchange";
  const queue = "attack_queue";

  const dlxExchange = "dlx_exchange";
  const dlq = "attack_dlq";

  // 🔥 1. DLX setup
  await ch.assertExchange(dlxExchange, "direct", { durable: true });
  await ch.assertQueue(dlq, { durable: true });
  await ch.bindQueue(dlq, dlxExchange, "dlq_key");

  // 🔥 2. Main exchange
  await ch.assertExchange(exchange, "topic", { durable: true });

  // 🔥 3. Main queue WITH DLQ config
  await ch.assertQueue(queue, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": dlxExchange,
      "x-dead-letter-routing-key": "dlq_key"
    }
  });

  await ch.bindQueue(queue, exchange, "attack.live");

  console.log("📡 Main consumer listening...");

  ch.consume(queue, (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      console.log("✅ Processed:", data);

      ch.ack(msg);

    } catch (err) {
      console.error("❌ Failed → sending to DLQ:", msg.content.toString());

      // ❗ send to DLQ
      ch.nack(msg, false, false);
    }

  }, { noAck: false });
}

startConsumer();