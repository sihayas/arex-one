import { Lucia } from "lucia";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { Client } from "@planetscale/database";

import { Apple } from "arctic";
// import type { IncomingMessage, ServerResponse } from "http";
import { Notification } from "@/types/dbTypes";
import { Request, ExecutionContext } from "@cloudflare/workers-types";
import { Env } from "@/types/worker-configuration";

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

export async function initializeApple(env: Env): Promise<Apple> {
  const apple = new Apple(
    {
      clientId: env.APPLE_CLIENT_ID,
      teamId: env.APPLE_TEAM_ID,
      keyId: env.APPLE_KEY_ID,
      certificate: env.APPLE_CERT,
    },
    env.APPLE_REDIRECT_URI,
  );

  return apple;
}

export async function initializeLuciaAndPrisma(
  env: Env,
): Promise<{ lucia: Lucia; prisma: PrismaClient }> {
  const client = new Client({
    url: env.DATABASE_URL,
    fetch(url, init) {
      // @ts-ignore
      delete init["cache"];
      return fetch(url, init);
    },
  });

  const adapter = new PrismaPlanetScale(client);
  const prisma = new PrismaClient({ adapter: adapter });

  const luciaAdapter = new PrismaAdapter(prisma.user, prisma.session);

  const lucia = new Lucia({
    // @ts-ignore
    adapter: luciaAdapter,
    sessionCookie: {
      name: "session",
      expires: false,
      attributes: {
        secure: true,
        sameSite: "strict",
        domain: "voir.space",
      },
    },
    getUserAttributes: (attributes: DatabaseUserAttributes) => ({
      id: attributes.id,
      apple_id: attributes.apple_id,
      username: attributes.username,
      image: attributes.image,
      notifications: attributes.notifications,
    }),
  });

  // Return both lucia and prisma instances
  return { lucia, prisma };
}

export async function initializePrisma(env: Env) {
  const client = new Client({
    url: env.DATABASE_URL,
    fetch(url, init) {
      // @ts-ignore
      delete init["cache"];
      return fetch(url, init);
    },
  });

  const adapter = new PrismaPlanetScale(client);
  const prisma = new PrismaClient({ adapter: adapter });

  return prisma;
}

// export const edgeHandler = {
//   async fetch(
//     request: Request,
//     env: Env,
//     ctx: ExecutionContext,
//   ): Promise<Response> {
//     const { lucia, prisma } = await initializeLuciaAndPrisma(env);

//     const sessionCookie = request.headers.get("cookie") ?? "";
//     try {
//       const sessionValidationResult =
//         await lucia.validateSession(sessionCookie);
//       if (!sessionValidationResult.user) {
//         return new Response("Unauthorized", { status: 401 });
//       }
//       // Proceed with your logic for a valid session...
//       return new Response(JSON.stringify(sessionValidationResult.user), {
//         status: 200,
//       });
//     } catch (error) {
//       return new Response("Error validating session", { status: 500 });
//     }
//   },
// };

export const runtime = "edge";
