import React, { useState, useEffect, useContext, useRef } from "react";
import { API, Storage } from "aws-amplify";
import dancebg from "../../../utils/images/dancebg.jpg";
import "./Gallery.css";
import Spinner from "../../../spinner";
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import Context from "../../../Context/Context";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import InstitutionContext from "../../../Context/InstitutionContext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Gallery = () => {
  const [uploading, setUploading] = useState(false);
  const {
    getImagesFromAPI,
    tempImgSrc,
    setTempImgSrc,
    imageUrls,
    setImageUrls,
    title,
    setTitle,
    description,
    setDescription,
  } = useContext(Context);
  const [img, setImg] = useState();
  const [model, setModel] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const userData = useContext(Context);
  const user = userData.userData;
  const [selectedFile, setSelectedFile] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const bucketName = "team-dev-testing";
  const region = "us-east-2";
  const institution = user.institution;
  const { institutionData: InstitutionData } = useContext(InstitutionContext);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getImagesFromAPI();
      setLoading(false);
    };

    console.log("Fetching images...");
    console.log("User data:", user);
    if (user && user.userType === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    console.log("isAdmin after setting:", isAdmin);
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log("File selected:", file);

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please upload an image of less than 5MB size.", {
        className: "custom-toast",
      });
      return;
    }

    const folderPath = `${user.institution}`;
    const existingImageNames = imageUrls.map((url) => url.split("/").pop());

    if (existingImageNames.includes(file.name)) {
      toast.error("Selected image already exists.", {
        className: "custom-toast",
      });
      return (fileInputRef.current.value = "");
    }
    setShowInput(true);
    if (imageUrls.length >= 25) {
      toast.error("Maximum limit reached. You can upload up to 25 images.", {
        className: "custom-toast",
      });
      return;
    }

    setUploading(true);
    try {
      console.log("Uploading image:", file.name);
      await Storage.put(`${folderPath}/${file.name}`, file, {
        contentType: "image/jpeg",
        bucket: bucketName,
        region: region,
        ACL: "public-read",
      });
      console.log("Image uploaded successfully.");

      const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/public/${folderPath}/${file.name}`;
      setSelectedFile(imageUrl);
      console.log(title);
      console.log(description);
      console.log("API call successful.");
      await getImagesFromAPI();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false); // Ensure this is called to stop the spinner
    }
  };

  const uploadImageDataToAPI = async () => {
    const filename = selectedFile.split("/").pop();

    try {
      const data = {
        institution: institution,
        title: title,
        description: description,
        imageUrl: filename,
        imgLink: selectedFile,
      };

      await API.post("user", `/admin/upload-image/${institution}`, {
        body: data,
      });
      setTitle("");
      setDescription("");
      setSelectedFile(""); // Reset the selected file
    } catch (error) {
      console.error("Error uploading image data to API: ", error);
    } finally {
      getImagesFromAPI();
      setTempImgSrc("");
      setUploading(false); // Ensure this is called to stop the spinner
    }
  };

  const getImg = (imageUrl) => {
    setTempImgSrc(imageUrl);
    setModel(true);
    setImg(imageUrl);
    getImagesFromAPI(imageUrl);
  };

  const handleDelete = async (tempImgSrc) => {
    console.log("Deleting image:", tempImgSrc);
    try {
      const key = img.split(
        `https://${bucketName}.s3.${region}.amazonaws.com/public/`
      )[1];
      await Storage.remove(key, {
        bucket: bucketName,
        region: region,
      });
      setImageUrls((prevUrls) => prevUrls.filter((url) => url !== tempImgSrc));
      setSelectedFile("");
      // Fetch updated image list after deletion
      getImagesFromAPI();
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
    setModel(false);
  };

  const dataDelete = async (tempImgSrc) => {
    console.log(tempImgSrc);
    try {
      await API.del("user", `/admin/delete-image/${institution}`, {
        body: {
          imageUrl: tempImgSrc,
        },
      });
    } catch (error) {
      console.log(error);
    }
    handleDelete(tempImgSrc);
  };

  const handleCancelUpload = () => {
    setShowInput(false);
    setSelectedFile("");
    setTitle("");
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <NavBar />
      <div className="w-full overflow-hidden flex justify-center">
        <div className="w-full overflow-hidden flex justify-center items-center">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={dancebg}
            alt=""
          />
          <div
            className="absolute inset-0"
            style={{ backdropFilter: "blur(5px)" }}
          ></div>
          <div className={model ? "model open" : "model"}>
            <div className="flex justify-between gap-3 max950:flex-col max950:items-center ">
              <div>
                <img src={tempImgSrc} alt="" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="white"
                  className="close-btn w-10 h-10 z-[200]"
                  onClick={() => {
                    setModel(false);
                    setTitle("");
                    setDescription("");
                  }}
                >
                  <path
                    strokeLinecap=""
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
                {isAdmin && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className="del-btn w-8 h-8 z-[200]"
                    onClick={() => dataDelete(tempImgSrc)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                )}
              </div>
              {(title || description) && (
                <div className="flex p-4 flex-col gap-4 justify-center z-[50] text-white w-[60rem] max950:w-[90vw]">
                  {title && (
                    <div className="text-[1.5rem] text-center border border-white bg-[#dbdbdb] text-black font-[700] uppercase">
                      {title}
                    </div>
                  )}
                  {description && (
                    <div
                      className="bg-[#3d3d3d62] p-3 text-[1.1rem] border border-white text-justify"
                      style={{
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(5px)",
                      }}
                    >
                      {description}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {showInput && (
            <div
              className="absolute flex flex-col justify-center items-center z-[200] w-[100vw] h-[100vh] bg-[#00000091]"
              style={{
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(5px)",
              }}
            >
              {uploading ? (
                <div
                  className="w-[50vw] h-[35rem] flex flex-col justify-center items-center bg-[#ffffff6e] rounded-lg max600:w-[90vw]"
                  style={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  <Spinner />
                </div>
              ) : null}
              <img
                className="min600:max-w-[25vw] min600:max-h-[34rem] max600:w-[90vw] max600:mt-9"
                src={selectedFile}
                alt=""
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="absolute cursor-pointer top-[7%] right-5 w-10 h-10 z-[200]max600:right-1"
                onClick={handleCancelUpload}
              >
                <path
                  strokeLinecap=""
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              <div className="flex gap-4 justify-center items-center mt-3 flex-col ">
                <div className="flex gap-4 justify-center items-center max600:flex-col">
                  <input
                    className="h-[3rem] p-[1rem] border border-white w-[25vw] bg-[#0000009d] text-[white] max600:w-[90vw]"
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    className="scroolbar h-[6rem] p-[1rem] border border-white w-[25vw] bg-[#0000009d] text-[white] max600:w-[90vw]"
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button
                  className="w-[52vw] text-white font-bold p-2  max600:w-[90vw]"
                  style={{ background: InstitutionData.LightPrimaryColor }}
                  onClick={() => {
                    setUploading(true);
                    setShowInput(false);
                    uploadImageDataToAPI(selectedFile);
                  }}
                >
                  Upload
                </button>
              </div>
            </div>
          )}
          <div className="scroolbar p-8 w-[95vw] h-[87vh] m-auto z-50 max600:flex max600:w-[100vw]">
            {imageUrls.length === 0 && isAdmin && (
              <div className="w-[20rem] h-[14rem]">
                <label
                  className="upload cursor-pointer flex text-black text-[1.2rem] font-semibold flex-col justify-center items-center w-[22.5vw] h-[30vh] mb-1 mt-1 bg-[#ffffff6e] max1194:w-[28vw] max1194:h-[20vh]"
                  style={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}

            <div className="max600:w-[100vw] ">
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3, 1200: 4 }}
              >
                <Masonry>
                  {imageUrls.length > 0 && isAdmin && (
                    <label
                      className="upload cursor-pointer flex text-black text-[1.2rem] font-semibold flex-col justify-center items-center w-[22.5vw] h-[30vh] mb-1 mt-1 bg-[#ffffff6e] max1194:w-[28vw] max1194:h-[20vh]"
                      style={{
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(5px)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                  {imageUrls.length > 0 &&
                    imageUrls.map((imageUrl, index) => (
                      <div key={index}>
                        {loading ? (
                          <SkeletonTheme
                            baseColor="#bcbcbc"
                            highlightColor="#a6a6a6"
                          >
                            <div className="relative flex justify-center items-center">
                              <Skeleton height="30vh" width="22vw" />
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.3}
                                stroke="gray"
                                className="absolute w-10 top-[45%]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                              </svg>
                            </div>
                          </SkeletonTheme>
                        ) : (
                          <LazyLoadImage
                            className="w-[21w] p-1 object-cover"
                            src={imageUrl}
                            effect="blur"
                            onClick={() => getImg(imageUrl)}
                            alt=""
                            style={{
                              display:
                                imageUrls.length === 0 ? "none" : "block",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  {uploading ? (
                    <div
                      className="h-[25rem] w-[25rem] flex flex-col justify-center items-center bg-[#ffffff3f] "
                      style={{
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(5px)",
                      }}
                    >
                      <Spinner />
                    </div>
                  ) : null}
                </Masonry>
              </ResponsiveMasonry>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
