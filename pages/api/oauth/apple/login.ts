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
      secure: true, // Important, treat development as secure for Apple
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: "none",
    });

    // Attach the cookie to the response
    res.setHeader("Set-Cookie", cookieString); // Note: It's setHeader, not appendHeader. Verify this based on your framework version
    res.redirect(url.toString());
  } catch (error) {
    // Enhanced error logging
    console.error("Error in /api/oauth/apple handler:", {
      message: error.message,
      stack: error.stack,
      // Include any other relevant info about the error
      // You can customize this part to log more error details specific to your application or the external services it interacts with
    });

    // Optionally, send more detailed error information back to the client in development mode
    // Ensure to not expose sensitive information in production
    if (process.env.NODE_ENV === "development") {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    } else {
      res.status(500).end("Internal Server Error");
    }
  }
}

export const runtime = "edge";
