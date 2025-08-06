import { Search } from "../models/search.model";
import { logger } from "../utils/logger";

export const searchPostService = async (query: string) => {
  const result = await Search.find(
    {
      $text: { $search: query },
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(10);
  logger.info(`Returning search result...`, result);
  return result;
};
