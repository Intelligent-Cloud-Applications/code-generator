// components/TextEditor/ImageUploader.jsx
import { Storage } from "aws-amplify";
import { toast } from "react-toastify";

export const uploadImage = async (file, folder) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const key = `${folder}/${fileName}`;
    toast.info("Uploading image...");
    await Storage.put(key, file, {
      contentType: file.type,
      level: "public",
    });


    let fileUrl = await Storage.get(key)
    fileUrl = fileUrl.split("?")[0];
    toast.success("Image uploaded successfully!");
    return { fileName, fileUrl, key };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteImage = async (key) => {
  try {
    toast.info("Deleting image...");
    await Storage.remove(key, { level: "public" });
    console.log("Deleted from S3:", key);
    toast.success("Image deleted successfully!");
    return true;
  } catch (error) {
    console.error(`Error deleting image from S3:`, error);
    return false;
  }
};
