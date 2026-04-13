const amqp = require("amqplib");

async function receiveMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "my_queue";

  await channel.assertQueue(queue, { durable: false });

  console.log("Waiting for messages...");

  channel.consume(queue, (msg) => {
    console.log("Received:", msg.content.toString());
  }, {
    noAck: true
  });
}

receiveMessage();