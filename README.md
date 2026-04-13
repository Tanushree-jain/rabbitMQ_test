# 🐇 RabbitMQ with Node.js — Complete Learning Guide

This repository demonstrates a **progressive, real-world learning path** for RabbitMQ using Node.js, covering everything from basic messaging to production-grade patterns.

---

# 📌 Overview

This project covers:

* Basic Queue (1 → 1)
* Topic Exchange (1 → many, MQTT-style)
* Durable Messaging (no data loss)
* Acknowledgements (ACK/NACK)
* Dead Letter Queue (DLQ)
* Work Queues (Competing Consumers)

---

# ⚙️ Setup

## 1. Run RabbitMQ using Docker

```bash
docker run -d --hostname rabbit-host \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

## 2. Access Dashboard

```
http://localhost:15672
```

```
username: guest  
password: guest
```

---

## 3. Install Dependencies

```bash
npm init -y
npm install amqplib
```

---

# 🧠 Concepts Covered

---

## 🔹 1. Basic Queue (1 → 1)

* One producer → one consumer
* Each message processed by **only one consumer**

---

## 🔹 2. Topic Exchange (MQTT-style)

### Pattern:

```
Producer → Exchange → Multiple Queues → Consumers
```

### Example Routing Keys:

```
order.created
order.updated
order.*
order.#
```

### Use Case:

* Real-time dashboards
* Event broadcasting

---

## 🔹 3. Durable Messaging

Ensures **no message loss on restart**

### Requirements:

* Durable Exchange
* Durable Queue
* Persistent Messages

```js
{ durable: true }
{ persistent: true }
```

---

## 🔹 4. ACK / NACK

### ACK:

```js
ch.ack(msg);
```

→ Message successfully processed

### NACK:

```js
ch.nack(msg, false, false);
```

→ Reject message without retry

---

## ⚠️ Important:

Avoid:

```js
noAck: true
```

in production (can cause message loss)

---

## 🔹 5. Dead Letter Queue (DLQ)

Handles failed messages safely.

### Flow:

```
Main Queue → ❌ Fail → DLX → DLQ
```

### Configuration:

```js
arguments: {
  "x-dead-letter-exchange": "dlx_exchange",
  "x-dead-letter-routing-key": "dlq_key"
}
```

### Use Cases:

* Debugging failed messages
* Retry systems
* Error tracking

---

## 🔹 6. Work Queues (Competing Consumers)

### Pattern:

```
Producer → Queue → Worker A / Worker B / Worker C
```

* Each message goes to **only one worker**
* Used for **parallel processing**

---

### Prefetch (Important)

```js
ch.prefetch(1);
```

→ Ensures fair load distribution

---

# 🔥 Key Learnings

* RabbitMQ uses **Exchange + Queue architecture**
* Exchange = routing
* Queue = storage & delivery
* Consumers pull from queues

---

# ⚡ Topic vs Work Queue

| Feature  | Topic Exchange | Work Queue        |
| -------- | -------------- | ----------------- |
| Delivery | One → Many     | One → One         |
| Queues   | Multiple       | Single            |
| Use case | Broadcast      | Load distribution |

---

# 🚨 Common Issues Faced

### 1. Queue already exists error

```
PRECONDITION_FAILED
```

✔ Fix: Delete queue or use new name

---

### 2. JSON parse errors

✔ Cause: Invalid message format
✔ Fix: Send proper JSON

---

### 3. Infinite retry loop

✔ Cause: nack with requeue
✔ Fix:

```js
ch.nack(msg, false, false);
```

---

### 4. Messages not received

✔ Ensure:

* Consumer started first
* Binding exists
* Correct routing key

