const amqp = require("amqplib");

async function publishAttack() {
  try {
    const conn = await amqp.connect("amqp://localhost");
    const ch = await conn.createChannel();

    const exchange = "attack_exchange";

    // durable exchange
    await ch.assertExchange(exchange, "topic", { durable: true });

    const message = {
      attack: "DDoS",
      severity: "high",
      time: new Date().toISOString()
    };

    ch.publish(
      exchange,
      "attack.live",
      Buffer.from(JSON.stringify(message)),
      { persistent: true } // 🔥 survives restart
    );

    console.log("✅ Attack data sent:", message);

    setTimeout(() => conn.close(), 500);

  } catch (err) {
    console.error("❌ Producer error:", err);
  }
}

publishAttack();