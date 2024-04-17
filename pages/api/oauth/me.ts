import { initializeLucia } from "@/lib/global/auth";
import { createResponse } from "@/pages/api/middleware";
import type { NextRequest } from "next/server";
import { D1Database } from "@cloudflare/workers-types";

export const runtime = "edge";

export default async function GET(request: NextRequest) {
  const DB = process.env.DB as unknown as D1Database;

  if (!DB) {
    return createResponse(
      { error: "Unauthorized, missing DB in environment" },
      401,
    );
  }
  const cookieHeader = request.headers.get("cookie") ?? "";
  const lucia = initializeLucia(DB);
  const sessionId = lucia.readSessionCookie(cookieHeader);
  //
  try {
    if (!sessionId) {
      return createResponse(
        { error: "Unauthorized, missing sessionId in cookie" },
        401,
      );
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (!session) {
      return createResponse(
        { error: "Unauthorized, unable to validate session" },
        401,
      );
    }

    return createResponse({}, 200);
  } catch (error) {
    console.error("Session validation error:", error);
    return createResponse({ error: "Internal Server Error" }, 500);
  }
}
