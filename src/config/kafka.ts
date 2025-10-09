import { Consumer, EachMessagePayload, Kafka, KafkaConfig } from "kafkajs";
import { MessageBroker } from "../common/types/broker";
import ws from "../socket";
import { configENV } from "./config";
import { NODE_ENV_VAL } from "../common/constant";

export class KafkaBroker implements MessageBroker {
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[]) {
    let kafkaConfig: KafkaConfig = {
      clientId,
      brokers,
    };

    if (configENV.nodeEnv === NODE_ENV_VAL.PRODUCTION) {
      kafkaConfig = {
        ...kafkaConfig,
        ssl: configENV.kafkaSSL,
        connectionTimeout: 45000,
        sasl: {
          mechanism: "plain",
          username: configENV.kafkaUserName,
          password: configENV.kafkaPassword,
        },
      };
    }

    const kafka = new Kafka(kafkaConfig);

    this.consumer = kafka.consumer({ groupId: clientId });
  }

  /**
   * Connect the consumer
   */
  async connectConsumer() {
    await this.consumer.connect();
  }

  /**
   * Disconnect the consumer
   */
  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  async consumeMessage(topics: string[], fromBeginning: boolean = false) {
    await this.consumer.subscribe({ topics, fromBeginning });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        // Logic to handle incoming messages.
        console.log("-------------- value", {
          value: message.value.toString(),
          topic,
          partition,
        });

        switch (topic) {
          case "order":
            {
              // todo: maybe check event_type ?
              const order = JSON.parse(message.value.toString());
              console.log("order parse ->", order);
              ws.io
                .to(order?.data?.newOrder?.tenantId)
                .emit("order-update", order);
            }
            break;
          default:
            console.log("Doing nothing...");
        }
      },
    });
  }
}
