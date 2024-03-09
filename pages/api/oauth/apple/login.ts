// import { generateState } from "arctic";
// import { serializeCookie } from "oslo/cookie";
// import { Request } from "@cloudflare/workers-types";
// import { Env } from "@/types/worker-configuration";
// import { initializeApple } from "@/lib/global/auth";

// export default async function handler(request: Request, env: Env) {
//   try {
//     if (request.method !== "GET") {
//       return new Response("Method Not Allowed", { status: 405 });
//     }

//     const apple = await initializeApple(env);

//     const state = generateState();
//     const url = await apple.createAuthorizationURL(state, {
//       scopes: ["name", "email"],
//     });
//     url.searchParams.set("response_mode", "form_post");

//     const headers = new Headers();
//     headers.append("Location", url.toString());
//     headers.append(
//       "Set-Cookie",
//       serializeCookie("apple_oauth_state", state, {
//         path: "/",
//         secure: true,
//         httpOnly: true,
//         maxAge: 60 * 10, // 10 minutes
//         sameSite: "none",
//       }),
//     );

//     // Use 302 for redirection
//     return new Response(null, { status: 302, headers: headers });
//   } catch (error) {
//     console.error("Error in /api/oauth/apple handler:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }

export const runtime = "edge";
