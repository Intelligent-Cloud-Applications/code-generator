import { API, Auth, Storage } from "aws-amplify";
import { Label, Modal, TextInput, Tooltip } from "flowbite-react";
import React, { useContext, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { Button2 } from "../../../../common/Inputs";
import Context from "../../../../Context/Context";
import InstitutionContext from "../../../../Context/InstitutionContext";
import EditableInput from "./EditableInput";
import HybridReferral from "../../../../common/ReferralCode/HybridReferral.jsx";
import ReferralCode from "../../../../common/ReferralCode/index.jsx";
import "./index.css";
import EditableTextArea from "./EditableTextArea.jsx";
import institutionData from "../../../../constants.js";
// import EditProfile from "./EditProfile.jsx";
import InsrtuctorReferral from "../../../../common/ReferralCode/index.jsx";

const ProfileUpdate = ({ setClick, displayAfterClick }) => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Ctx = useContext(Context);
  const UserCtx = useContext(Context).userData;
  const UtilCtx = useContext(Context).util;
  const { userData, setUserData } = useContext(Context);
  const [name, setName] = useState(UserCtx.userName);
  const [country] = useState(UserCtx.country);
  const [currentEmail, setCurrentEmail] = useState(UserCtx.emailId);
  const [showForm, setShowForm] = useState(false);
  const [about, setAbout] = useState(
    UserCtx.hasOwnProperty("about") && UserCtx.about
  );

  const [image, setImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);
  // Current function
  const getInitials = (name) => {
    const names = name?.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
    return initials;
  };

  // Add this function right after getInitials
  const getColor = (name) => {
    if (!name) return "#888888";
    const colors = [
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF5733",
      "#33FF57",
      "#5733FF",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  let domain;
  if (process.env.NODE_ENV === "development") {
    domain = "http://localhost:3000";
  } else if (process.env.REACT_APP_STAGE === "DEV") {
    domain = institutionData.BETA_DOMAIN;
  } else if (process.env.REACT_APP_STAGE === "PROD") {
    domain = institutionData.PROD_DOMAIN;
  }

  let referralLink;
  if (userData.userType === "instructor") {
    referralLink = `${domain}/hybrid/?institution=${userData.institution}&referral=${userData.referral_code}`;
  }

  const formatDate = (epochDate) => {
    epochDate = Number(epochDate);
    if (!epochDate) return "";
    const date = new Date(epochDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Format day and month with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const userLocation =
      localStorage.getItem("userLocation") || UserCtx?.location?.countryCode;
    return userLocation === "IN"
      ? `${formattedDay}/${formattedMonth}/${year}`
      : `${formattedMonth}/${formattedDay}/${year}`;
  };
  const fileInputRef = useRef(null);
  const [joiningDate] = useState(formatDate(UserCtx?.joiningDate));
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

  const [dob, setDob] = useState(UserCtx.dob || "");
  const [address, setAddress] = useState(UserCtx.address || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [err, setErr] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(UserCtx.phoneNumber);
  const [phoneCode, setPhoneCode] = useState("");
  const [isPhoneChange, setIsPhoneChange] = useState(false);
  const [isPhoneCode, setIsPhoneCode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [name, setName] = useState("John Doe"); // Default name
  const [useEditableInput, setUseEditableInput] = useState(true);

  const [tempDob, setTempDob] = useState(
    dob ? new Date(Number(dob)).toISOString().split("T")[0] : ""
  );

  const ifDataChanged = () => {
    return !(
      name.trim() === UserCtx.userName.trim() &&
      phoneNumber.trim() === UserCtx.phoneNumber &&
      country.trim() === UserCtx.country &&
      joiningDate.trim() === UserCtx.joiningDate &&
      Number(dob) === Number(UserCtx.dob) && // Directly compare as epoch timestamps
      address.trim() === UserCtx.address
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = () => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImage = canvasScaled.toDataURL();
      // Save the cropped image to your state or send it to the server
      handleFileUpload(croppedImage);
      // Now you can use croppedImage as needed
    }
  };

  const handleCancel = () => {
    // Reset state variables and close the modal
    setImage(null);
    setEditor(null);
  };

  const handleFileUpload = async (base64File) => {
    UtilCtx.setLoader(true);
    try {
      // Validate file size (less than 5MB)
      if (base64File.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit.");
      }
      console.log(base64File);

      // Get the current authenticated user
      const currentUser = await Auth.currentAuthenticatedUser();
      console.log(currentUser);
      const cognitoId = currentUser.attributes?.sub || currentUser.userName; // Cognito User ID
      console.log(cognitoId);

      const blob = await fetch(base64File).then((res) => res.blob());
      console.log(blob);
      // Upload the file to S3 with the filename as Cognito User ID
      const response = await Storage.put(
        `${InstitutionData.InstitutionId}/${cognitoId}/profile.jpg?v=` +
          new Date().getTime(),
        blob,
        {
          level: "public", // or "protected" depending on your access needs
          region: "us-east-1",
          contentType: blob.type,
          ACL: "public-read",
        }
      );
      console.log(`Response is ${response}`);

      // Get the URL of the uploaded file
      let imageUrl = await Storage.get(response.key);
      console.log(`The image url is ${imageUrl}`);
      imageUrl = imageUrl.split("?")[0];

      const apiResponse = await API.put(
        "main",
        `/user/profile/img/${InstitutionData.InstitutionId}`,
        {
          body: {
            imgUrl: imageUrl,
          },
        }
      );
      console.log(apiResponse);
      // setProfileImageUrl(imageUrl);
      const tempUser = { ...UserCtx, imgUrl: imageUrl };
      console.log(tempUser);
      Ctx.setUserData(tempUser);
      // setImageKey(Date.now());
    } catch (error) {
      console.error("Error uploading profile picture: ", error);
    } finally {
      UtilCtx.setLoader(false);
      setImage(null);
    }
  };

  const onProfileUpdate = async (e) => {
    e.preventDefault();

    UtilCtx.setLoader(true);
    if (ifDataChanged()) {
      if (phoneNumber.length >= 10) {
        try {
          const formattedDob = tempDob
            ? String(new Date(tempDob).getTime())
            : "";

          const userdata = await API.put(
            "main",
            `/user/profile/${InstitutionData.InstitutionId}`,
            {
              body: {
                emailId: UserCtx.emailId,
                userName: name,
                phoneNumber: phoneNumber,
                country: country,
                joiningDate: joiningDate,
                dob: formattedDob,
                address: address,
                about: about,
              },
            }
          );
          const showBirthdayModal = await API.post(
            "main",
            `/user/birthday-message/${InstitutionData.InstitutionId}`
          );
          const data = { ...userdata.Attributes, showBirthdayModal };

          Ctx.setUserData(data);
          setDob(formattedDob);
          toast.info("Updated");
          UtilCtx.setLoader(false);
        } catch (e) {
          console.log(e);
          toast.warn(e.message);
          UtilCtx.setLoader(false);
        }
      } else {
        toast.warn("Entered Phone Number is Not Valid");
        UtilCtx.setLoader(false);
      }
    } else {
      toast.warn("Nothing is to be changed");
      UtilCtx.setLoader(false);
    }
  };

  const passwordValidator = () => {
    if (password.length < 8) {
      setErr("Password is too Short");
      return false;
    } else if (password !== confirmPassword) {
      setErr("Password Doesn't Match");
      return false;
    } else {
      setErr("");
      return true;
    }
  };

  const passwordVisibilityChange = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const onPasswordChange = async (e) => {
    e.preventDefault();

    UtilCtx.setLoader(true);
    if (passwordValidator()) {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        await Auth.changePassword(currentUser, oldPassword, password);

        toast.info("Password Changed");
        setIsChangePassword(false);
        UtilCtx.setLoader(false);
      } catch (e) {
        setErr(e.message);
        UtilCtx.setLoader(false);
      }
    }
    UtilCtx.setLoader(false);
  };

  // Function to handle the phone number change
  const onPhoneChange = async (e) => {
    e.preventDefault();
    UtilCtx.setLoader(true);
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      // Send verification code to the new phone number
      await Auth.updateUserAttributes(currentUser, {
        phone_number: phoneNumber,
      });
      setIsPhoneCode(true);
      UtilCtx.setLoader(false);
    } catch (e) {
      console.error(e);
      setErr(e.message);
      UtilCtx.setLoader(false);
    }
  };

  // Function to confirm the phone number with the code
  const onPhoneCodeConfirm = async (e) => {
    e.preventDefault();
    UtilCtx.setLoader(true);
    if (phoneCode.length !== 0) {
      try {
        await Auth.verifyCurrentUserAttributeSubmit("phone_number", phoneCode);
        await API.put(
          "main",
          `/user/profile/${InstitutionData.InstitutionId}`,
          {
            body: {
              emailId: UserCtx.emailId,
              userName: UserCtx.userName,
              phoneNumber: phoneNumber,
              country: UserCtx.country,
              joiningDate: UserCtx.joiningDate,
            },
          }
        );
        setUserData({
          ...userData,
          phoneNumber: phoneNumber,
        });
        toast.info("Phone Number Updated");
        setIsPhoneChange(false);
        setIsPhoneCode(false);
        UtilCtx.setLoader(false);
      } catch (e) {
        console.error(e);
        setErr(e.message);
        UtilCtx.setLoader(false);
      } finally {
        setPhoneCode("");
      }
    } else {
      UtilCtx.setLoader(false);
      setErr("Please enter the code");
    }
  };

  return (
    <div
      className={`relative w-[calc(100vw-16rem)] max1050:w-screen flex flex-col items-center  `}
    >
      <div
        className={`w-[75%] max1050:w-[100%] max-w-[36rem] rounded-3xl p-3 flex flex-col items-center max536:w-[90%] mt-[1rem] max536:mt-[4rem] relative bg-white shadow-md`}
      >
        <FaArrowLeft
          className="absolute left-2 top-2 min1050:hidden"
          size={"1.7rem"}
          color="grey"
          onClick={() => {
            setClick(0);
            displayAfterClick(0);
          }}
        />
        <div className="avatar-editor-container flex flex-row justify-center">
          <input
            type="file"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {image && (
            <div className="absolute mt-20 max450:mt-14 top-[25%]">
              <div className="flex justify-end">
                <button
                  className=" border-none cursor-pointer"
                  onClick={handleCancel}
                >
                  <span className="text-2xl">⨯</span>
                </button>
              </div>
              <AvatarEditor
                ref={(ref) => setEditor(ref)}
                image={image}
                width={200}
                height={200}
                border={50}
                borderRadius={100}
                scale={scale}
              />
              <div className="controls">
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                />
                <button
                  className="rounded-md w-[4rem] h-8 text-white ml-4"
                  style={{
                    backgroundColor: InstitutionData.PrimaryColor,
                  }}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
        {!isPhoneChange ? (
          <>
            {!isChangePassword ? (
              <div className="flex flex-col items-center mb-4 w-full max-w-4xl mx-auto">
                <div className="text-black text-xl font-bold text-left pb-[10px]">
                  My Account
                </div>

                <div className="flex items-center justify-between w-full mb-6">
                  <h1 className="text-2xl font-bold">Profile Overview</h1>
                  <div className="flex gap-2">
                    {showForm ? (
                      <>
                        <button
                          onClick={() => setShowForm(false)}
                          className="bg-primaryColor text-white px-3 py-1 text-sm rounded-md"
                        >
                          Update Changes
                        </button>
                        <button
                          onClick={() => setShowForm(false)}
                          className="bg-red-500 text-white px-3 py-1 text-sm rounded-md"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-primaryColor text-white px-3 py-1 text-sm rounded-md flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative w-[10rem] h-[10rem] mx-auto mb-6">
                  <div className="relative w-full h-full rounded-full flex items-center justify-center border-[3px] border-solid border-t1  shadow-black/40">
                    {UserCtx.imgUrl ? (
                      <img
                        alt="profile"
                        key={"profileUpdate1" + Date.now()}
                        src={UserCtx.imgUrl}
                        className="w-full h-full rounded-full object-cover cursor-pointer"
                        onClick={handleEditClick}
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: getColor(UserCtx.userName) }}
                        onClick={handleEditClick}
                      >
                        <span className="text-[3rem] font-bold text-white">
                          {getInitials(UserCtx.userName)}
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div
                      className="absolute bottom-0 right-0 w-10 h-10 text-white flex items-center justify-center cursor-pointer rounded-full"
                      onClick={handleEditClick}
                      style={{
                        background: InstitutionData.PrimaryColor,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <>
                  {UserCtx.userType === "instructor" && (
                    <div className="flex flex-col gap-4 justify-center bg-gray-100 p-4 rounded-lg shadow-md w-full">
                      {referralLink && (
                        <div className="flex flex-col gap-2">
                          <label className="ml-2 text-sm font-semibold text-gray-700">
                            Hybrid Page Link
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              className="bg-white px-4 py-2 rounded-lg w-full border border-gray-300 shadow-sm text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                              type="text"
                              value={referralLink}
                              readOnly
                            />
                            <Tooltip
                              content="Go to Link"
                              position="top"
                              arrow={false}
                            >
                              <button
                                className="bg-primaryColor text-white rounded-lg py-2 px-4 shadow-md hover:bg-lightPrimaryColor hover:shadow-lg transition-transform transform hover:scale-105"
                                onClick={() => {
                                  window.location.href = referralLink;
                                }}
                              >
                                <FaArrowCircleRight className="h-6" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
                <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="flex flex-col">
                    <label className="text-gray-600 font-medium">Name</label>
                    <input
                      className={`px-4 py-2 rounded-md w-full ${
                        showForm ? "bg-inputBgColor" : "bg-gray-100"
                      }`}
                      type="text"
                      value={name}
                      readOnly={!showForm}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 font-medium">Email</label>
                    <input
                      className="bg-gray-100 px-4 py-2 rounded-md"
                      type="email"
                      value={currentEmail}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 font-medium">
                      Phone Number
                    </label>
                    <input
                      className="bg-gray-100 px-4 py-2 rounded-md"
                      type="text"
                      value={phoneNumber}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 font-medium">DOB</label>

                    {showForm ? (
                      <input
                        type="date"
                        className="bg-inputBgColor px-4 py-2 rounded-md"
                        value={tempDob || ""}
                        onChange={(e) => setTempDob(e.target.value)}
                      />
                    ) : (
                      <input
                        className="bg-gray-100 px-4 py-2 rounded-md"
                        type="text"
                        value={formatDate(dob) || ""}
                        readOnly
                      />
                    )}
                  </div>

                  <div className="flex flex-col col-span-2">
                    <label className="text-gray-600 font-medium">Address</label>
                    <textarea
                      className={`px-4 py-2 rounded-md resize-none w-full ${
                        showForm ? "bg-inputBgColor" : "bg-gray-100"
                      }`}
                      rows={3}
                      value={address}
                      readOnly={!showForm}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  {UserCtx.userType === "instructor" && (
                      <div className="flex flex-col col-span-2">
                        <label className="text-gray-600 font-medium">
                          About
                        </label>
                        <textarea
                          className={`px-4 py-2 rounded-md resize-none w-full ${
                            showForm ? "bg-inputBgColor" : "bg-gray-100"
                          }`}
                          rows={3}
                          value={about}
                          readOnly={!showForm}
                          onChange={(e) => setAbout(e.target.value)}
                        />
                      </div>
                    
                  )}
                </form>
              </div>
            ) : (
              <>
                <form
                  className={`flex flex-col items-center my-4 max536:w-[90%]`}
                >
                  <p className={`text-[1.3rem]`}>Change Password</p>
                  <div className={`flex flex-col items-center`}>
                    <div
                      className={`flex items-center gap-20 mt-6 max536:flex-col max536:gap-2 max536:items-start`}
                    >
                      <label className={`w-20  max536:ml-2`}>
                        Old Password
                      </label>
                      <input
                        className={`bg-inputBgColor px-4 py-2 rounded-lg`}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div
                      className={`flex items-center gap-20 mt-6 max536:flex-col max536:gap-2 max536:items-start`}
                    >
                      <label className={`w-20 max536:ml-2`}>Password</label>
                      <input
                        className={`bg-inputBgColor px-4 py-2 rounded-lg`}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div
                      className={`flex items-center gap-20 mt-6 max536:flex-col max536:gap-2 max536:items-start relative`}
                    >
                      <label className={`w-20 max536:ml-2`}>
                        Confirm Password
                      </label>
                      <input
                        className={`bg-inputBgColor px-4 py-2 rounded-lg`}
                        type={!passwordVisible ? "password" : "text"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {passwordVisible ? (
                        <AiFillEye
                          onClick={passwordVisibilityChange}
                          className={`absolute right-4`}
                          size={"1.25rem"}
                        />
                      ) : (
                        <AiFillEyeInvisible
                          onClick={passwordVisibilityChange}
                          className={`absolute right-4`}
                          size={"1.25rem"}
                        />
                      )}
                    </div>
                  </div>
                  {err && (
                    <p className={`text-[0.8rem] mt-2 text-red-500`}>{err}</p>
                  )}
                  <div className={`flex gap-5`}>
                    <Button2
                      data={"Cancel"}
                      fn={(e) => {
                        e.preventDefault();
                        setErr("");
                        setIsChangePassword(false);
                      }}
                      w="8rem"
                    />
                    <Button2
                      data={"Update"}
                      fn={onPasswordChange}
                      w="8rem"
                      className={`mt-8`}
                    />
                  </div>
                </form>
              </>
            )}
          </>
        ) : (
          <>
            {!isPhoneCode ? (
              <div>
                <form className={`flex flex-col items-center my-4`}>
                  <p className={`text-[1.3rem]`}>Change Phone Number</p>
                  <p className={`text-[0.8rem] text-gray-500 mt-2`}>
                    *Note: Please include the country code before entering the
                    phone number.
                  </p>
                  <div className={`flex flex-col items-center`}>
                    <div
                      className={`flex items-center gap-20 mt-5 max536:flex-col max536:gap-2 max536:items-start`}
                    >
                      <label className={`w-[9rem]`}>New Phone Number</label>
                      <input
                        className={`bg-inputBgColor px-4 py-2 rounded-lg`}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  {err && (
                    <p className={`text-[0.8rem] mt-2 text-red-500`}>{err}</p>
                  )}
                  <div className={`flex gap-5`}>
                    <Button2
                      data={"Cancel"}
                      fn={(e) => {
                        e.preventDefault();
                        setPhoneNumber(userData.phoneNumber);
                        setErr("");
                        setIsPhoneChange(false);
                      }}
                      w="8rem"
                      className={`mt-8`}
                    />
                    <Button2
                      data={"Send Code"}
                      fn={onPhoneChange}
                      w="8rem"
                      className={`mt-8`}
                    />
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <form className={`flex flex-col items-center my-4`}>
                  <p className={`text-[1.3rem]`}>Verify Phone Number</p>
                  <p className={`my-2 text-[0.8rem]`}>
                    Code sent to {phoneNumber}
                  </p>
                  <div className={`flex flex-col items-center`}>
                    <div
                      className={`flex items-center gap-20 mt-5 max536:flex-col max536:gap-2 max536:items-start`}
                    >
                      <label className={`w-20`}>Code</label>
                      <input
                        className={`bg-inputBgColor px-4 py-2 rounded-lg`}
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                      />
                    </div>
                  </div>
                  {err && (
                    <p className={`text-[0.8rem] mt-2 text-red-500`}>{err}</p>
                  )}
                  <div className={`flex gap-5`}>
                    <Button2
                      data={"Cancel"}
                      fn={(e) => {
                        e.preventDefault();
                        setPhoneNumber(userData.phoneNumber);
                        setErr("");
                        setIsPhoneChange(false);
                        setIsPhoneCode(false);
                      }}
                      w="8rem"
                      className={`mt-8`}
                    />
                    <Button2
                      data={"Confirm"}
                      fn={onPhoneCodeConfirm}
                      w="8rem"
                      className={`mt-8`}
                    />
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {(userData.userType === "instructor" ||
        userData.userType === "admin") && (
        <>
          <div>
            <ReferralCode />
          </div>
          {/* {userData.userType === "instructor" && (
            <div>
              <HybridReferral />
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default ProfileUpdate;
