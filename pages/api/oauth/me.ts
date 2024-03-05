import { NextApiRequest, NextApiResponse } from "next";
import { lucia } from "@/lib/global/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { user, session } = await lucia.validateSession(sessionId);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({ user, session });
}

// export const runtime = "edge";
