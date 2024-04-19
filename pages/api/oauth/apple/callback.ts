import { apple, lucia } from "@/lib/global/auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { parseJWT } from "oslo/jwt";

const allowedOrigins = [
  "https://voir.space",
  "https://dev.voir.space",
  "https://www.voir.space",
  "https://audition.fly.dev",
];

interface JWTPayload {
  sub: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Handle OPTIONS request for CORS Preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "https://voir.space");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  if (typeof req.url !== "string") {
    console.error("req.url is undefined");
    res.status(500).end();
    return;
  }

  // On first login, Apple sends the user's data as JSON in the request body (also user
  const { code, state } = req.body;

  // Cross-check the state from the request body with the stored cookie/state
  const storedState = req.cookies.apple_oauth_state;

  if (!code || !state || !storedState || state !== storedState) {
    console.error("Invalid request parameters. Details:", {
      code: code ? "Received" : "Missing",
      state: state ? "Received" : "Missing",
      storedState: storedState ? "Received" : "Missing",
      stateMatch: state === storedState ? "Match" : "Mismatch",
    });
    res.status(400).end("Invalid request parameters");
    return;
  }

  try {
    // Validate and return Apple tokens
    const tokens = await apple.validateAuthorizationCode(code);
    if (!tokens) {
      console.log("Failed to validate authorization code");
      res.status(400).end();
      return;
    }

    const jwt = parseJWT(tokens.idToken);
    if (!jwt || !jwt.payload) {
      console.error("Invalid JWT");
      res.status(400).end("Invalid JWT");
      return;
    }

    const payload = jwt.payload as JWTPayload;

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      // @ts-ignore
      where: { apple_id: payload.sub },
    });

    let session;
    if (existingUser) {
      console.log("Existing user found, creating new session.");
      session = await lucia.createSession(existingUser.id, {});
    } else {
      console.log("No existing user found, creating new user.");
      const userId = generateId(15);
      await prisma.user.create({
        data: {
          id: userId,
          apple_id: payload.sub,
          username: `user-${userId}`,
          image:
            "https://assets.voir.space/profile_image%2F720sse7txjp4wrb-20ae95ac-f3ed-4cc1-8181-a28ea49b1583.jpg",
        },
      });

      session = await lucia.createSession(userId, {});
    }

    // Set session cookie and redirect
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
    res.status(200).json({ message: "Cookie set successfully" });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      const { message, description, request } = e;
      console.error(message, description, request);
    }
    res.status(500).end();
    return;
  }
}
