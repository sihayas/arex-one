const { PrismaClient } = require("@prisma/client");
const { ActivityType } = require("@prisma/client");

const prisma = new PrismaClient();

async function replyChain() {
  const userIds = [
    "clo9niaj40000x0wxbqv7eaz8",
    "clo9niamr0002x0wxovs4ou1h",
    "clo9pqf580000x0nj0zlk0wul",
  ]; // replace with actual user IDs
  const recordId = "clnzqay3601xpczjgp83jj4uu";
  const authorId = "5cab3874-5c32-4554-b004-4a3ff919c539";
  let rootReplyId = null;
  let lastReplyId = null;

  try {
    for (let i = 0; i < userIds.length; i++) {
      const newReply = (await prisma.reply.create({
        data: {
          authorId: userIds[i],
          recordId,
          replyToId: lastReplyId,
          content: `This is a reply from user ${userIds[i]}`,
        },
      })) as any;

      // If it's the first reply, update its rootReplyId to its own id
      if (i === 0) {
        await prisma.reply.update({
          where: {
            id: newReply.id,
          },
          data: {
            rootReplyId: newReply.id,
          },
        });
        rootReplyId = newReply.id;
      } else {
        // If it's not the first reply, set its rootReplyId to the rootReplyId
        await prisma.reply.update({
          where: {
            id: newReply.id,
          },
          data: {
            rootReplyId: rootReplyId,
          },
        });
      }

      // Create an activity for the new reply
      const activity = await prisma.activity.create({
        data: {
          type: ActivityType.REPLY,
          referenceId: newReply.id,
        },
      });

      // Create a notification for the author of the replied-to post
      if (lastReplyId) {
        await prisma.notification.create({
          data: {
            recipientId: lastReplyId,
            activityId: activity.id,
          },
        });
      }

      // Update lastReplyId for the next iteration
      lastReplyId = newReply.id;
    }
  } catch (error) {
    console.error("Error creating reply chain:", error);
  }

  await prisma.$disconnect();
}

// Execute the replyChain function
replyChain().catch(console.error);
