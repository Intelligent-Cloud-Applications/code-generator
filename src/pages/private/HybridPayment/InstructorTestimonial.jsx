import { API } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import apiPaths from "../../../utils/api-paths";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InstructorTestimonial = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Ctx = useContext(Context);
  const Util = useContext(Context).util;
  const { isAuth, userData: UserCtx } = useContext(Context);
  const [instructors, setInstructors] = useState([]);
  const [instructor, setInstructor] = useState({});
  const [editing, setEditing] = useState(false);
  const [about, setAbout] = useState("");
  const Navigate = useNavigate();

  const location = useLocation();
  console.log(Util);
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
    const fetchInstructor = async () => {
      Util.setLoader(true); // Start loading
      try {
        const response = await API.get(
          "main",
          `/instructor/profile/${institution}?referral=${referral}`
        );
        setInstructor(response);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      } finally {
        Util.setLoader(false); // End loading
      }
    };

    fetchInstructor();
  }, [institution, cognitoId]);

  useEffect(() => {
    const fetchInstructorList = async () => {
      Util.setLoader(true); // Start loading
      try {
        if (localStorage.getItem(`instructorList_${institution}`) === null) {
          const response = await API.get("main", `${apiPaths.getInstructors}`);
          localStorage.setItem(
            `instructorList_${institution}`,
            JSON.stringify(response)
          );
          setInstructors(response.data);
          console.log("Fetched Instructors:", response.data);
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
      toast.error("You are already logged in");
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
        <div>
          <h1 className="hybrid-heading text-3xl font-bold text-center mt-8 text-[3rem] mb-4 text-lightPrimaryColor">
            Instructor Testimonial
          </h1>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 max-w-full md:max-w-md mx-auto mt-8">
          <div className="text-center mb-4">
            <p className="text-2xl font-semibold text-gray-800 md:text-3xl underline">
              {instructor?.instructorProfile?.userName}
            </p>
            <p className="text-lg font-medium text-gray-600 md:text-xl">
              {institution}
            </p>
          </div>
          {
            // Edit functionality to the instructor if he visits his own hybrid page
            isAuth &&
              UserCtx.cognitoId ===
                instructor?.instructorProfile?.cognitoId && (
                <div className="w-full flex justify-end">
                  <button
                    className="edit-instructor bg-primaryColor p-2 text-white px-3 rounded-md relative right-3 mb-1"
                    onClick={() => setEditing(true)}
                  >
                    Edit{" "}
                  </button>
                </div>
              )
          }
          {console.log(UserCtx)}
          {instructor && (
            <div className="mb-4">
              <div className="w-full">
                {editing ? (
                  <textarea
                    name=""
                    id=""
                    className="text-gray-700 text-base md:text-lg italic w-full h-56 bg-slate-200 "
                    onChange={(e) => setAbout(e.target.value)}
                    value={about}
                  ></textarea>
                ) : (
                  <p className="text-gray-700 text-base md:text-lg italic break-words overflow-hidden">
                    "{instructor?.instructorProfile?.about}"
                  </p>
                )}
              </div>

              {editing &&
                isAuth &&
                UserCtx.cognitoId ===
                  instructor?.instructorProfile?.cognitoId && (
                  <div className="w-full flex justify-center space-x-3">
                    <button
                      className="bg-gray-500 text-white rounded-md p-2 px-3"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="edit-instructor bg-primaryColor p-2 text-white px-3 rounded-md "
                      onClick={() => onProfileUpdate(about)}
                    >
                      Save{" "}
                    </button>
                  </div>
                )}
            </div>
          )}

          {/* {console.log(instructors)} */}
          {instructors?.map(
            (e) =>
              e.emailId === instructor.emailId && (
                <div
                  key={e.emailId}
                  className="flex flex-col items-end justify-end"
                >
                  <img
                    src={e.image}
                    //This is a example image
                    // src="https://th.bing.com/th/id/R.e2bb45fff1e398723c711c519502d5a3?rik=SEPvooeqfgw0kA&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1535713875002-d1d0cf377fde%3fcrop%3dentropy%26cs%3dtinysrgb%26fit%3dmax%26fm%3djpg%26ixid%3dMnwxMjA3fDB8MXxzZWFyY2h8NHx8bWFsZSUyMHByb2ZpbGV8fDB8fHx8MTYyNTY2NzI4OQ%26ixlib%3drb-1.2.1%26q%3d80%26w%3d1080&ehk=Gww3MHYoEwaudln4mR6ssDjrAMbAvyoXYMsyKg5p0Ac%3d&risl=&pid=ImgRaw&r=0"
                    alt={e.name}
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 mb-3"
                  />
                </div>
              )
          )}
        </div>
        <div className="my-4"></div>
        <button className="free-demo" onClick={handleFreeTrial}>
          Register for free trials
        </button>
      </>
    );
  }
  return <></>;
};

export default InstructorTestimonial;
