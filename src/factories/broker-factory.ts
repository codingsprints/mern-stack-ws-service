import config from "config";
import { KafkaBroker } from "../config/kafka";
import { MessageBroker } from "../common/types/broker";
import logger from "../config/logger";
import { WS_SERVICE } from "../common/constant";

let broker: MessageBroker | null = null;

export const createMessageBroker = (): MessageBroker => {
  logger.info("connecting to kafka broker...");
  // singleton
  if (!broker) {
    broker = new KafkaBroker(WS_SERVICE, config.get("kafka.broker"));
  }
  return broker;
};
