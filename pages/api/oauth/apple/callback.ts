import { apple } from "@/lib/global/auth";
import { generateId } from "lucia";

import { parseJWT } from "oslo/jwt";
import { parse } from "cookie";
import { prisma } from "@/lib/global/prisma";
import { lucia } from "@/lib/global/auth";

const allowedOrigins = [
  "https://voir.space",
  "https://dev.voir.space",
  "https://www.voir.space",
];

interface JWTPayload {
  sub: string;
}

export default async function onRequestPost(request: any) {
  const origin = request.headers.get("origin");

  // Handle OPTIONS request for CORS Preflight
  if (request.method === "OPTIONS") {
    let headers = new Headers({
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    });

    // Only send CORS headers if the origin is allowed
    if (!origin || !allowedOrigins.includes(origin)) {
      headers.delete("Access-Control-Allow-Origin");
    }

    return new Response(null, { status: 204, headers });
  }

  // Assuming `request.json()` is used for parsing JSON body
  // On first login, Apple sends the user's data as JSON in the request body
  const contentType = request.headers.get("Content-Type") || "";
  let requestBody;
  if (contentType.includes("application/json")) {
    try {
      requestBody = await request.json();
    } catch (e) {
      console.error("Failed to parse request body as JSON", e);
      return new Response("Bad Request: Body must be JSON", { status: 400 });
    }
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    try {
      const formData = await request.text();
      requestBody = Object.fromEntries(new URLSearchParams(formData));
    } catch (e) {
      console.error("Failed to parse request body as URL-encoded form", e);
      return new Response("Bad Request: Body must be URL-encoded form", {
        status: 400,
      });
    }
  } else {
    console.error("Invalid content type. Received:", contentType);
    return new Response("Invalid content type", { status: 415 });
  }

  const { code, state } = requestBody;

  // Cross-check the state from the request body with the stored cookie/state
  const STATE_COOKIE_NAME = "apple_oauth_state";
  const cookies = parse(request.headers.get("Cookie") || "");
  const storedState = cookies[STATE_COOKIE_NAME];

  if (!code || !state || !storedState || state !== storedState) {
    console.error("Invalid request parameters. Details:", {
      code: code ? "Received" : "Missing",
      state: state ? "Received" : "Missing",
      storedState: storedState ? "Received" : "Missing",
      stateMatch: state === storedState ? "Match" : "Mismatch",
    });
    return new Response("Invalid request parameters", { status: 400 });
  }

  try {
    const tokens = await apple.validateAuthorizationCode(code);
    if (!tokens) {
      console.log("Failed to validate authorization code");
      return new Response(null, { status: 400 });
    }

    const jwt = parseJWT(tokens.idToken);
    if (!jwt || !jwt.payload) {
      console.error("Invalid JWT");
      return new Response("Invalid JWT", { status: 400 });
    }

    const payload = jwt.payload as JWTPayload;

    const existingUser = await prisma.user.findUnique({
      where: { apple_id: payload.sub },
    });

    let session;
    if (existingUser) {
      session = await lucia.createSession(existingUser.id, {});
    } else {
      const userId = generateId(15);
      await prisma.user.create({
        data: {
          id: userId,
          apple_id: payload.sub,
          username: `user-${userId}`,
          image:
            "https://voirmedia.blob.core.windows.net/voir-media/default_avi.jpg",
        },
      });

      session = await lucia.createSession(userId, {});
    }

    const headers = new Headers();

    // TODO: Fix the redirect internal server error.

    // headers.append("Location", "/");
    headers.append(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );

    return new Response(null, { status: 200, headers });
  } catch (e) {
    console.error("Error:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const runtime = "edge";
