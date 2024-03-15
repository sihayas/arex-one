import { prisma } from "@/lib/global/prisma";

export async function onRequestPatch(request: any) {
  const { artifactId } = await request.json();

  try {
    const updatedArtifact = await prisma.artifact.update({
      where: {
        id: artifactId,
      },
      data: {
        isDeleted: true,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Artifact successfully marked as deleted.",
        updatedArtifact,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to mark the artifact as deleted:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update artifact status." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "edge";
