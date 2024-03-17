import { Request } from "@cloudflare/workers-types";
import { lucia } from "@/lib/global/auth";

export default async function onRequestPost(request: Request) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const sessionId = lucia.readSessionCookie(cookieHeader ?? "");
    if (!sessionId) {
      return new Response(null, {
        status: 401,
      });
    }

    await lucia.invalidateSession(sessionId);

    // Create a new blank session cookie to clear the session
    const blankSessionCookie = lucia.createBlankSessionCookie();
    return new Response(
      JSON.stringify({ message: "Successfully logged out" }),
      {
        status: 200,
        headers: {
          "Set-Cookie": blankSessionCookie.serialize(),
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error in logout handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const runtime = "edge";
