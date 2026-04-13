const amqp = require("amqplib");

async function sendJobs() {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const queue = "work_queue";

  await ch.assertQueue(queue, { durable: true });

  for (let i = 1; i <= 10; i++) {
    const msg = { jobId: i };

    ch.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(msg)),
      { persistent: true }
    );

    console.log("📤 Sent job:", msg);
  }

  setTimeout(() => conn.close(), 500);
}

sendJobs();