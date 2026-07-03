import amqplib, { type Channel, type ChannelModel } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
export const EVENTS_EXCHANGE = "pulse-fx.events";

let connection: ChannelModel;
let channel: Channel;

async function getChannel(): Promise<Channel> {
  connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EVENTS_EXCHANGE, "topic", { durable: true });
  return channel;
}

export async function publishIndicatorUpdated(indicatorCode: string, latestDate: Date) {
  const ch = await getChannel();
  ch.publish(
    EVENTS_EXCHANGE,
    "indicator.updated",
    Buffer.from(JSON.stringify({ indicatorCode, latestDate })),
    { contentType: "application/json", persistent: true }
  );
}
