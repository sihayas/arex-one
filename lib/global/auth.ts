import { Lucia, Session, User } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import { Apple, AppleCredentials } from "arctic";
import { PrismaClient } from "@prisma/client";
import { IncomingMessage, ServerResponse } from "node:http";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export interface DatabaseUserAttributes {
  id: string;
  image: string;
  username: string;
  bio: string;
  essentials: string;
}

// Apple
const credentials: AppleCredentials = {
  clientId: process.env.APPLE_CLIENT_ID ?? "",
  teamId: process.env.APPLE_TEAM_ID ?? "",
  keyId: process.env.APPLE_KEY_ID ?? "",
  certificate: process.env.APPLE_CERT ?? "",
};
const redirectURI = process.env.APPLE_REDIRECT_URI ?? "";
export const apple = new Apple(credentials, redirectURI);

// Lucia
const client = new PrismaClient();
const luciaAdapter = new PrismaAdapter(client.session, client.user);
export const lucia = new Lucia(luciaAdapter, {
  sessionCookie: {
    name: "session",
    expires: false, // session cookies have very long lifespan (2 years),
    attributes: {
      secure: true,
      sameSite: "strict",
      domain: "voir.space",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      image: attributes.image,
      username: attributes.username,
    };
  },
});

export async function validateRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<{ user: User; session: Session } | { user: null; session: null }> {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  // Re-set the session on every response
  if (result.session && result.session.fresh) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(result.session.id).serialize(),
    );
  }

  if (!result.session) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
  }
  return result;
}
