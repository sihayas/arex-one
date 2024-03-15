// import { initializeLuciaAndPrisma } from "@/lib/global/auth";
// import { Request } from "@cloudflare/workers-types";
// import { Env } from "@/types/worker-configuration";

// export default async function handler(request: Request, env: Env) {
//   if (request.method !== "POST") {
//     return new Response("Method Not Allowed", { status: 405 });
//   }

//     // Invalidate the session
//     await lucia.invalidateSession(session.id);

//     // Create a new blank session cookie to clear the session
//     const blankSessionCookie = lucia.createBlankSessionCookie();
//     return new Response(
//       JSON.stringify({ message: "Successfully logged out" }),
//       {
//         status: 200,
//         headers: {
//           "Set-Cookie": blankSessionCookie.serialize(),
//           "Content-Type": "application/json",
//         },
//       },
//     );
//   } catch (error) {
//     console.error("Error in logout handler:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }

export const runtime = "edge";
