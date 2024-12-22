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
  const Util = useContext(Context).util;
  const { isAuth, userData: UserCtx } = useContext(Context);
  const [instructors, setInstructors] = useState([]);
  const [instructor, setInstructor] = useState({});
  const [editing, setEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [imagePresent, setImagePresent] = useState(false);
  const { institutionData } = useContext(InstitutionContext);
  const Navigate = useNavigate();

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

  useEffect(() => {
    setAbout(instructor?.instructorProfile?.about || "");
  }, [instructor]);

  useEffect(() => {
    const currentInstructor = instructors?.find(
      (e) => e.emailId === instructor.emailId
    );
    setImagePresent(Boolean(currentInstructor?.image));
  }, [instructors, instructor.emailId]);

  useEffect(() => {
    const fetchInstructor = async () => {
      Util.setLoader(true); // Start loading
      try {
        const response = await API.get(
          "main",
          `/instructor/profile/${institution}?referral=${referral}`
        );

        // Find additional data and merge with the response
        const additionalData = instructors?.find(
          (e) => e.name?.toUpperCase() === response?.referralCode?.toUpperCase()
        );

        // Merge data before setting the instructor state
        setInstructor({
          ...response,
          ...(additionalData || {}),
        });

        console.log("Fetched Instructor:", instructor);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      } finally {
        Util.setLoader(false); // End loading
      }
    };

    fetchInstructor();
  }, [institution, cognitoId, instructors]);

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
          setInstructors(response.data);
        } else {
          const response = JSON.parse(
            localStorage.getItem(`instructorList_${institution}`)
          );
          setInstructors(response.data);
          console.log("Cached Instructors:", response.data);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        Util.setLoader(false); // End
      }
    };
    fetchInstructorList();
  }, [institution]);

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
        {/* <div
          className={`bg-gradient-to-b  from-white to-gray-50 shadow-xl rounded-2xl p-8 h-auto overflow-hidden ${
            editing !== true
              ? "max-w-lg md:max-w-xl lg:max-w-2xl"
              : "w-[90%] md:w-3/4 lg:w-1/3"
          } min-w-[90%] md:min-w-[36rem] lg:min-w-[42rem]  mx-auto mt-10 border border-gray-200`}
        >
          <div
            className={`grid grid-cols-1 lg:${
              imagePresent ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            <div>
              <div className="flex flex-col lg:flex-row justify-between items-center mb-8">

                <div className="text-left mb-6 lg:mb-0 lg:w-2/3">
                  <p className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                    {instructor?.instructorProfile?.userName ||
                      instructor.referralCode ||
                      instructor.name}
                  </p>
                  <p className="text-lg font-medium text-gray-500 md:text-xl">
                    {institution}
                  </p>
                </div>
              </div>


              {isAuth &&
                UserCtx.cognitoId ===
                  instructor?.instructorProfile?.cognitoId && (
                  <div className="flex justify-end mb-6">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105"
                      onClick={() => setEditing(true)}
                    >
                      <FaPencilAlt className="inline mr-2" /> Edit Profile
                    </button>
                  </div>
                )}


              {instructor && (
                <div className="mb-8">
                  <div className="min-w-full">
                    {editing ? (
                      <textarea
                        className="w-full h-36 md:h-40 bg-gray-100 border border-gray-300 rounded-lg p-4 text-gray-700 text-base md:text-lg italic focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none box-border"
                        onChange={(e) => setAbout(e.target.value)}
                        value={about}
                        placeholder="Write something about yourself..."
                      />
                    ) : (
                      <>
                        <p className="text-gray-700 text-base md:text-lg italic break-words leading-relaxed box-border">
                          {instructor?.position}
                        </p>
                        <p className="text-gray-700 text-base md:text-lg italic break-words leading-relaxed overflow-scroll h-36 md:h-40 box-border">
                          <AboutInstructor
                            aboutText={
                              instructor?.instructorProfile?.about ||
                              "No bio available."
                            }
                          />
                        </p>
                      </>
                    )}
                  </div>


                  {editing &&
                    isAuth &&
                    UserCtx.cognitoId ===
                      instructor?.instructorProfile?.cognitoId && (
                      <div className="flex justify-center space-x-4 mt-6">
                        <button
                          className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105"
                          onClick={() => setEditing(false)}
                        >
                          <FaRegWindowClose className="inline mr-2" /> Cancel
                        </button>
                        <button
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105"
                          onClick={() => onProfileUpdate(about)}
                        >
                          <FaRegSave className="inline mr-2" /> Save
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
            <div
              className={`flex justify-center ${
                imagePresent ? "lg:justify-end" : ""
              } items-center`}
            >
              {instructors?.map((e) => {
                if (e.emailId === instructor.emailId) {
                  const hasImage = Boolean(e.image);
                  return (
                    <div
                      key={e.emailId}
                      className="relative flex-shrink-0 w-full max-w-[12rem] lg:max-w-[16rem]"
                    >
                      {hasImage && (
                        <img
                          src={e.image}
                          alt={e.name}
                          className="w-full h-auto object-cover rounded-lg shadow-lg "
                        />
                      )}
                      {hasImage && (
                        <span className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          </div> */}
        <div className="my-12 w-[287px] md:w-11/12 md:max-w-[980px] mx-auto md:h-[450px] h-[333px] ">
          <div className="w-[287px] md:w-full -left-1 relative h-full">
            <div className="relative md:w-full w-[284px]">
              <div className="border border-gray-200 absolute w-[310px] md:w-full md:h-[27rem] h-[330px] top-0 left-0 bg-neutral-50 rounded-[21.77px] shadow-[0px_85.26px_181.4px_#15151526]" />
              <RiDoubleQuotesL className="relative text-8xl text-slate-500 bottom-8 -left-4 h-12 w-16" />
              {instructors?.map((e) => {
                if (e.emailId === instructor.emailId) {
                  const hasImage = Boolean(e.image);
                  return (
                    <img
                      className="absolute w-[3.188rem] h-[5.78rem] md:h-[29rem] md:w-[18rem] md:right-12 md:-top-4 -top-8 right-0 object-cover rounded-md"
                      alt="Unsplash ww"
                      src={e.image}
                    />
                  );
                }
                return null;
              })}

              <div className="inline-flex flex-col items-start justify-end gap-[3.63px] absolute -bottom-14 left-4">
                <div className="mt-[-0.91px] [font-family:'Manrope-Medium',Helvetica] font-medium text-black text-[29px] relative w-fit tracking-[0] leading-[normal]">
                  <p className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                    {instructor?.instructorProfile?.userName ||
                      instructor.referralCode ||
                      instructor.name}
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
                    className={`flex justify-end md:justify-center mb-6 absolute top-16 right-0  ${
                      imagePresent
                        ? "md:right-[50%] lg:right-[50%]"
                        : "md:right-4 lg:right-4"
                    } md:top-20 lg:top-20`}
                  >
                    <button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105"
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
                        className={`mt-5 absolute w-full ${
                          imagePresent &&
                          "max-w-[461px] md:max950:max-w-[320px]"
                        } top-28 left-4 text-black text-left md:first-letter:text-3xl md:tracking-wide overflow-scroll h-36 md:h-40 lg:h-60 rounded-lg ${
                          !imagePresent && "p-2 md:pr-4 lg:pr-6"
                        } text-base md:text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none `}
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
                          className={`mt-2 absolute w-full ${
                            imagePresent
                              ? "max-w-[461px] max950:max-w-[322px]"
                              : "max-w-[90%]"
                          } top-28 left-4 h-36 md:h-40 bg-gray-100 border border-gray-300 rounded-lg p-4 text-gray-700 text-base md:text-lg  focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none box-border`}
                          onChange={(e) => setAbout(e.target.value)}
                          value={about}
                          placeholder="Write something about yourself..."
                        />
                        {editing &&
                          isAuth &&
                          UserCtx.cognitoId ===
                            instructor?.instructorProfile?.cognitoId && (
                            <div className="flex justify-start space-x-4 mt-6 absolute top-[16rem] left-[2rem] md:top-[17rem] md:left-[6rem]">
                              <button
                                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105"
                                onClick={() => setEditing(false)}
                              >
                                <FaRegWindowClose className="inline mr-2" />{" "}
                                Cancel
                              </button>
                              <button
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105"
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
          Register for free trials
        </button>

        <></>
      </>
    );
  }
  return <></>;
};

export default InstructorTestimonial;
