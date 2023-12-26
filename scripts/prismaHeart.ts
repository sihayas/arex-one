//@ts-ignore
const { ActivityType } = require("@prisma/client");
//@ts-ignore
const { PrismaClient } = require("@prisma/client");
//@ts-ignore
const prisma = new PrismaClient();

async function heartRecord() {
  const userIds = [
    // "clo9niaj40000x0wxbqv7eaz8",
    // "clo9niamr0002x0wxovs4ou1h",
    "clo9pqf580000x0nj0zlk0wul",
    "clo9pqf8d0002x0njpmlokud4",
    "clo9pqfa80004x0njkcg273x4",
    // "clo9pqfc50006x0nj4zkk13j9",
    // "clo9pqfe20008x0nj77xucxzm",
  ];
  const replyId = "clpmfgror0006x0goy3lp6q0p";
  const authorId = "5cab3874-5c32-4554-b004-4a3ff919c539";

  try {
    for (const userId of userIds) {
      if (authorId !== userId) {
        // Create a new heart for the artifact
        const newHeart = await prisma.heart.create({
          data: { authorId: userId, replyId },
        });

        // Create an activity outside the loop
        const activity = await prisma.activity.create({
          data: {
            type: ActivityType.heart,
            referenceId: newHeart.id,
          },
        });

        const key = `heart|${replyId}`;

        await prisma.notification.create({
          data: {
            recipientId: authorId,
            activityId: activity.id,
            key,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error hearting artifact:", error);
  }

  await prisma.$disconnect();
}

// Execute the heartRecord function
heartRecord().catch(console.error);
