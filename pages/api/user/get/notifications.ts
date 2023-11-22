import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { groupBy } from "lodash";
import { User } from "@/types/dbTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: String(userId) },
      include: {
        activity: {
          include: {
            heart: {
              include: {
                author: true,
                record: { include: { album: true, track: true, entry: true } },
                reply: {
                  include: {
                    record: {
                      include: { album: true, track: true, entry: true },
                    },
                  },
                },
              },
            },
            follow: {
              include: {
                follower: true,
                following: true,
              },
            },
            reply: {
              include: {
                author: true,
                record: { select: { album: true, track: true, entry: true } },
              },
            },
          },
        },
      },
      orderBy: { activity: { createdAt: "desc" } },
    });

    // Group notifications by aggregation key
    const aggregatedNotifications = Object.entries(
      groupBy(notifications, "aggregation_Key"),
    ).map(([key, group]) => {
      // Initialize arrays for usernames and images
      const users: User[] = [];

      // Initialize variable for soundAppleId
      let soundAppleId: { type: string; id: string } | undefined;

      // Loop through each notification in the group
      group.forEach((n) => {
        const { type } = n.activity;

        // Initialize a variable to hold the specific activity data
        let specificActivity;

        // Check if the type is FOLLOWED or FOLLOWED_BACK to set the specific activity directly
        if (type === "FOLLOWED" || type === "FOLLOWED_BACK") {
          specificActivity = { follow: n.activity.follow };
        } else {
          // Access the specific activity based on the type for other activity types
          specificActivity = (n.activity as { [key: string]: any })[
            type.toLowerCase()
          ];
        }

        // Destructure author, record, reply, and follow from the specific activity
        const { author, record, reply, follow } = specificActivity || {};

        if (author) {
          users.push(author);
        } else if (follow) {
          users.push(follow.follower);
        }

        // Get albumId and trackId from record or reply
        const albumId = record?.album?.appleId || reply?.record.album?.appleId;
        const trackId = record?.track?.appleId || reply?.record.track?.appleId;

        // If albumId exists, set soundAppleId to album type
        if (albumId) {
          soundAppleId = { type: "album", id: albumId };
        }
        // If trackId exists, set soundAppleId to song type
        else if (trackId) {
          soundAppleId = { type: "song", id: trackId };
        }
      });

      // Return the aggregated notification
      return {
        users: users.slice(0, 4),
        count: group.length,
        activity: group[0].activity,
        aggregation_Key: key,
        soundAppleId,
      };
    });

    // Send the aggregated notifications as the response
    return res.status(200).json(aggregatedNotifications);
  } catch (error) {
    // Log the error and send a 500 status code with an error message
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Error fetching notifications." });
  }
}
