import { BlobServiceClient } from "@azure/storage-blob";

export const createBlobServiceClient = () => {
  return BlobServiceClient.fromConnectionString(
    process.env.AZURE_CONNECTION_STRING ?? "",
  );
};
