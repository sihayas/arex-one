import { S3 } from "@/lib/global/r2client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/global/prisma";

export const runtime = "edge";

export default async function onRequest(request: any) {
  try {
    const file = await request.blob();
    if (!file) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing file" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);

    const uploadCommand = new PutObjectCommand({
      Bucket: "audition",
      Key: `uploads/test-${Date.now()}`,
      Body: body,
      ContentType: file.type,
    });

    await S3.send(uploadCommand);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({ error: "Error uploading file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
