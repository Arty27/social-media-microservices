import winston, { Logger } from "winston";

const { timestamp, errors, splat, json, combine, colorize, simple } =
  winston.format;
const { File, Console } = winston.transports;

export const logger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  defaultMeta: { service: "api-gateway" },
  transports: [
    new Console({
      format: combine(colorize(), simple()),
    }),
    new File({ filename: "error.log", level: "error" }),
    new File({ filename: "combined.log" }),
  ],
});
