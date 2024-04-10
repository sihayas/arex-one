import { initializeLucia } from "@/lib/global/auth";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { apple } from "@/lib/global/auth";

export const runtime = "edge";

// Initialize authentication on homepage.
export default async function onRequest(request: any) {
  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized, missing DB in environment",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      },
    );
  }
  const cookieHeader = request.headers.get("cookie") ?? "";
  const lucia = initializeLucia(DB);
  const sessionId = lucia.readSessionCookie(cookieHeader);

  try {
    if (!sessionId) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized, missing sessionId in cookie",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 401,
        },
      );
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (!session) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized, unable to validate session",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 401,
        },
      );
    }

    // If the session is valid, respond with the user and session information
    return new Response(JSON.stringify({ user: user, event: cookieHeader }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
}
