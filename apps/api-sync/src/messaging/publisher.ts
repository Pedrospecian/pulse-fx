import amqplib, { type Channel, type ChannelModel } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
export const EVENTS_EXCHANGE = "pulse-fx.events";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

async function getChannel(): Promise<Channel> {
  if (channel) return channel;
  connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EVENTS_EXCHANGE, "topic", { durable: true });
  return channel;
}

// Publicado após persistir novas observações de um indicador.
export async function publishIndicatorUpdated(indicatorCode: string, latestDate: Date) {
  const ch = await getChannel();
  ch.publish(
    EVENTS_EXCHANGE,
    "indicator.updated",
    Buffer.from(JSON.stringify({ indicatorCode, latestDate })),
    { contentType: "application/json", persistent: true }
  );
}
