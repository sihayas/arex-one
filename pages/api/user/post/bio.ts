import { prisma } from "@/lib/global/prisma";

export default async function onRequest(request: any) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { userId, bio } = await request.json();

  if (typeof bio !== "string" || bio.length > 240) {
    return new Response(JSON.stringify({ error: "Invalid bio." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { bio },
    });
    console.log("Successfully updated bio for user:", updatedUser);
    return new Response(
      JSON.stringify({ message: "Bio updated successfully." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error updating bio:", error);
    return new Response(JSON.stringify({ error: "Error updating bio." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const runtime = "edge";
