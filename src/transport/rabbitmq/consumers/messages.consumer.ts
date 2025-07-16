import { envVariables } from "@src/config";
import { IMessagesService } from "@src/domain";
import { log } from "@src/helpers";
import amqplib, { Channel } from "amqplib";

export class ConsumerMessagesRabbitMQ {
    constructor() {
        this.Init();
    }
    channel: Channel;

    async Init() {
        try {
            const connection = await amqplib.connect(envVariables.RABBITMQ_URI);
            this.channel = await connection.createChannel();
            await this.channel.assertQueue("message.new.queue", {
                durable: true,
            });
            await this.channel.assertQueue("message.read.queue", {
                durable: true,
            });

            await this.channel.bindQueue(
                "message.new.queue",
                "messages",
                "message.new",
            );
            await this.channel.bindQueue(
                "message.read.queue",
                "messages",
                "message.read",
            );
        } catch (error) {
            console.log(error);
        }
    }
    public setupMessagesConsumers(service: IMessagesService) {
        this.channel.consume("message.new.queue", async (msg) => {
            if (msg) {
                try {
                    await service.handleNewMessage(
                        JSON.parse(msg.content.toString()),
                    );
                    this.channel.ack(msg);
                } catch (err) {
                    log.error("Failed to process message.new:", err);
                    this.channel.nack(msg, false, false);
                }
            }
        });

        this.channel.consume("message.read.queue", async (msg) => {
            if (msg) {
                try {
                    await service.handleReadReceipt(
                        JSON.parse(msg.content.toString()),
                    );
                    this.channel.ack(msg);
                } catch (err) {
                    log.error("Failed to process message.read:", err);
                    this.channel.nack(msg, false, false);
                }
            }
        });
    }
}
