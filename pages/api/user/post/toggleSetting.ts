import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/global/prisma";
import { SettingKey } from "@/components/interface/user/render/Settings";

export default async function toggleSetting(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId, settingKey }: { userId: string; settingKey: SettingKey } =
    req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    // Fetch the user's settings
    const settings = await prisma.settings.findUnique({
      where: { userId: userId },
    });

    if (!settings) {
      return res.status(404).json({ error: "Settings not found." });
    }

    // Toggle the specified setting
    settings[settingKey] = !settings[settingKey];

    // Save the updated settings
    const updatedSettings = await prisma.settings.update({
      where: { userId: userId },
      data: settings,
    });

    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error toggling setting:", error);
    return res.status(500).json({ error: "Error toggling setting." });
  }
}
