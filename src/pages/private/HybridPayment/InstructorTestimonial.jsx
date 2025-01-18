import { API } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import { FaPencilAlt, FaRegSave, FaRegWindowClose } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import AboutInstructor from "./AboutInstructor";
import "./InstructorTestimonial.css";

const InstructorTestimonial = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Ctx = useContext(Context);
  const { isAuth, userData: UserCtx } = useContext(Context);
  const { institutionData } = useContext(InstitutionContext);
  const [instructors, setInstructors] = useState([]);
  const [instructor, setInstructor] = useState({});
  const [currentInstructor, setCurrentInstructor] = useState({});
  const [editing, setEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const Navigate = useNavigate();
  const Util = Ctx.util;

  // console.log("UserCtx: ", UserCtx);

  const location = useLocation();
  // console.log(Util);
  // Function to parse query parameters
  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const referral = queryParams.get("referral");
  const institution = queryParams.get("institution");
  const cognitoId = queryParams.get("cognitoId");

  // console.log("Referral:", referral);
  // console.log("Institution:", institution);

  const getFirstWord = (str) => {
    return str?.split(" ")[0];
  };

  useEffect(() => {
    setAbout(
      instructor?.instructorProfile &&
        instructor.instructorProfile.hasOwnProperty("about")
        ? instructor.instructorProfile.about
        : ""
    );
  }, [instructor]);

  useEffect(() => {
    const fetchInstructorList = async () => {
      Util.setLoader(true); // Start loading
      try {
        if (localStorage.getItem(`instructorList_${institution}`) === null) {
          const response = await API.get(
            "main",
            `/any/instructor-list/${institutionData.InstitutionId}`
          );
          localStorage.setItem(
            `instructorList_${institution}`,
            JSON.stringify(response)
          );
          // console.log("Fetched Instructors:", response.data);
          setInstructors((prev = []) => [
            ...prev,
            ...(Array.isArray(response?.data) ? response.data : []), // Ensure response.data is an array
            ...(instructor?.instructorProfile
              ? [instructor.instructorProfile]
              : []), // Add only if instructorProfile exists
          ]);
        } else {
          const response = JSON.parse(
            localStorage.getItem(`instructorList_${institution}`)
          );
          // console.log("Cached Instructors:", response.data);
          setInstructors((prev = []) => [
            ...prev,
            ...(Array.isArray(response?.data) ? response.data : []), // Ensure response.data is an array
            ...(instructor?.instructorProfile
              ? [instructor.instructorProfile]
              : []), // Add only if instructorProfile exists
          ]);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        Util.setLoader(false); // End
      }
    };
    fetchInstructorList();
  }, [institution, instructor]);

  useEffect(() => {
    const fetchInstructor = async () => {
      Util.setLoader(true); // Start loading
      try {
        let response = {};
        try {
          response = await API.get(
            "main",
            `/instructor/profile/${institution}?referral=${referral}`
          );
        } catch (error) {
          console.error("Error fetching instructor:", error);
          response = {};
        }

        // console.log("Instructors", instructors);
        // Find additional data and merge with the response
        // console.log("Referral:", referral);
        const additionalData = instructors?.find(
          (e) =>
            e?.referral_code === referral ||
            e?.name?.toUpperCase().startsWith(referral?.toUpperCase()) ||
            e?.name
              ?.toUpperCase()
              .startsWith(response?.referralCode?.toUpperCase())
        );

        // console.log("Additional Data:", additionalData);

        // Merge data before setting the instructor state
        setInstructor({
          ...response,
          ...additionalData,
          ...currentInstructor,
        });
        // console.log("Fetched Instructor:", response);
        // console.log("Set Instructor:", instructor);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      } finally {
        Util.setLoader(false); // End loading
      }
    };

    fetchInstructor();
  }, [institution, cognitoId, currentInstructor]);
  useEffect(() => {
    if (instructor?.instructorProfile?.imgUrl || instructor?.image) {
      setImgUrl(instructor?.instructorProfile?.imgUrl || instructor?.image);
    }
    const currentInstructor = instructors?.find(
      (e) =>
        e?.referral_code === referral ||
        getFirstWord(e?.name) ===
          getFirstWord(instructor?.instructorProfile?.userName) ||
        getFirstWord(e?.name) === instructor?.referralCode
    );
    if (currentInstructor) {
      setCurrentInstructor(currentInstructor);
    }
    if (currentInstructor?.image) {
      setImgUrl(currentInstructor?.image);
    }
    // console.log("Current Instructor:", currentInstructor);
  }, [instructors, instructor]);
  const getInitials = (name) => {
    const names = name?.split(" ");
    const initials = names
      ?.map((name) => name.charAt(0).toUpperCase())
      .join("");
    return initials;
  };
  const onProfileUpdate = async (about) => {
    try {
      Util.setLoader(true);
      const response = await API.put(
        "main",
        `/user/profile/${InstitutionData.InstitutionId}`,
        {
          body: {
            about: about,
          },
        }
      );
      const updatedAttributes = response.Attributes;
      Ctx.setUserData(updatedAttributes);
      // Update instructor state with the new about value
      setInstructor((prev) => ({
        ...prev,
        instructorProfile: {
          ...prev.instructorProfile,
          about: updatedAttributes.about,
        },
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setEditing(false);
      Util.setLoader(false);
    }
  };

  // console.log(UserCtx?.cognitoId)
  // console.log(instructor?.instructorProfile?.cognitoId)
  const handleFreeTrial = async () => {
    if (isAuth) {
      toast.error("You are already logged in & you cannot signup again.");
      const userConfirmed = window.confirm(
        "You already have an account.\nDo you want to go to dashboard?"
      );
      if (userConfirmed) Navigate("/dashboard");
    } else {
      // Get the current url and append the trial query params
      const url = `/signup?trial=true&trialPeriod=Monthly&referral=${referral}&institution=${institution}&hybrid=true`;
      Navigate(url);
    }
  };

  function capitalizeWords(str) {
    return str
      ?.split(" ")
      ?.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  if (Util.loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (referral && institution) {
    return (
      <>
        <div className="flex flex-col md:flex-row items-center md:items-start w-11/12 md:w-11/12 md:max-w-[980px] mx-auto my-12 p-6 border border-gray-200 rounded-lg bg-neutral-50 shadow-lg gap-6">
          {/* Image Section */}
          {imgUrl ? (
            <img
              className="w-[90%] md:w-[18rem] h-[18rem] md:h-[29rem] object-cover rounded-md"
              alt="Profile"
              src={imgUrl}
            />
          ) : (
            <div className="w-[90%] md:w-[18rem] h-[15rem] md:h-[29rem] bg-gray-300 flex items-center justify-center rounded-md">
              <p className="text-3xl font-bold text-gray-700">
                {getInitials(
                  instructor?.instructorProfile?.userName ||
                    instructor?.referralCode ||
                    instructor?.name
                )}
              </p>
            </div>
          )}

          {/* Info Section */}
          <div className="flex-1">
            {/* Instructor Name */}
            <div className="mb-4">
              <p className="text-3xl font-bold md:text-4xl text-gray-900">
                {instructor?.name ||
                  instructor?.instructorProfile?.userName ||
                  capitalizeWords(instructor?.referralCode)}
              </p>
              <p className="text-lg font-medium text-gray-500">{institution}</p>
            </div>

            {/* About Section */}
            <div className="mb-6">
              {!editing ? (
                <p
                  className="text-base sm:text-lg md:text-xl text-gray-700 border  p-4 rounded-lg bg-gray-50 "
                  style={{
                    borderColor: InstitutionData.PrimaryColor,
                  }}
                >
                  <AboutInstructor
                    aboutText={
                      instructor?.instructorProfile?.about?.trim() ||
                      "No bio available."
                    }
                  />
                </p>
              ) : (
                <textarea
                  className="w-full h-48 p-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  onChange={(e) => setAbout(e.target.value)}
                  value={about}
                  maxLength={500}
                  placeholder="Write something about yourself..."
                />
              )}
            </div>

            {/* Edit Buttons */}
            {isAuth &&
              UserCtx.cognitoId ===
                instructor?.instructorProfile?.cognitoId && (
                <div className="flex gap-4">
                  {editing ? (
                    <>
                      <button
                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md flex items-center"
                        onClick={() => setEditing(false)}
                      >
                        <FaRegWindowClose className="mr-2" /> Cancel
                      </button>
                      <button
                        className={`button-gradient text-white py-2 px-4 rounded-lg shadow-md flex items-center`}
                        onClick={() => onProfileUpdate(about)}
                      >
                        <FaRegSave className="mr-2" /> Save
                      </button>
                    </>
                  ) : (
                    <button
                      className={`button-gradient text-white py-2 px-4 rounded-lg shadow-md flex items-center`}
                      onClick={() => setEditing(true)}
                    >
                      <FaPencilAlt className="mr-2" /> Edit
                    </button>
                  )}
                </div>
              )}
          </div>
        </div>

        <div className="my-4"></div>
        <button className="free-demo" onClick={handleFreeTrial}>
          <span>Register for free trials</span>
        </button>

        <></>
      </>
    );
  }
  return <></>;
};

export default InstructorTestimonial;
