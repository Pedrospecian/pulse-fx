import amqplib, { type Channel, type ChannelModel } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EXCHANGE = "app.events"; // exchange do tipo "topic" compartilhada por todos os serviços

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export async function getChannel(): Promise<Channel> {
  if (channel) return channel;

  connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });

  return channel;
}

/**
 * Publica um evento no exchange compartilhado.
 * routingKey ex.: "user.created", "user.updated"
 */
export async function publishEvent(routingKey: string, payload: unknown) {
  const ch = await getChannel();
  ch.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(payload)), {
    contentType: "application/json",
    persistent: true,
  });
}

/**
 * Assina um conjunto de routing keys (ex.: "order.*") em uma fila própria
 * deste serviço, permitindo reagir a eventos de outros microsserviços.
 */
export async function subscribe(
  queueName: string,
  routingKeys: string[],
  handler: (routingKey: string, payload: unknown) => Promise<void> | void
) {
  const ch = await getChannel();
  await ch.assertQueue(queueName, { durable: true });

  for (const key of routingKeys) {
    await ch.bindQueue(queueName, EXCHANGE, key);
  }

  await ch.consume(queueName, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      await handler(msg.fields.routingKey, payload);
      ch.ack(msg);
    } catch (err) {
      console.error("Erro ao processar mensagem:", err);
      ch.nack(msg, false, false); // descarta / envia para DLQ se configurada
    }
  });
}
