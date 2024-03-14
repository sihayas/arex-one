import { lucia } from "@/lib/global/auth";

export const runtime = "edge";

export default async function onRequest(request: any) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookieHeader);

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

  try {
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
