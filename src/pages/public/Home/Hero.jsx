import React, { useContext, useEffect, useState, useRef } from "react";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import { API } from "aws-amplify";
import { Button, Modal, FileInput, Label, TextInput } from "flowbite-react";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

const Hero = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const [contentSrc, setContentSrc] = useState(`${InstitutionData.videoUrl}`);
  const [isVideo, setIsVideo] = useState(false);
  const Loader = useContext(Context).util;

  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";
  const [modalShow, setModalShow] = useState(false);

  const [tagline, setTagline] = useState(InstitutionData.TagLine);
  const [tagline1, setTagline1] = useState(InstitutionData.TagLine1);
  const [videoURL, setVideoURL] = useState(InstitutionData.videoUrl);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const isVideoFile = contentSrc.match(/\.(mp4|webm|ogg)$/);
    setIsVideo(isVideoFile);

    if (isVideoFile) {
      const highResVideo = new Image();
      highResVideo.src = `${InstitutionData.videoUrl}`;
      highResVideo.onload = () => {
        setContentSrc(`${InstitutionData.videoUrl}`);
      };
    }
  }, [InstitutionData.videoUrl, contentSrc]);

  const initiateMultipartUpload = async (file) => {
    try {
      const response = await API.post("main", "/admin/upload-hero-videos/happyprancer", {
        body: {
          operation: "INITIATE_VIDEO_UPLOAD",
          fileName: file.name,
          contentType: file.type
        }
      });
      return response;
    } catch (error) {
      console.error("Error initiating upload:", error);
      throw error;
    }
  };

  const getUploadUrl = async (uploadId, partNumber, key) => {
    try {
      const response = await API.post("main", "/admin/upload-hero-videos/Bworkz", {
        body: {
          operation: "GET_VIDEO_UPLOAD_URL",
          uploadId,
          partNumber,
          key
        }
      });
      return response.presignedUrl;
    } catch (error) {
      console.error("Error getting upload URL:", error);
      throw error;
    }
  };

  const uploadPart = async (presignedUrl, part) => {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: part,
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      
      const etag = response.headers.get('ETag');
      return etag ? etag.replaceAll('"', '') : null;
    } catch (error) {
      console.error("Error uploading part:", error);
      throw error;
    }
  };

  const completeMultipartUpload = async (uploadId, key, parts) => {
    try {
      const response = await API.post("main", "/admin/upload-hero-videos/Bworkz", {
        body: {
          operation: "COMPLETE_VIDEO_UPLOAD",
          uploadId,
          key,
          parts
        }
      });
      return response;
    } catch (error) {
      console.error("Error completing upload:", error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("File selected:", file);
    Loader.setLoader(true);
    setUploadProgress(0);

    try {
      // Step 1: Initiate multipart upload
      const { uploadId, key } = await initiateMultipartUpload(file);

      // Step 2: Split file into chunks and upload
      const parts = [];
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
        const start = (partNumber - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Get presigned URL for this part
        const presignedUrl = await getUploadUrl(uploadId, partNumber, key);

        // Upload the chunk
        const etag = await uploadPart(presignedUrl, chunk);

        parts.push({
          PartNumber: partNumber,
          ETag: etag
        });

        // Update progress
        setUploadProgress((partNumber / totalChunks) * 100);
      }

      // Step 3: Complete multipart upload
      const result = await completeMultipartUpload(uploadId, key, parts);
      
      // Update video URL
      setVideoURL(result.videoUrl);
      toast.success("Video uploaded successfully!", {
        className: "custom-toast",
      });

    } catch (error) {
      console.error("Error during file upload:", error);
      toast.error("Error uploading video. Please try again.", {
        className: "custom-toast",
      });
    } finally {
      Loader.setLoader(false);
      setUploadProgress(0);
    }
  };

  const handleUpdateHeroSection = async () => {
    Loader.setLoader(true);
    try {
      const data = {
        institutionid: InstitutionData.InstitutionId,
        TagLine: tagline,
        TagLine1: tagline1,
        videoUrl: videoURL || InstitutionData.videoUrl,
      };
      const response = await API.put(
        "awsaiapp",
        "/user/development-form/hero-page",
        {
          body: data,
        }
      );
      console.log("API Call Successful", response);
      toast.success("Hero section updated successfully.", {
        className: "custom-toast",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating hero section:", error);
      toast.error("Error updating hero section. Please try again.", {
        className: "custom-toast",
      });
    } finally {
      Loader.setLoader(false);
    }
  };

  function onCloseModal() {
    setModalShow(false);
  }

  return (
    <>
      <Modal show={modalShow} size="lg" onClose={onCloseModal} popup>
        <Modal.Header className="py-4 px-4">Update Hero Section</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div id="fileUpload" className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload video" />
              </div>
              <FileInput
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                helperText="Upload a video file (MP4, WebM, OGG)"
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Uploading: {uploadProgress.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="text" value="Primary Tagline" />
              </div>
              <TextInput
                color={"primary"}
                id="text"
                type="text"
                value={tagline}
                placeholder="Enter Primary Tagline"
                onChange={(e) => setTagline(e.target.value)}
                required
                rightIcon={MdEdit}
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="text" value="Secondary Tagline" />
              </div>
              <TextInput
                color={"primary"}
                id="text"
                type="text"
                value={tagline1}
                placeholder="Enter Secondary Tagline"
                onChange={(e) => setTagline1(e.target.value)}
                required
                rightIcon={MdEdit}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={"primary"}
            onClick={() => {
              setModalShow(false);
              handleUpdateHeroSection();
            }}
          >
            Update
          </Button>
          <Button color={"secondary"} onClick={onCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className={`flex items-center justify-center h-[30rem] pb-20 relative`}>
        {isAdmin && (
          <Button
            color={"primary"}
            className="absolute top-4 right-4"
            onClick={() => setModalShow(true)}
          >
            <div className="flex gap-2 justify-center items-center">
              <MdEdit size={18} />
              Edit
            </div>
          </Button>
        )}
        <div className={`absolute z-10 flex flex-col items-center w-screen content`}>
          <div className={`w-[auto] text-left flex flex-column`}>
            <h1 className={`w-full max1250:w-[50%] max536:w-[90vw] max800:w-[80%] text-[5.5rem] max800:text-[3.6rem] max1250:text-[4.2rem] text-white text-center`}>
              {InstitutionData.TagLine}
            </h1>
            <p className={`w-full italic max1250:w-[80%] max1250:ml-14 max536:w-[80vw] max536:text-center max536:ml-6 max800:w-[80%] text-[1.7rem] max800:text-[1.1rem] text-white max536:mt-2`}>
              {InstitutionData.TagLine1 || ""}
            </p>
          </div>
        </div>
        <div className={`-z-10`}>
          {isVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline={true}
              controls={false}
              className={`object-cover object-top h-[38rem] w-screen max-w-screen max600:h-[35rem]`}
              preload="metadata"
            >
              <source src={contentSrc} type="video/mp4" />
            </video>
          ) : (
            <img
              src={contentSrc}
              alt="bg-img"
              className={`object-cover object-top h-[38rem] w-screen bg-[#000000] max-w-screen`}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Hero;