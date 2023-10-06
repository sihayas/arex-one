import { NextApiRequest, NextApiResponse } from "next";

export const validateQuery = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void,
) => {
  const userId =
    typeof req.query.userId === "string" ? req.query.userId : undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid page number." });
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: "Invalid limit." });
  }

  next();
};
