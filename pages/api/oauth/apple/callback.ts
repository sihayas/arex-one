// import { initializeApple, initializeLuciaAndPrisma } from "@/lib/global/auth";
// import { generateId } from "lucia";

// import { uploadDefaultImage } from "@/lib/azureBlobUtils";
// import { parseJWT } from "oslo/jwt";
// import { parse } from "cookie";
// import { Request } from "@cloudflare/workers-types";
// import { Env } from "@/types/worker-configuration";

// const allowedOrigins = [
//   "https://voir.space",
//   "https://dev.voir.space",
//   "https://www.voir.space",
// ];

// interface AuthRequest {
//   code: string;
//   state: string;
// }

// interface JWTPayload {
//   sub: string;
// }

// export default {
//   async fetch(request: Request, env: Env): Promise<Response> {
//     const origin = request.headers.get("origin");

//     // Handle OPTIONS request for CORS Preflight
//     if (request.method === "OPTIONS") {
//       if (origin && allowedOrigins.includes(origin)) {
//         let headers = new Headers();
//         headers.set("Access-Control-Allow-Origin", origin);
//         headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
//         headers.set(
//           "Access-Control-Allow-Headers",
//           "Content-Type, Authorization",
//         );
//         headers.set("Access-Control-Allow-Credentials", "true");
//         return new Response(null, { status: 204, headers });
//       }
//       return new Response(null, { status: 204 });
//     }

//     if (request.method !== "POST") {
//       return new Response("Method Not Allowed", { status: 405 });
//     }

//     const url = new URL(request.url);
//     if (!url) {
//       console.error("req.url is undefined");
//       return new Response(null, { status: 500 });
//     }

//     const { lucia, prisma } = await initializeLuciaAndPrisma(env);
//     const apple = await initializeApple(env);

//     // Assuming `request.json()` is used for parsing JSON body
//     // On first login, Apple sends the user's data as JSON in the request body
//     const requestBody = (await request.json()) as AuthRequest;
//     const { code, state } = requestBody;

//     // Cross-check the state from the request body with the stored cookie/state
//     const STATE_COOKIE_NAME = "apple_oauth_state";
//     const cookies = parse(request.headers.get("Cookie") || "");
//     const storedState = cookies[STATE_COOKIE_NAME];

//     if (!code || !state || !storedState || state !== storedState) {
//       console.error("Invalid request parameters. Details:", {
//         code: code ? "Received" : "Missing",
//         state: state ? "Received" : "Missing",
//         storedState: storedState ? "Received" : "Missing",
//         stateMatch: state === storedState ? "Match" : "Mismatch",
//       });
//       return new Response("Invalid request parameters", { status: 400 });
//     }

//     try {
//       const tokens = await apple.validateAuthorizationCode(code);
//       if (!tokens) {
//         console.log("Failed to validate authorization code");
//         return new Response(null, { status: 400 });
//       }

//       const jwt = parseJWT(tokens.idToken);
//       if (!jwt || !jwt.payload) {
//         console.error("Invalid JWT");
//         return new Response("Invalid JWT", { status: 400 });
//       }

//       const payload = jwt.payload as JWTPayload;

//       const existingUser = await prisma.user.findFirst({
//         where: { apple_id: payload.sub },
//       });

//       let session;
//       if (existingUser) {
//         // Existing user found, creating new session
//         session = await lucia.createSession(existingUser.id, {});
//       } else {
//         // No existing user found, creating new user
//         const userId = generateId(15);
//         const defaultImageUrl = await uploadDefaultImage();
//         await prisma.user.create({
//           data: {
//             id: userId,
//             apple_id: payload.sub,
//             username: `user-${userId}`,
//             image: defaultImageUrl,
//           },
//         });

//         session = await lucia.createSession(userId, {});
//       }

//       // Set session cookie and respond
//       const headers = new Headers({
//         "Set-Cookie": lucia.createSessionCookie(session.id).serialize(),
//       });
//       return new Response(null, { status: 302, headers });
//     } catch (e) {
//       console.error("Error:", e);
//       return new Response("Internal Server Error", { status: 500 });
//     }
//   },
// };

export const runtime = "edge";
