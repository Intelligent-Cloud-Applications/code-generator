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
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  const handleChangePassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="relative w-[calc(100vw-16rem)] max1050:w-screen min-h-screen bg-[#f0f2f5] p-8">
      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto">
        {/* Top Banner */}
        <div className="relative rounded-xl p-6" style={{
        }}>
          <h1 className="text-3xl font-bold"style={{color:InstitutionData.PrimaryColor}}>Profile Settings</h1>
          <p className="text-white/80 "style={{color:InstitutionData.PrimaryColor}}>Manage your account information and settings</p>
        </div>

        {/* Profile Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Profile Header */}
              <div className="text-center p-6">
                <div className="relative inline-block">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                    {UserCtx.imgUrl ? (
                      <img
                        src={UserCtx.imgUrl}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: getColor(UserCtx.userName) }}
                      >
                        <span className="text-3xl font-bold text-white">
                          {getInitials(UserCtx.userName)}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEditClick}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                    style={{ color: InstitutionData.PrimaryColor }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-bold mt-4">{name}</h2>
                <p className="text-gray-500 capitalize">{UserCtx.userType}</p>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(UserCtx?.joiningDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" 
                    style={{ 
                      backgroundColor: `${InstitutionData.PrimaryColor}20`,
                      color: InstitutionData.PrimaryColor 
                    }}>
                    {UserCtx.status}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">QUICK ACTIONS</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleChangePassword}
                    className="w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-all flex items-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-4 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Personal Information</h3>
                <button
                  onClick={onProfileUpdate}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
                  style={{ backgroundColor: InstitutionData.PrimaryColor }}
                >
                  Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={currentEmail}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={tempDob}
                    onChange={(e) => setTempDob(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Address Information</h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                placeholder="Enter your complete address"
              />
            </div>

            {/* About Section for Instructors */}
            {UserCtx.userType === "instructor" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">About Me</h3>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>
            )}

            {/* Referral Section */}
            {(userData.userType === "instructor" || userData.userType === "admin") && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ReferralCode />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
