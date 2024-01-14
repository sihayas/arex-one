import { Lucia } from "lucia";
import { webcrypto } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Apple } from "arctic";
import type { AppleCredentials } from "arctic";
import fs from "fs";
import path from "path";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
  interface DatabaseUserAttributes {
    apple_email: string;
    username: string;
  }
}

interface DatabaseSessionAttributes {
  ip_country: string;
}
interface DatabaseUserAttributes {
  username: string;
}

globalThis.crypto = webcrypto as Crypto;

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.session, client.user);

const certificatePath = path.join(
  process.cwd(),
  process.env.APPLE_CERT_PATH ?? "",
);

const certificate = process.env.APPLE_CERT_BASE64
  ? Buffer.from(process.env.APPLE_CERT_BASE64, "base64").toString("utf-8")
  : fs.readFileSync(certificatePath, "utf-8");

const credentials: AppleCredentials = {
  clientId: process.env.APPLE_CLIENT_ID ?? "",
  teamId: process.env.APPLE_TEAM_ID ?? "",
  keyId: process.env.APPLE_KEY_ID ?? "",
  certificate,
};

export const apple = new Apple(credentials, "voir.space");

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
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
