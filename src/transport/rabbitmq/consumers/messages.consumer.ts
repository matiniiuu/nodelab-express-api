import { envVariables } from "@src/config";
import { IAutoMessagesService, IMessagesService } from "@src/domain";
import { log } from "@src/helpers";
import amqplib, { Channel } from "amqplib";

export class ConsumerMessagesRabbitMQ {
    channel: Channel;

    async Init(
        messagesService: IMessagesService,
        autoMessagesService: IAutoMessagesService,
    ) {
        try {
            const connection = await amqplib.connect(envVariables.RABBITMQ_URI);
            this.channel = await connection.createChannel();
            await this.channel.assertQueue("message.new.queue", {
                durable: true,
            });
            await this.channel.assertQueue("message.read.queue", {
                durable: true,
            });
            await this.channel.assertQueue("message.auto-message.queue", {
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
            await this.channel.bindQueue(
                "message.auto-message.queue",
                "messages",
                "message.auto-message",
            );
            this.setupMessagesConsumers(messagesService, autoMessagesService);
        } catch (error) {
            console.log(error);
        }
    }
    private setupMessagesConsumers(
        messagesService: IMessagesService,
        autoMessagesService: IAutoMessagesService,
    ) {
        this.channel.consume("message.new.queue", async (msg) => {
            if (msg) {
                try {
                    await messagesService.handleNewMessage(
                        JSON.parse(msg.content.toString()),
                    );
                    this.channel.ack(msg);
                } catch (err) {
                    log.error("Failed to process message.new:", err);
                    this.channel.nack(msg, false, true);
                }
            }
        });

        this.channel.consume("message.read.queue", async (msg) => {
            if (msg) {
                try {
                    await messagesService.handleReadReceipt(
                        JSON.parse(msg.content.toString()),
                    );
                    this.channel.ack(msg);
                } catch (err) {
                    log.error("Failed to process message.read:", err);
                    this.channel.nack(msg, false, true);
                }
            }
        });

        this.channel.consume("message.auto-message.queue", async (msg) => {
            if (msg) {
                try {
                    await autoMessagesService.handleAutoMessageSend(
                        JSON.parse(msg.content.toString()),
                    );
                    this.channel.ack(msg);
                } catch (err) {
                    log.error("Failed to process message.new:", err);
                    this.channel.nack(msg, false, true);
                }
            }
        });
    }
}
