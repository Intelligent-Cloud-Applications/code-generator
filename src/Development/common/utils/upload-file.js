import { API } from "aws-amplify";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const fileUpload = async ({ bucket, region, folder, file }) => {
  const fileName = file.name;
  const fileType = file.type;
  let uploadId = "";
  let parts = [];

  if (!file) {
    return;
  }

  try {
    // 1. Start the multipart upload
    const startUploadResponse = await API.post("main", "/admin/upload-file", {
      body: {
        action: "INITIATE",
        bucket,
        region,
        folder,
        fileName,
        fileType,
      },
    });
    uploadId = startUploadResponse.uploadId;

    // 2. Split the file into chunks and upload them
    const totalParts = Math.ceil(file.size / CHUNK_SIZE);
    for (let i = 1; i <= totalParts; i++) {
      const start = (i - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      // Get the presigned URL for each part
      const presignedUrlResponse = await API.post(
        "main",
        "/admin/upload-file",
        {
          body: {
            action: "GET_PRESIGNED_URL",
            bucket,
            region,
            folder,
            fileName,
            partNumber: i,
            uploadId,
          },
        }
      );
      const { presignedUrl } = presignedUrlResponse;

      // Upload the part to S3 using the pre-signed URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: chunk,
      });

      parts.push({
        ETag: uploadResponse.headers.get("ETag"),
        PartNumber: i,
      });
    }

    // 3. Complete the multipart upload
    const completeUploadResponse = await API.post(
      "main",
      "/admin/upload-file",
      {
        body: {
          action: "COMPLETE",
          bucket,
          region,
          folder,
          fileName,
          uploadId,
          parts,
        },
      }
    );

    return completeUploadResponse.fileUrl;
  } catch (error) {
    console.error("FileUpload error", error);
  }
};

export default fileUpload;