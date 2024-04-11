import { PrismaClient } from "@prisma/client";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { redis } from "@/lib/global/redis";

export default async function onRequestPost(request: any) {
  const { id, userId, authorId, type, referenceType } = await request.json();

  if (authorId === userId) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
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
    // Mark the entry as deleted
    const deletedAction = await prisma.action.update({
      where: {
        author_id_reference_id_type_reference_type: {
          author_id: userId,
          reference_id: id,
          type: type,
          reference_type: referenceType,
        },
      },
      data: { is_deleted: true },
    });

    if (!deletedAction) {
      return new Response(
        JSON.stringify({ success: false, message: "Action doesn't exist." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Remove heart from cache
    if (type === "heart") {
      const heartsKey = `user:${userId}:hearts`;
      await redis.srem(heartsKey, id);

      // Handle activity & notifications
      const key = `heart|${id}`;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting heart:", error);
    return new Response(JSON.stringify({ error: "Failed to create heart." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const runtime = "edge";
