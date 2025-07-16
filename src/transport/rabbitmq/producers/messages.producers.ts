import { envVariables } from "@src/config";
import amqplib, { Channel } from "amqplib";

export class ProducerMessagesRabbitMQ {
    constructor() {
        this.Init();
    }
    channel: Channel;

    async Init() {
        try {
            const connection = await amqplib.connect(envVariables.RABBITMQ_URI);
            this.channel = await connection.createChannel();
            await this.channel.assertExchange("messages", "direct", {
                durable: true,
            });
        } catch (error) {
            console.log(error);
        }
    }
    public async PublishInMessages(
        routingKey: string,
        content: string,
    ): Promise<void> {
        await this.channel.publish(
            "messages",
            routingKey,
            Buffer.from(content),
        );
    }
}
