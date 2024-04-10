// import { S3 } from "@/lib/global/r2client";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { prisma } from "@/lib/global/prisma";
// import { setCache } from "@/lib/global/redis";

export const runtime = "edge";

// export default async function onRequest(request: any) {
//   try {
//     const url = new URL(request.url);
//     const userId = url.searchParams.get("userId");
//     const uniqueId = crypto.randomUUID();
//     const fileName = `profile_image/${userId}-${uniqueId}.jpg`;

//     if (!userId) {
//       return new Response(JSON.stringify({ error: "Missing userId" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const file = await request.blob();
//     if (!file) {
//       return new Response(
//         JSON.stringify({ error: "Invalid or missing file" }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         },
//       );
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const body = new Uint8Array(arrayBuffer);

//     const uploadCommand = new PutObjectCommand({
//       Bucket: "audition",
//       Key: fileName,
//       Body: body,
//       ContentType: file.type,
//     });

//     await S3.send(uploadCommand);

//     // Cache and update user image
//     const imageUrl = `https://assets.voir.space/${fileName}`;
//     await prisma.user.update({
//       where: { id: userId },
//       data: { image: imageUrl },
//     });
//     await setCache(`user:${userId}:image`, JSON.stringify(imageUrl), 3600);

//     return new Response(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return new Response(JSON.stringify({ error: "Error uploading file" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
