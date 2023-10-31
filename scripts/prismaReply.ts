const { PrismaClient } = require("@prisma/client");
const { ActivityType } = require("@prisma/client");

const prisma = new PrismaClient();

async function replyChain() {
  const userIds = [
    "clo9niaj40000x0wxbqv7eaz8",
    "clo9niamr0002x0wxovs4ou1h",
    "clo9pqf580000x0nj0zlk0wul",
  ];
  const recordId = "clodcje5z000qczoc3vdnfohy";
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

      if (i === 0) {
        await prisma.reply.update({
          where: { id: newReply.id },
          data: { rootReplyId: newReply.id },
        });
        rootReplyId = newReply.id;
      } else {
        await prisma.reply.update({
          where: { id: newReply.id },
          data: { rootReplyId: rootReplyId },
        });
      }

      const activity = await prisma.activity.create({
        data: {
          type: ActivityType.REPLY,
          referenceId: newReply.id,
        },
      });

      const aggregationKey = `REPLY|${newReply.id}|${authorId}`;

      await prisma.notification.create({
        data: {
          recipientId: authorId,
          activityId: activity.id,
          aggregation_Key: aggregationKey,
        },
      });

      lastReplyId = newReply.id;
    }
  } catch (error) {
    console.error("Error creating reply chain:", error);
  }

  await prisma.$disconnect();
}

// Execute the replyChain function
replyChain().catch(console.error);
