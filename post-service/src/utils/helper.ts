import { Request } from "express";

// function to parse pagination parameters
export const parsePaginationParams = (req: Request) => {
  const page =
    typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
  const limit =
    typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
  return { page, limit };
};
