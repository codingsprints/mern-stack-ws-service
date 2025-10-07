import logger from "./config/logger";
import config from "config";
import { createMessageBroker } from "./factories/broker-factory";
import { MessageBroker } from "./common/types/broker";
import ws from "./socket";
import { TOPIC_NAME } from "./common/constant";

const startServer = async () => {
  let broker: MessageBroker | null = null;
  try {
    broker = createMessageBroker();
    await broker.connectConsumer();
    await broker.consumeMessage([TOPIC_NAME.order], false);

    const PORT = config.get("server.port");
    ws.wsServer
      .listen(PORT, () => {
        logger.info(`✅ Server running on port: ${PORT}`);
      })
      .on("error", (err) => {
        logger.error("❌ Error", err.message);
        process.exit(1);
      });
  } catch (err) {
    logger.error("❌ Error happened: ", err);
    if (broker) {
      await broker.disconnectConsumer();
    }
    process.exit(1);
  }
};

void startServer();
