/* import amqplib from "amqplib";
import type { Options } from "amqplib/callback_api";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(__dirname, "../../../.env.local"),
});

const config = {
    host: "127.0.0.1",
    port: 5672,
    user: process.env.RABBITMQ_DEFAULT_USER as string,
    password: process.env.RABBITMQ_DEFAULT_PASS as string,
    vhost: "peepup_broker",
};

// const url = `amqp://${config.user}:${config.password}@${config.host}:${config.port}/${config.vhost}`;

const amqpConfig: Options.Connect = {
    protocol: "amqp",
    hostname: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
    vhost: config.vhost,
    heartbeat: 60,
};

const amqpConfig2: Options.Connect = {
    protocol: "amqp",
    hostname: config.host,
    port: config.port,
    username: "impersonator",
    password: "impersonator",
    vhost: config.vhost,
    heartbeat: 60,
};

const queue = "product_inventory";
const queue1 = "test_queue";
const text = [
    {
        item_id: "macbook",
        text: "This is a sample message to send receiver to check the ordered Item Availablility",
    },
    {
        item_id: "iphone",
        text: "This is a sample message to send receiver to check the ordered Item Availablility",
    },
];

async function producer() {
    let connection;
    try {
        connection = await amqplib.connect(amqpConfig);
        const channel = await connection.createChannel();

        await channel.assertExchange("logs", "fanout", { durable: false });

        const publishOpts: Options.Publish = {
            deliveryMode: true,
            messageId: randomUUID(),
            timestamp: Date.now(),
            persistent: true,
            contentType: "application/json",
        };

        channel.publish("logs", "", Buffer.from(JSON.stringify(text)), publishOpts);

        console.log({
            on: "producer",
            sendToQueue: queue1,
            content: text,
        });

        await channel.close();
    } catch (err) {
        console.warn(err);
    } finally {
        if (connection) {
            connection.close();
        }
    }
}

async function consumer() {
    try {
        const connection = await amqplib.connect(amqpConfig2);
        const channel = await connection.createChannel();

        channel.prefetch(1);

        process.once("SIGINT", async (err: unknown) => {
            if (err) {
                console.log("Error: ", err);
            }
            await channel.close();
            await connection.close();
        });

        const exchange = await channel.assertExchange("logs", "fanout", {
            durable: false,
        });
        const queue = await channel.assertQueue("", { exclusive: true });

        console.log({ exchange, queue });

        channel.bindQueue(queue.queue, exchange.exchange, "");

        channel.consume(
            queue.queue,
            (message) => {
                if (message) {
                    console.log({
                        on: "consumer",
                        receiveFromQueue: queue.queue,
                        content: JSON.parse(message.content.toString()),
                    });
                    console.log(message);
                    channel.ack(message);
                }
            },
            { noAck: true }
        );

        const queues = await channel.checkQueue(queue);
        console.log({ queues });

        await channel.assertQueue(queue1, {
            durable: true,
        }); 

        const data = await channel.consume(
            queue,
            (message) => {
                return message;
            },
            { noAck: false, consumerTag: "amq.ctag-kyBCy-l348O5IcgWajK5iQ" }
        );
        console.log({ data }); 

        for (let i = 0; i < queues.messageCount; i++) {
            const data = await channel.get(queues.queue, { noAck: false });
            console.log({
                ...data,
                content: data ? await JSON.parse(data.content.toString()) : null,
            });
        } 
    } catch (err) {
        console.log("Error: ", err);
        console.warn(err);
    }
} */

/* async function main() {
    console.log(process.argv.slice(0));
    await producer();
    await consumer();
}

void main(); */
