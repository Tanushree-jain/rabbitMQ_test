const amqp = require("amqplib");

async function start() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "order_topic_exchange";

  await channel.assertExchange(exchange, "topic", { durable: false });

  const events = [
    { key: "order.created", msg: "Order Created" },
    { key: "order.updated", msg: "Order Updated" },
    { key: "order.payment.failed", msg: "Payment Failed" },
  ];

  for (let event of events) {
    channel.publish(exchange, event.key, Buffer.from(event.msg));
    console.log(`Sent: ${event.key} -> ${event.msg}`);
  }

  setTimeout(() => connection.close(), 500);
}

start();