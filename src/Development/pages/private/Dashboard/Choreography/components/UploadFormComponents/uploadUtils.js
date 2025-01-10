import { useContext } from "react";
import Context from "../../../../../../Context/Context";

export const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

export const uploadThumbnail = async (thumbnail, API) => {
  const {userData} = useContext(Context)
  try {
    const thumbnailResponse = await API.post('main', `/admin/upload-class-videos/${userData.institution}`, {
      body: {
        operation: 'GET_THUMBNAIL_URL',
        fileName: thumbnail.name,
        contentType: thumbnail.type
      }
    });

    if (!thumbnailResponse.presignedUrl || !thumbnailResponse.key) {
      throw new Error('Invalid response for thumbnail upload URL');
    }

    const uploadResponse = await fetch(thumbnailResponse.presignedUrl, {
      method: 'PUT',
      body: thumbnail,
      headers: {
        'Content-Type': thumbnail.type
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Thumbnail upload failed');
    }

    return thumbnailResponse.key;
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    throw new Error(`Failed to upload thumbnail: ${error.message}`);
  }
};
