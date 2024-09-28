import React, { useContext, useEffect, useState, useRef } from "react";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import { API, Storage } from "aws-amplify";
import { Button, Modal, FileInput, Label, TextInput } from "flowbite-react";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    console.log("File selected:", file);
    Loader.setLoader(true);

    const url = InstitutionData.videoUrl?.split(
      `https://institution-utils.s3.amazonaws.com/public/`
    )[1];
    const key = decodeURI(url);
    await Storage.remove(key, {
      bucket: "institution-utils",
      region: "us-east-1",
    });

    const folderPath = `${InstitutionData.InstitutionId}/images`;

    try {
      console.log("Uploading file...", file.name, file.type);
      await Storage.put(`${folderPath}/${file.name}`, file, {
        contentType: file.type,
        bucket: "institution-utils",
        region: "us-east-1",
      });
      console.log("File uploaded successfully.");
      const url = `https://institution-utils.s3.amazonaws.com/public/${folderPath}/${file.name}`;
      const vidUrl = encodeURI(url);
      setVideoURL(vidUrl);
      console.log("Video URL:", vidUrl);

      console.log("API Call Successful");
    } catch (e) {
      console.error("Error uploading file:", e);
      toast.error("Error uploading file. Please try again.", {
        className: "custom-toast",
      });
    } finally {
      Loader.setLoader(false);
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
      Loader.setLoader(false);
    } catch (error) {
      console.error("Error updating hero section:", error);
      toast.error("Error updating hero section. Please try again.", {
        className: "custom-toast",
      });
    }
  };

  function onCloseModal() {
    setModalShow(false);
  }

  return (
    <>
      {/* Model for updating the hero section */}
      <Modal show={modalShow} size="lg" onClose={onCloseModal} popup>
        <Modal.Header className="py-4 px-4">Update Hero Section</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div id="fileUpload" className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload file" />
              </div>
              <FileInput
                ref={fileInputRef}
                onChange={handleFileChange}
                value={fileInputRef.current?.value}
                helperText={"Leave empty to keep the same"}
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="text" value="Primary Tagline" />
              </div>
              <TextInput
                color={"primary"}
                id="text"
                type="text"
                //icon={HiUser}
                value={tagline}
                placeholder="Enter Name"
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
                //icon={MdVerified}
                value={tagline1}
                placeholder="Enter Position"
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

      <div
        className={`flex items-center justify-center h-[30rem] pb-20 relative`}
      >
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
        <div
          className={`absolute z-10 flex flex-col items-center w-screen content`}
        >
          <div className={`w-[auto] text-left flex flex-column`}>
            {/* <p className={`w-full italic max1250:w-[50%] max536:w-[90vw] max536:mr-5  max800:w-[80%]  text-[2rem] max800:text-[1.2rem] max1250:text-[1.8rem text-white`}>{InstitutionData.TagLine1 || ""}</p> */}
            <h1
              className={`w-full max1250:w-[50%] max536:w-[90vw] max800:w-[80%] text-[5.5rem] max800:text-[3.6rem] max1250:text-[4.2rem] text-white text-center`}
            >
              {InstitutionData.TagLine}
            </h1>
            {/* only for happyprancer comment it for other institutions */}
            <p
              className={`w-full italic max1250:w-[80%] max1250:ml-14 max536:w-[80vw] max536:text-center max536:ml-6 max800:w-[80%] text-[1.7rem] max800:text-[1.1rem] text-white max536:mt-2`}
            >
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
              className={`object-cover object-top h-[38rem] w-screen bg-[#000000]  max-w-screen`}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Hero;
