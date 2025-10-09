import * as dotenv from "dotenv";
import path from "path";
import config from "config";
import { NODE_ENV_VAL } from "../common/constant";

const nodeENV: string = NODE_ENV_VAL.DEVELOPMENT;
// const nodeENV: string = NODE_ENV_VAL.TEST;
// const nodeENV: string = NODE_ENV_VAL.PRODUCTION;

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV ?? nodeENV}`,
  ),
});

interface Config {
  port: number;
  nodeEnv: string;
  baseUrl: string;
  hostname: string;
  jwksUri: string;
  broker: string[];
  clientUI: string;
  adminUI: string;
  kafkaSSL: boolean;
  kafkaUserName: string;
  kafkaPassword: string;
}

export const configENV: Config = {
  port: config.get("server.port") || 5004,
  nodeEnv: process.env.NODE_ENV || NODE_ENV_VAL.PRODUCTION,
  baseUrl: config.get("server.baseUrl") ?? "/pizza-app/ws-service/api/v1",
  hostname: config.get("server.hostname") ?? "localhost",
  jwksUri: config.get("auth.jwksUri") || "",
  broker: config.get("kafka.broker") || [],
  clientUI: config.get("frontend.clientUI") || "",
  adminUI: config.get("frontend.adminUI") || "",
  kafkaSSL: config.get("kafka.ssl") || false,
  kafkaUserName: config.get("kafka.sasl.username") || "",
  kafkaPassword: config.get("kafka.sasl.password") || "",
};
