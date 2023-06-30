import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, username } = req.body;

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password,
        username,
      },
    });

    // Send response
    res.status(200).json(user);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
