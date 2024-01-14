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
  const storedState = req.cookies.github_oauth_state ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    console.log(code, state, storedState);
    res.status(400).end();
    return;
  }

  try {
    console.log("Validating Apple Authorization Code");
    const tokens = await apple.validateAuthorizationCode(code);

    console.log("Retrieving user's details from Apple");
    const appleUserResponse = await fetch(
      "https://appleid.apple.com/auth/token",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const appleUser: AppleUser = await appleUserResponse.json();
    console.log("Apple User Details:", appleUser);

    console.log("Checking if the user exists in the database");
    const existingUser = await prisma.user.findFirst({
      where: {
        apple_id: appleUser.sub,
      },
    });

    if (existingUser) {
      console.log("Existing user found, creating session");
      const session = await lucia.createSession(existingUser.id, {});
      console.log("Session created, setting cookie and redirecting to home");
      return res
        .appendHeader(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect("/");
    }

    console.log("No existing user, creating new user");
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

    console.log("New user created, initiating session");
    const session = await lucia.createSession(userId, {});
    console.log(
      "Session created for new user, setting cookie and redirecting to home",
    );
    return res
      .appendHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      )
      .redirect("/");
  } catch (e) {
    console.error("Error during Apple Sign In process", e);
    if (e instanceof OAuth2RequestError) {
      console.error("OAuth2 Request Error - Invalid Code", e);
      return new Response(null, {
        status: 400,
      });
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
