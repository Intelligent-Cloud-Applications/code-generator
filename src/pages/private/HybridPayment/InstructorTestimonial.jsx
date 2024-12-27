import { API } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import { FaPencilAlt, FaRegSave, FaRegWindowClose } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import AboutInstructor from "./AboutInstructor";

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
  const [imagePresent, setImagePresent] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const Navigate = useNavigate();
  const Util = Ctx.util;

  console.log("UserCtx: ",UserCtx)

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
    setAbout(instructor?.instructorProfile?.about || "");
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
          console.log("Fetched Instructors:", response.data);
          setInstructors((prev = []) => [
            ...prev,
            ...(response?.data || []),
            instructor?.instructorProfile,
          ]);
        } else {
          const response = JSON.parse(
            localStorage.getItem(`instructorList_${institution}`)
          );
          console.log("Cached Instructors:", response.data);
          setInstructors((prev = []) => [
            ...prev,
            ...(response?.data ),
            instructor?.instructorProfile,
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

        console.log("Instructors",instructors)
        // Find additional data and merge with the response
        console.log("Referral:", referral);
        const additionalData = instructors?.find(
          (e) =>
            e?.referral_code === referral ||
            e?.name?.toUpperCase().startsWith(referral?.toUpperCase()) ||
            e?.name
              ?.toUpperCase()
              .startsWith(response?.referralCode?.toUpperCase())
        );

        console.log("Additional Data:", additionalData);


        // Merge data before setting the instructor state
        setInstructor({
          ...response,
          ...(additionalData),
          ...currentInstructor,
        });
        console.log("Fetched Instructor:", response);
        console.log("Set Instructor:", instructor);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      } finally {
        Util.setLoader(false); // End loading
      }
    };

    fetchInstructor();
  }, [institution, cognitoId,currentInstructor]);
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
    console.log("Current Instructor:", currentInstructor);

    if (!currentInstructor?.image || !instructor?.instructorProfile?.imgUrl) {
      setImagePresent(false);
    }
    setImagePresent(Boolean(imgUrl));
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
      const url = `/signup?trial=true&trialPeriod=Monthly&referral=${referral}&institution=${institution}`;
      Navigate(url);
    }
  };

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
        <div className="my-12 w-[287px] md:w-11/12 md:max-w-[980px] mx-auto md:h-[450px] h-[333px] ">
          <div className="w-[287px] md:w-full -left-1 relative h-full">
            <div className="relative md:w-full w-[284px]">
              <div className="border border-gray-200 absolute w-[310px] md:w-full md:h-[27rem] h-[330px] top-0 left-0 bg-neutral-50 rounded-[21.77px] shadow-[0px_85.26px_181.4px_#15151526]" />
              <RiDoubleQuotesL className="relative text-8xl text-slate-500 bottom-8 -left-4 h-12 w-16" />

              <img
                className="absolute w-[3.188rem] h-[5.78rem] md:h-[29rem] md:w-[18rem] md:right-12 md:-top-4 -top-8 right-0 object-cover rounded-md"
                alt="Unsplash ww"
                src={imgUrl}
              />

              {!imagePresent === true && (
                <div className="absolute w-[3.188rem] h-[5.78rem] md:h-[29rem] md:w-[18rem] md:right-12 md:-top-4 -top-8 right-0 object-cover rounded-md bg-gray-300">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-[3rem] font-bold text-gray-700">
                      <span className="text-[1.5rem] font-bold text-gray-700">
                        {getInitials(
                          instructor?.instructorProfile?.userName ||
                            instructor?.referralCode ||
                            instructor?.name
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="inline-flex flex-col items-start justify-end gap-[3.63px] absolute -bottom-14 left-4">
                <div className="mt-[-0.91px] [font-family:'Manrope-Medium',Helvetica] font-medium text-black text-[29px] relative w-fit tracking-[0] leading-[normal]">
                  {/* Instructor Name */}
                  <p className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                    {instructor?.name?.toUpperCase() ||
                      instructor?.instructorProfile?.userName?.toUpperCase() ||
                      instructor?.referralCode?.toUpperCase()}
                  </p>

                  <p className="text-lg font-medium text-gray-500 md:text-xl">
                    {institution}
                  </p>
                </div>
              </div>

              {isAuth &&
                UserCtx.cognitoId ===
                  instructor?.instructorProfile?.cognitoId && (
                  <div
                    className={`flex justify-end md:justify-center mb-6 absolute top-16 right-0 md:right-[50%] lg:right-[50%] md:top-20 lg:top-20`}
                  >
                    <button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center h-10"
                      onClick={() => setEditing(true)}
                    >
                      <FaPencilAlt className="inline mr-2" />
                    </button>
                  </div>
                )}

              {instructor && (
                <div className="mb-8">
                  <div className="min-w-full">
                    {!editing ? (
                      <p
                        className={`mt-5 absolute w-full
                          max-w-[461px] md:max950:max-w-[320px]
                        top-28 left-4 text-black text-left md:first-letter:text-3xl md:tracking-wide overflow-scroll h-36 md:h-40 lg:h-60 rounded-lg  text-base md:text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none `}
                      >
                        <AboutInstructor
                          aboutText={
                            instructor?.instructorProfile?.about?.trim() ||
                            "No bio available."
                          }
                        />
                      </p>
                    ) : (
                      <div>
                        <textarea
                          className={`mt-2 absolute w-full 
                            max-w-[461px] max950:max-w-[322px]
                         top-28 left-4 h-36 md:h-40 bg-gray-100 border border-gray-300 rounded-lg p-4 text-gray-700 text-base md:text-lg  focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none box-border`}
                          onChange={(e) => setAbout(e.target.value)}
                          value={about}
                          maxLength={300}
                          placeholder="Write something about yourself..."
                        />
                        {editing &&
                          isAuth &&
                          UserCtx.cognitoId ===
                            instructor?.instructorProfile?.cognitoId && (
                            <div className="flex justify-start space-x-4 mt-6 absolute top-[16rem] left-[2rem] md:top-[17rem] md:left-[6rem]">
                              <button
                                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center"
                                onClick={() => setEditing(false)}
                              >
                                <FaRegWindowClose className="inline mr-2" />{" "}
                                Cancel
                              </button>
                              <button
                                className="bg-gradient-to-r bg-lightPrimaryColor hover:bg-primaryColor text-white py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center"
                                onClick={() => onProfileUpdate(about)}
                              >
                                <FaRegSave className="inline mr-2" /> Save
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
