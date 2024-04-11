import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { redis } from "@/lib/global/redis";

export default async function onRequestPost(request: any) {
  const data = await request.json();
  const { id, userId, authorId, type, referenceType } = await request.json();

  if (authorId === userId) {
    return new Response(
      JSON.stringify({ success: false, message: "Cannot heart your own." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const DB = process.env.DB as unknown as D1Database;
  if (!DB) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized, missing DB in environment",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      },
    );
  }

  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });

  try {
    const action = await prisma.action.create({
      data: {
        author_id: userId,
        reference_id: id,
        type: type,
        reference_type: referenceType,
      },
    });

    if (!action) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to create action." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (type !== "heart") {
      // Update user hearts cache
      const heartsKey = `user:${userId}:hearts`;
      await redis.sadd(heartsKey, id);

      const key = `heart|${id}`;
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating heart:", error);
    return new Response(JSON.stringify({ error: "Failed to create heart." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const runtime = "edge";
