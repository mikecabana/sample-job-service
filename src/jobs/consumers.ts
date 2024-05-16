import { prisma } from "../db";
import { kafka } from "./";

const consumer = kafka.consumer({ groupId: "sample-service" });

export const setupSampleTopicConsumer = async () => {
    console.log("Setting up sample consumer...");
    await consumer.connect();
    await consumer.subscribe({ topic: "sample-topic", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("Consuming...");

            const id = message.key?.toString();

            if (id) {
                await prisma.job.update({
                    where: { id },
                    data: { status: "processing" },
                });
                await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds

                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value?.toString(),
                });

                await prisma.job.update({
                    where: { id },
                    data: { status: "done" },
                });

                console.log("Done consuming...");
            }
        },
    });
};
