import { lucia, validateRequest } from "@/lib/global/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { serializeCookie } from "oslo/cookie";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      // Log and return a 405 Method Not Allowed error if not a POST request
      console.error("Invalid request method:", req.method);
      res.status(405).end("Method Not Allowed");
      return;
    }

    // Make sure there is a session to log out of
    const { session } = await validateRequest(req, res);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    res.appendHeader("Set-Cookie", sessionCookie.serialize()).redirect("/");
  } catch (error) {
    console.error("Error in sign-out handler:", error);
    res.status(500).end("Internal Server Error");
  }
}
