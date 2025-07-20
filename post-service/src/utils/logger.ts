import winston, { Logger } from "winston";

const { timestamp, errors, splat, json, combine, colorize, simple } =
  winston.format;
const { File, Console } = winston.transports;

export const baseLogger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  defaultMeta: { service: "Post Service" },
  transports: [
    new Console({
      format: combine(colorize(), simple()),
    }),
    new File({ filename: "error.log", level: "error" }),
    new File({ filename: "combined.log" }),
  ],
});

// Adding custom divider to the logs to differentiate between requests
export const logger: Logger & {
  divider: (char?: string, length?: number) => void;
} = Object.assign(baseLogger, {
  divider: (char = "-", length = 90): void => {
    console.log(char.repeat(length));
  },
});
