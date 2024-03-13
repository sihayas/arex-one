import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import { Apple, AppleCredentials } from "arctic";
import { Notification } from "@/types/dbTypes";
import { initializePrisma } from "./prisma";

declare module "lucia" {
  interface Register {
    Lucia: typeof Lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  apple_id: number;
  username: string;
  image: string;
  notifications: Notification[];
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
const prisma = initializePrisma();
const luciaAdapter = new PrismaAdapter(prisma.user, prisma.session);
export const lucia = new Lucia(luciaAdapter, {
  sessionCookie: {
    name: "session",
    expires: false, // session cookies have very long lifespan (2 years)
    attributes: {
      secure: true,
      sameSite: "strict",
      domain: "dev.voir.space",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      appleId: attributes.apple_id,
      username: attributes.username,
      image: attributes.image,
      notifications: attributes.notifications,
    };
  },
});
