import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { Search } from "../models/search.model";
import { searchPostService } from "../services/search.service";

export const searchPostController = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Search Endpoint Hit");
  try {
    const { query } = req.query;
    if (!query) {
      logger.warn(`search query missing in request`);
      res.status(500).json({
        success: false,
        message: "Search query missing in request",
      });
      return;
    }
    const results = await searchPostService(query.toString());
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    logger.error(`Error while searching post`, error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : error,
    });
  }
};
