const amqp = require("amqplib");

async function publishMessages() {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const exchange = "attack_exchange";

  await ch.assertExchange(exchange, "topic", { durable: true });

  // ✅ valid message
  ch.publish(
    exchange,
    "attack.live",
    Buffer.from(JSON.stringify({ attack: "DDoS", severity: "high" })),
    { persistent: true }
  );

  // ❌ invalid message (to trigger DLQ)
  ch.publish(
    exchange,
    "attack.live",
    Buffer.from("INVALID_JSON"),
    { persistent: true }
  );

  console.log("✅ Sent valid + invalid messages");

  setTimeout(() => conn.close(), 500);
}

publishMessages();