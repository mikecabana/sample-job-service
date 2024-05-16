import { Kafka, logLevel } from "kafkajs";

const host = process.env.KAFKA_HOST as string;
const user = process.env.KAFKA_USER as string;
const pass = process.env.KAFKA_PASS as string;

let _kafka: Kafka | undefined;

const setupKafka = () => {
    _kafka = new Kafka({
        clientId: "sample-service",
        brokers: [host],
        ssl: true,
        sasl: {
            mechanism: "scram-sha-256",
            username: user,
            password: pass,
        },
        logLevel: logLevel.ERROR,
    });
    return _kafka;
};

export const kafka = _kafka ?? setupKafka();
