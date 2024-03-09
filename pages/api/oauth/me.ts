import { initializeLuciaAndPrisma } from "@/lib/global/auth";
import { Request, ExecutionContext } from "@cloudflare/workers-types";
import { Env } from "@/types/worker-configuration";

export default async function handler(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  // Initialize Lucia with your Edge environment's configurations
  const { lucia } = await initializeLuciaAndPrisma(env);

  // Extract the Cookie header from the request
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookieHeader);

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { user, session } = await lucia.validateSession(sessionId);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // If the session is valid, respond with the user and session information
    return new Response(JSON.stringify({ user, session }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export const runtime = "edge";
