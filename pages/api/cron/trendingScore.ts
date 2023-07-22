import { updateTrendingScores } from "@/lib/updateTrendingScore";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      await updateTrendingScores();
      res.status(200).json({ message: "Successfully updated trending score." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update trending score." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;
