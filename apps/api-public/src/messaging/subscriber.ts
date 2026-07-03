import amqplib from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EVENTS_EXCHANGE = "pulse-fx.events";
const QUEUE_NAME = "api-public.indicator-events";

export async function startIndicatorEventsSubscriber() {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EVENTS_EXCHANGE, "topic", { durable: true });
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(QUEUE_NAME, EVENTS_EXCHANGE, "indicator.updated");

  await channel.consume(QUEUE_NAME, (msg) => {
    if (!msg) {
      return;
    }

    try {
      const payload = JSON.parse(msg.content.toString()) as { indicatorCode: string };

      console.log(`[messaging] cache invalidado para ${payload.indicatorCode}`);
      channel.ack(msg);
    } catch (err) {
      console.error("[messaging] erro ao processar evento:", err);
      channel.nack(msg, false, false);
    }
  });

  console.log("[messaging] inscrito em indicator.updated");
}
