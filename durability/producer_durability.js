const amqp = require("amqplib");

async function publishAttack(data) {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const exchange = "attack_exchange";

  await ch.assertExchange(exchange, "topic", { durable: true });

  ch.publish(
    exchange,
    "attack.live",
    Buffer.from(JSON.stringify(data)),
    { persistent: true } // 🔥 VERY IMPORTANT
  );

  console.log("Attack data sent (durable)");

  setTimeout(() => conn.close(), 500);
}