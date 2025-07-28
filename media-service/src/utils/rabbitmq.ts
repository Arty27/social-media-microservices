import amqp, { Channel } from "amqplib";
import { logger } from "./logger";

let connection = null;
let channel: Channel | null = null;
const EXCHANGE_NAME = "social_events";

async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI!);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
    logger.info("Connected to RabbitMQ");
    return channel;
  } catch (error) {
    logger.error("Error connecting to rabbit mq", error);
  }
}

export const publishEvent = async (routingKey: string, message: any) => {
  if (!channel) {
    await connectToRabbitMQ();
  }
  channel?.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(`Event published:${routingKey}`);
};

export const consumeEvent = async (routingKey: string, callback: any) => {
  if (!channel) {
    await connectToRabbitMQ();
  }
  const q = await channel?.assertQueue("", { exclusive: true });
  await channel?.bindQueue(q?.queue, EXCHANGE_NAME, routingKey);
  channel?.consume(q?.queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel?.ack(msg);
    }
  });
  logger.info(`Subscribed to event ${routingKey}`);
};

export default connectToRabbitMQ;
