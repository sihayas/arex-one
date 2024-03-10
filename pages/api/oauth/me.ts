import { lucia } from "@/lib/global/auth";

export const runtime = "edge";

export default async function onRequest(request: any) {
  // Extract the Cookie header from the request
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookieHeader);

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }

  try {
    const { session } = await lucia.validateSession(sessionId);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      });
    }

    // If the session is valid, respond with the user and session information
    return new Response(
      JSON.stringify({ user: process.env, event: cookieHeader }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error(`Error validating session in /api/me handler: ${error}`);
    return new Response(
      JSON.stringify({
        error: `
      Error validating session in /api/me handler: ${error}`,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      },
    );
  }
}
