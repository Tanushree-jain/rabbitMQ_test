const amqp = require("amqplib");

async function sendMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "my_queue";

  await channel.assertQueue(queue, { durable: false });

  const message = "Hello RabbitMQ 🚀";

  channel.sendToQueue(queue, Buffer.from(message));

  console.log("Message sent:", message);

  setTimeout(() => {
    connection.close();
  }, 500);
}

sendMessage();