// import { updateSpotlightAlbumScores } from "@/lib/cron/updateSpotlightAlbumScores";
// import { NextApiRequest, NextApiResponse } from "next";
//
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "POST" || req.method === "GET") {
//     try {
//       await updateSpotlightAlbumScores();
//       res
//         .status(200)
//         .json({ message: "Successfully updated spotlight album scores." });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Failed to update spotlight scores." });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed." });
//   }
// };
//
// export default handler;
