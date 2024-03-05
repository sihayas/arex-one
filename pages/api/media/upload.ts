import { createBlobServiceClient } from "@/lib/global/azure-storage";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const file = req.body.file; // Assuming you're sending the file as a buffer or string

  const blobServiceClient = createBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient("voir-media");
  const blobName = `${uuidv4()}.jpg`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const uploadBlobResponse = await blockBlobClient.upload(
      file.buffer,
      file.size,
    );
    const imageUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${blobName}`;

    // Return the image URL or store it in the database as needed
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file" });
  }
}

async function uploadToAzure(
  data: Blob | BufferSource | ReadableStream<Uint8Array> | string,
) {
  const response = await fetch("/api/upload", {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    throw new Error("Failed to upload to Azure Blob Storage");
  }

  return response.json();
}

// // export const runtime = "edge";
