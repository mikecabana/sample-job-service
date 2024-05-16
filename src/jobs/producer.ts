import { kafka } from "./";
import { Message } from "kafkajs";

const producer = kafka.producer();

export const run = async (topic: string, messages: Message[]) => {
    await producer.connect();

    await producer.send({
        topic,
        messages,
    });

    console.log(`${topic} message sent successfully`);
    await producer.disconnect();
};
