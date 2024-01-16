import { apple, lucia } from "@/lib/global/auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { uploadDefaultImage } from "@/lib/azureBlobUtils";
import { parseJWT } from "oslo/jwt";

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

  // On first login, Apple sends the user's data as JSON in the request body
  const { user: userJSON, code, state } = req.body;

  // Cross-check the state from the request body with the stored cookie/state
  const storedState = req.cookies.apple_oauth_state;

  // Log each variable to see their values
  console.log("Code from form data:", code);
  console.log("State from form data:", state);
  console.log("Stored state from cookies:", storedState);
  console.log("User JSON:", userJSON);

  // Check each condition separately and log
  if (!code) {
    console.log("Code is missing");
    res.status(400).end();
    return;
  }

  if (!state) {
    console.log("State is missing");
    res.status(400).end();
    return;
  }

  if (!storedState) {
    console.log("Stored state is missing");
    res.status(400).end();
    return;
  }

  if (state !== storedState) {
    console.log("State mismatch:", state, "does not equal", storedState);
    res.status(400).end();
    return;
  }

  try {
    // Validate and return Apple tokens
    const tokens = await apple.validateAuthorizationCode(code);
    console.log("Tokens received:", tokens);

    let parsedToken;

    // Parse user JSON if present/first login
    if (tokens) {
      parsedToken = parseJWT(tokens.idToken);
      console.log("Parsed JWT:", parsedToken);
    }

    if (!parsedToken) {
      console.log("Parsed token is missing");
      res.status(400).end();
      return;
    }

    //@ts-ignore
    console.log("Checking for existing user with Apple ID:", parsedToken.sub);
    let existingUser = await prisma.user.findFirst({
      //@ts-ignore
      where: { apple_id: parsedToken.sub },
    });

    if (existingUser) {
      console.log("Existing user found:", existingUser);
      const session = await lucia.createSession(existingUser.id, {});

      console.log("Session created for existing user:", session);
      return res
        .appendHeader(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect("/");
    } else {
      console.log("No existing user found, creating new user.");
    }

    const userId = generateId(15);
    console.log("Generated new user ID:", userId);
    const defaultImageUrl = await uploadDefaultImage();
    console.log("Default image URL:", defaultImageUrl);

    console.log("Creating new user in database.");
    await prisma.user.create({
      data: {
        id: userId,
        //@ts-ignore
        apple_id: parsedToken.sub,
        username: `user-${userId}`,
        image: defaultImageUrl,
      },
    });

    console.log("New user created, creating session.");
    const session = await lucia.createSession(userId, {});

    console.log("Session created for new user:", session);
    return res
      .appendHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      )
      .redirect("/");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      const { message, description, request } = e;
      // invalid code
      console.error(message, description, request);
    }
    res.status(500).end();
    return;
  }
}

type AppleUser = {
  email?: string;
  email_verified?: boolean;
  sub: string;
};

//
// const user = JSON.parse(userJSON);
// console.log("Parsed user JSON:", userJSON);
//
// email = user.email;
// firstName = user.name.firstName;
// lastName = user.name.lastName;
