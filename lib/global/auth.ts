import { Lucia, Session, User } from "lucia";
import { webcrypto } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Apple } from "arctic";
import type { AppleCredentials } from "arctic";
import fs from "fs";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  apple_id: number;
  username: string;
  image: string;
}

globalThis.crypto = webcrypto as Crypto;

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.session, client.user);

const certificatePath = path.join(
  process.cwd(),
  process.env.APPLE_CERT_PATH ?? "",
);

const certificate = process.env.APPLE_CERT ?? "";

const credentials: AppleCredentials = {
  clientId: process.env.APPLE_CLIENT_ID ?? "",
  teamId: process.env.APPLE_TEAM_ID ?? "",
  keyId: process.env.APPLE_KEY_ID ?? "",
  certificate,
};

const redirectURI = process.env.APPLE_REDIRECT_URI ?? "";
export const apple = new Apple(credentials, redirectURI);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "session",
    expires: false, // session cookies have very long lifespan (2 years)
    attributes: {
      secure: true,
      sameSite: "strict",
      domain: "voir.space",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      appleId: attributes.apple_id,
      username: attributes.username,
      image: attributes.image,
    };
  },
});

// Middleware to validate the session cookie on every request
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
