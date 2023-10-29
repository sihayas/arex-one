const { ActivityType } = require("@prisma/client");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function heartRecord() {
  const userIds = [
    "clo9niaj40000x0wxbqv7eaz8",
    "clo9niamr0002x0wxovs4ou1h",
    "clo9pqf580000x0nj0zlk0wul",
    // "clo9pqf8d0002x0njpmlokud4",
    // "clo9pqfa80004x0njkcg273x4",
    // "clo9pqfc50006x0nj4zkk13j9",
    // "clo9pqfe20008x0nj77xucxzm",
  ]; // replace with actual user IDs
  const recordId = "clnxknw1g007zczjg3v4aenaf";
  const authorId = "5cab3874-5c32-4554-b004-4a3ff919c539";

  try {
    for (const userId of userIds) {
      if (authorId !== userId) {
        // Create a new heart
        const newHeart = await prisma.heart.create({
          data: {
            authorId: userId,
            recordId,
          },
        });

        // Create an activity outside of the loop
        const activity = await prisma.activity.create({
          data: {
            type: ActivityType.HEART,
            referenceId: newHeart.id,
          },
        });
        // Check if a notification for this activity and post already exists
        let existingNotification = await prisma.notification.findFirst({
          where: {
            AND: [
              {
                activity: {
                  type: ActivityType.HEART,
                  heart: {
                    recordId: recordId,
                  },
                },
              },
              {
                recipientId: authorId,
              },
            ],
          },
          include: {
            activity: {
              include: {
                heart: true,
              },
            },
          },
        });

        if (existingNotification) {
          // If it exists, update the users array
          await prisma.notification.update({
            where: {
              id: existingNotification.id,
            },
            data: {
              users: {
                push: [userId],
              },
            },
          });
        } else {
          // If it doesn't exist, create a new notification
          await prisma.notification.create({
            data: {
              recipientId: authorId,
              activityId: activity.id,
              users: [userId],
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error hearting record:", error);
  }

  await prisma.$disconnect();
}

// Execute the heartRecord function
heartRecord().catch(console.error);
