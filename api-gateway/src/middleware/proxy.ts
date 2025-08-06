import { NextFunction, Response, Request } from "express";
import proxy, { ProxyOptions } from "express-http-proxy";
import { logger } from "../utils/logger";
import { RequestOptions } from "http";
import { validateToken } from "./auth";

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

const postServiceUri = process.env.POST_SERVICE_URI;
if (!postServiceUri) {
  logger.error(`POST_SERVICE_URI missing from .env`);
  throw new Error(`POST_SERVICE_URI missing from .env`);
}

export const postServiceProxy = () => {
  return proxy(postServiceUri, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts: RequestOptions, srcReq: Request) => {
      proxyReqOpts.headers = {
        ...(proxyReqOpts.headers || {}),
        "Content-Type": "application/json",
        "x-user-id": srcReq.user?.userId,
      };
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(`Response received from Post Service`, {
        statusCode: proxyRes.statusCode,
        path: userReq.originalUrl,
      });
      return proxyResData;
    },
  });
};

const mediaServiceUri = process.env.MEDIA_SERVICE_URI;
if (!mediaServiceUri) {
  logger.error(`MEDIA_SERVICE_URI missing from .env`);
  throw new Error(`MEDIA_SERVICE_URI missing from .env`);
}

export const mediaServiceProxy = () => {
  return proxy(mediaServiceUri, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts: RequestOptions, srcReq: Request) => {
      const contentType = srcReq.headers["content-type"]?.toLowerCase();
      const isMultiPart = contentType?.startsWith("multipart/form-data");

      proxyReqOpts.headers = {
        ...(proxyReqOpts.headers || {}),
        "x-user-id": srcReq.user?.userId,
        ...(isMultiPart ? {} : { "Content-Type": "application/json" }),
      };

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(`Response received from Media Service`, {
        statusCode: proxyRes.statusCode,
        path: userReq.originalUrl,
      });
      return proxyResData;
    },
    parseReqBody: false,
  });
};

const searchServiceUri = process.env.SEARCH_SERVICE_URI;
if (!searchServiceUri) {
  logger.error(`SEARCH_SERVICE_URI missing from .env`);
  throw new Error(`SEARCH_SERVICE_URI missing from .env`);
}

export const searchServiceProxy = () => {
  return proxy(searchServiceUri, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts: RequestOptions, srcReq: Request) => {
      proxyReqOpts.headers = {
        ...(proxyReqOpts.headers || {}),
        "Content-Type": "application/json",
        "x-user-id": srcReq.user?.userId,
      };
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(`Response received from Search Service`, {
        statusCode: proxyRes.statusCode,
        path: userReq.originalUrl,
      });
      return proxyResData;
    },
  });
};
