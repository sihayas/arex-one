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
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }

  // Extract code and state from the form data
  const formData = await req.formData();
  const code = formData.get("code")?.toString() ?? null;
  const state = formData.get("state")?.toString() ?? null;
  const storedState = req.cookies.apple_oauth_state ?? null;
  const userJSON = formData.get("user");

  // Log each variable to see their values
  console.log("Code from form data:", code);
  console.log("State from form data:", state);
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
    const tokens = await apple.validateAuthorizationCode(code.toString());

    let firstName, lastName, email;
    // Parse user JSON if present
    if (typeof userJSON === "string") {
      const user = JSON.parse(userJSON);
      firstName = user.name.firstName;
      lastName = user.name.lastName;
      email = user.email;
    }

    let existingUser = await prisma.user.findFirst({
      where: { apple_id: tokens.idToken },
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
        apple_id: tokens.idToken,
        username: `${firstName} ${lastName}`,
        email: email,
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
