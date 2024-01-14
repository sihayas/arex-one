import fs from "fs";
import path from "path";
import { createBlobServiceClient } from "@/lib/global/azure-storage";

export async function uploadDefaultImage() {
  const defaultImagePath = path.join(
    process.cwd(),
    "public",
    "images",
    "default_avi.jpg",
  );
  const fileBuffer = fs.readFileSync(defaultImagePath);
  const blobName = "default_avi.jpg";

  const blobServiceClient = createBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_NAME ?? "",
  );
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.upload(fileBuffer, fileBuffer.length);
    return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${blobName}`;
  } catch (error) {
    console.error("Error uploading default image:", error);
    throw new Error("Failed to upload default image");
  }
}
