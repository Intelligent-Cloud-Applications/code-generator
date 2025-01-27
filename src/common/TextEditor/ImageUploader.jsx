// components/TextEditor/ImageUploader.jsx
import { Storage } from "aws-amplify";

export const uploadImage = async (file, folder) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const key = `${folder}/${fileName}`;

    await Storage.put(key, file, {
      contentType: file.type,
      level: "public",
    });

    const fileUrl = await Storage.get(key);
    return { fileName, fileUrl, key };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteImage = async (key) => {
  try {
    await Storage.remove(key, { level: "public" });
    console.log("Deleted from S3:", key);
    return true;
  } catch (error) {
    console.error(`Error deleting image from S3:`, error);
    return false;
  }
};
