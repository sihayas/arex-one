import { apple, lucia } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { NextApiRequest, NextApiResponse } from "next";

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
    const tokens = await apple.validateAuthorizationCode(code);
    const appleUserResponse = await fetch("https://api.apple.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const appleUser: AppleUser = await appleUserResponse.json();

    const existingUser = await db
      .table("user")
      .where("github_id", "=", githubUser.id)
      .get();

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
    await db.table("user").insert({
      id: userId,
      github_id: githubUser.id,
      username: githubUser.login,
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
      // invalid code
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
