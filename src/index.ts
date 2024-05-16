import Fastify from "fastify";
import { setupSampleTopicConsumer } from "./jobs/consumers";
import { run } from "./jobs/producer";
import { prisma } from "./db";

const app = Fastify({
    logger: true,
});

app.post("/send", async function (request, reply) {
    const topic = "sample-topic";
    const payload = JSON.stringify({ timestamp: new Date().toISOString() });
    const job = await prisma.job.create({ data: { topic, payload } });

    run("sample-topic", [
        {
            value: payload,
            key: job.id,
        },
    ]);

    reply.send(201).send(job);
});

(async () => {
    await setupSampleTopicConsumer();
    app.listen({ port: 3000 }, function (err, address) {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
    });
})();
