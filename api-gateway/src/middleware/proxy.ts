import { NextFunction, Response, Request } from "express";
import proxy, { ProxyOptions } from "express-http-proxy";
import { logger } from "../utils/logger";
import { RequestOptions } from "http";

const proxyOptions: ProxyOptions = {
  proxyReqPathResolver: (req: Request) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err, res: Response, next: NextFunction) => {
    logger.error(`Proxy Error:  ${err}`);
    res.status(500).json({
      success: false,
      message: "Internal Proxy Error",
    });
  },
};

const identityServiceUri = process.env.INDENTITY_SERVICE_URI;
if (!identityServiceUri) {
  logger.error(`INDENTITY_SERVICE_URI missing from .env`);
  throw new Error(`INDENTITY_SERVICE_URI missing from .env`);
}

export const indentityServiceProxy = () => {
  return proxy(identityServiceUri, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts: RequestOptions, srcReq) => {
      proxyReqOpts.headers = {
        ...(proxyReqOpts.headers || {}),
        "Content-Type": "application/json",
      };
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(`Response received from Identity Service`, {
        statusCode: proxyRes.statusCode,
        path: userReq.originalUrl,
      });
      return proxyResData;
    },
  });
};
