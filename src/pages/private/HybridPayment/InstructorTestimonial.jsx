import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import Context from "../../../Context/Context";
import { API } from "aws-amplify";
import apiPaths from "../../../utils/api-paths";

const InstructorTestimonial = () => {
  const Util = useContext(Context).util;
  const [loading, setLoading] = useState(true);
  const { userData: UserCtx } = useContext(Context);
  const [instructors, setInstructors] = useState([]);
  const [instructor, setInstructor] = useState({});

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

  console.log("Referral:", referral);
  console.log("Institution:", institution);

  useEffect(() => {
    const fetchInstructor = async () => {
      Util.setLoader(true); // Start loading
      try {
        const response = await API.get(
          "main",
          `/instructor/profile/${institution}?cognitoId=${cognitoId}`
        );
        setInstructor(response);
        console.log(instructor);
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

 if (Util.loader) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-gray-600">Loading...</div>
    </div>
  );
}

if (referral && institution) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mt-8">
      <div className="text-center mb-4">
        <p className="text-2xl font-semibold text-gray-800 md:text-3xl underline">
          {referral}
        </p>
        <p className="text-lg font-medium text-gray-600 md:text-xl">
          {institution}
        </p>
      </div>

      {instructor && (
        <div className="mb-4">
          <p className="text-gray-700 text-base md:text-lg italic">
            "{instructor.about}"
          </p>
        </div>
      )}
      {console.log(instructors)}
      {instructors?.map(
        (e) =>
          e.emailId === instructor.emailId && (
            <div key={e.emailId} className="flex flex-col items-center">
              <img
                src={e.image}
                alt={e.name}
                className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 mb-3"
              />
              <p className="text-gray-800 font-semibold">{e.name}</p>
            </div>
          )
      )}
    </div>
  );
}return <></>

};

export default InstructorTestimonial;