import { prisma } from "../global/prisma";

export async function averageSounds() {
  // Using a tagged template literal for the query
  await prisma.$executeRaw`
    UPDATE "Album"
    SET "rating" = COALESCE((
      SELECT AVG("Entry"."rating")
      FROM "Record"
      INNER JOIN "Entry" ON "Record"."id" = "Entry"."recordId"
      WHERE "Record"."albumId" = "Album"."id"
      AND "Record"."type" = 'ENTRY'
    ), 0) 
  `;

  // Optionally, update the cache
  // Note: You'll need to implement a mechanism to fetch the updated ratings and cache them

  console.log("Album ratings updated successfully");
}
