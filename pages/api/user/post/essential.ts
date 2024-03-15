import { prisma } from "@/lib/global/prisma";

export default async function onRequest(request: any) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { userId, prevEssentialId, appleId, rank } = await request.json();

  if (typeof rank !== "number" || rank < 0 || rank > 2) {
    return new Response(JSON.stringify({ error: "Invalid rank." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const appleAlbum = await prisma.sound.findFirst({ where: { appleId } });
    if (!appleAlbum) {
      return new Response(JSON.stringify({ error: "Album not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.essential.deleteMany({ where: { id: prevEssentialId } });

    const newEssential = await prisma.essential.create({
      data: { userId, soundId: appleAlbum.id, rank },
    });

    return new Response(JSON.stringify(newEssential), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error changing essential:", error);
    return new Response(
      JSON.stringify({ error: "Error changing essential." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "edge";
