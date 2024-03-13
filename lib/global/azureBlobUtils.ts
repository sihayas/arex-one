// async function uploadToAzureBlobStorage(blobName, fileBuffer, contentType) {
//   const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
//   const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
//   const sasToken = process.env.AZURE_SAS_TOKEN;
//
//   const url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
//
//   const response = await fetch(url, {
//     method: "PUT",
//     headers: {
//       "Content-Type": contentType,
//       "x-ms-blob-type": "BlockBlob",
//       "Content-Length": fileBuffer.length.toString(),
//     },
//     body: fileBuffer,
//   });
//
//   if (!response.ok) {
//     throw new Error(`Failed to upload blob. Status: ${response.status}`);
//   }
//
//   return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
// }
