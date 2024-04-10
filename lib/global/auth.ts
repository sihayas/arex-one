import { Lucia } from "lucia";

import { Apple, AppleCredentials } from "arctic";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { D1Database } from "@cloudflare/workers-types";

declare module "lucia" {
  interface Register {
    Auth: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  apple_id: number;
  username: string;
  image: string;
}

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "user",
    session: "session",
  });
  return new Lucia(adapter, {
    sessionCookie: {
      name: "session",
      expires: false,
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
}

const credentials: AppleCredentials = {
  clientId: process.env.APPLE_CLIENT_ID ?? "",
  teamId: process.env.APPLE_TEAM_ID ?? "",
  keyId: process.env.APPLE_KEY_ID ?? "",
  certificate: process.env.APPLE_CERT ?? "",
};
const redirectURI = process.env.APPLE_REDIRECT_URI ?? "";
export const apple = new Apple(credentials, redirectURI);

// Lucia
// const client = prismaClient();
// const luciaAdapter = new PrismaAdapter(client.session, client.user);
// export const lucia = new Lucia(luciaAdapter, {
//   sessionCookie: {
//     name: "session",
//     expires: false, // session cookies have very long lifespan (2 years),
//     attributes: {
//       secure: true,
//       sameSite: "strict",
//       domain: "voir.space",
//     },
//   },
//   getUserAttributes: (attributes) => {
//     return {
//       id: attributes.id,
//       appleId: attributes.apple_id,
//       username: attributes.username,
//       image: attributes.image,
//     };
//   },
// });

// Apple
