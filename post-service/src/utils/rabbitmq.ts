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

export default connectToRabbitMQ;
