import { apple } from "@/lib/global/auth";
import { generateState } from "arctic";
import { serializeCookie } from "oslo/cookie";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") {
      console.error("Invalid request method:", req.method);
      res.status(405).end("Method Not Allowed");
      return;
    }

    const state = generateState();
    const url: URL = await apple.createAuthorizationURL(state, {
      scopes: ["name", "email"],
    });
    url.searchParams.set("response_mode", "form_post");

    const cookieString = serializeCookie("apple_oauth_state", state, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: "none",
    });

    res.setHeader("Set-Cookie", cookieString);
    res.redirect(url.toString());
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in /api/oauth/apple handler:", {
        message: error.message,
        stack: error.stack,
      });

      if (process.env.NODE_ENV === "development") {
        res
          .status(500)
          .json({ error: "Internal Server Error", details: error.message });
      } else {
        res.status(500).end("Internal Server Error");
      }
    } else {
      console.error("An unexpected error occurred", error);
      res.status(500).end("Internal Server Error");
    }
  }
}

export const runtime = "edge";
