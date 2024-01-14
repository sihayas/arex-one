import { apple, lucia } from "@/lib/global/auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { uploadDefaultImage } from "@/lib/azureBlobUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(404).end();
    return;
  }

  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const storedState = req.cookies.apple_oauth_state ?? null;

  // Log each variable to see their values
  console.log("Code from query:", code);
  console.log("State from query:", state);
  console.log("Stored state from cookies:", storedState);

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

    // Using the access token, retrieve the user's details
    const appleUserResponse = await fetch(
      "https://appleid.apple.com/auth/token",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const appleUser: AppleUser = await appleUserResponse.json();

    // Check if the user already exists in the database via sub
    const existingUser = await prisma.user.findFirst({
      where: {
        apple_id: appleUser.sub,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      return res
        .appendHeader(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect("/");
    }

    const userId = generateId(15);
    const defaultImageUrl = await uploadDefaultImage();

    await prisma.user.create({
      data: {
        id: userId,
        apple_id: appleUser.sub,
        username: "Apple User",
        email: appleUser.email,
        image: defaultImageUrl,
      },
    });

    const session = await lucia.createSession(userId, {});
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
