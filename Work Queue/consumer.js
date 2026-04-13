const amqp = require("amqplib");

async function startWorker(name) {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const queue = "work_queue";

  await ch.assertQueue(queue, { durable: true });

  // 🔥 IMPORTANT: fair dispatch
  ch.prefetch(1);

  console.log(`👷 Worker ${name} waiting for jobs...`);

  ch.consume(queue, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    console.log(`⚙️ Worker ${name} processing:`, data);

    // simulate work
    await new Promise(res => setTimeout(res, 2000));

    console.log(`✅ Worker ${name} done:`, data);

    ch.ack(msg);

  }, { noAck: false });
}

// run multiple workers
startWorker("A");