export const runtime = "edge";
export async function onRequestPost(request: any) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid or missing file" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();

    const blobName = `uploads/${Date.now()}-${file.name}`;
    const contentType = file.type; // Use the original file's MIME type

    // Function to get the Azure upload URL
    const uploadUrl = await getAzureUploadUrl(blobName);

    // Perform the upload to Azure Blob Storage
    const azureResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "x-ms-blob-type": "BlockBlob",
      },
      body: arrayBuffer,
    });

    if (!azureResponse.ok) {
      throw new Error(
        `Failed to upload to Azure. Status: ${azureResponse.status}`,
      );
    }

    // Return the URL of the uploaded image
    return new Response(
      JSON.stringify({ success: true, url: uploadUrl.split("?")[0] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response(JSON.stringify({ error: "Error uploading image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
// Include your actual function for getting the Azure upload URL
async function getAzureUploadUrl(blobName: string) {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
  const sasToken = process.env.AZURE_SAS_TOKEN;

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}
