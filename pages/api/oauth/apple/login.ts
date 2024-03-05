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
      // Log and return a 405 Method Not Allowed error if not a GET request
      console.error("Invalid request method:", req.method);
      res.status(405).end("Method Not Allowed");
      return;
    }

    const state = generateState();
    const url: URL = await apple.createAuthorizationURL(state, {
      scopes: ["name", "email"],
    });
    url.searchParams.set("response_mode", "form_post");

    // Generate the cookie string
    const cookieString = serializeCookie("apple_oauth_state", state, {
      path: "/",
      // Important, treat development as secure for Apple
      secure: true,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "none",
    });

    // Attach the cookie to the response
    res.appendHeader("Set-Cookie", cookieString);
    res.redirect(url.toString());
  } catch (error) {
    // Log the error for debugging
    console.error("Error in /api/oauth/apple handler:", error);

    // Send a generic 500 Internal Server Error response
    res.status(500).end("Internal Server Error");
  }
}

export const runtime = "edge";
