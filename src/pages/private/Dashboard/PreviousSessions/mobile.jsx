import React, { useState, useContext, useEffect } from "react";
import Context from "../../../../Context/Context";
import { Pagination } from "flowbite-react";
import { API } from "aws-amplify";
import InstitutionContext from "../../../../Context/InstitutionContext";
// import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

// Other necessary imports and components

const PreviousSessionsMobile = () => {
  // const unpaidUser = {
  //   text: 'You need a subscription to access the Previous classes.',
  // }
  // const Navigate = useNavigate();
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Ctx = useContext(Context);
  const UserCtx = useContext(Context);
  const UtilCtx = useContext(Context).util;

  const [classId, setClassId] = useState("");
  const [recordingLink, setRecordingLink] = useState("");
  const [showUpdateContainer, setShowUpdateContainer] = useState(false);

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  let totalPages = Math.ceil(Ctx.previousClasses.length / itemsPerPage);
  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  // eslint-disable-next-line
  const [editingIndex, setEditingIndex] = useState(-1);

  // const instructorNamesArray = Ctx.instructorList.map((i) => i.name)

  const formatDate = (epochDate) => {
    const date = new Date(epochDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so we add 1 to get the correct month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [classTypeFilter, setClassTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [instructorTypeFilter, setinstructorTypeFilter] = useState("");
  const filteredClasses = Ctx.previousClasses.filter(
    (clas) =>
      instructorTypeFilter === "" ||
      clas.instructorNames === instructorTypeFilter
  );
  const classTypes = Array.from(
    new Set(filteredClasses.map((clas) => clas.classType))
  );

  const handleAddLink = (classId) => {
    setShowUpdateContainer(true);
    setClassId(classId);
    setRecordingLink("");
  };

  const handleCancel = () => {
    setShowUpdateContainer(false);
    setClassId("");
    setRecordingLink("");
  };

  const getInstructor = (name) => {
    return Ctx.instructorList.find(
      (i) => i.name?.toString().trim() === name?.toString().trim()
    );
  };

  const onRecordingUpdate = async (e) => {
    e.preventDefault();
    UtilCtx.setLoader(true);

    try {
      if (classId.length === 0 || recordingLink.length === 0) {
        alert("Invalid Details");
        UtilCtx.setLoader(false);
      } else {
        // Your API.put call to update the recording link here
        // ...
        await API.put(
          "main",
          `/admin/edit-schedule-recording/${InstitutionData.InstitutionId}`,
          {
            body: {
              classId: classId,
              recordingLink: recordingLink,
            },
          }
        );
        alert("Updated");

        // After successful update, update the local state
        setClassId("");
        const updatedClasses = Ctx.previousClasses.map((clas) => {
          if (clas.classId === classId) {
            return {
              ...clas,
              recordingLink: recordingLink,
            };
          }
          return clas;
        });
        Ctx.setPreviousClasses(updatedClasses);
        setShowUpdateContainer(false);
        UtilCtx.setLoader(false);
      }
    } catch (e) {
      alert(e.message);
      UtilCtx.setLoader(false);
    }
  };
  const sortedPreviousClasses = Ctx.previousClasses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // eslint-disable-next-line
  const onClassUpdated = async (
    classId,
    editedInstructorNames,
    instructorId,
    editedClassType
  ) => {
    UtilCtx.setLoader(true);

    try {
      if (!editedInstructorNames) {
        alert("Please select an instructor.");
        UtilCtx.setLoader(false);
        return;
      }

      if (!editedClassType) {
        alert("Please select an Class Type.");
        UtilCtx.setLoader(false);
        return;
      }

      const updatedClasses = Ctx.upcomingClasses.map((c) =>
        c.classId === classId
          ? {
              ...c,
              instructorNames: editedInstructorNames,
              instructorId: instructorId,
              classType: editedClassType,
            }
          : c
      );
      await API.put(
        "main",
        `/admin/edit-schedule-recording/${InstitutionData.InstitutionId}`,
        {
          body: {
            classId: classId,
            instructorNames: editedInstructorNames,
            classType: editedClassType,
          },
        }
      );
      Ctx.setUpcomingClasses(updatedClasses);

      setEditingIndex(-1);

      UtilCtx.setLoader(false);
    } catch (e) {
      alert(e.message);
      UtilCtx.setLoader(false);
    }
  };

  const onInstructorNameChange = async (
    newInstructorName,
    instructorId,
    classType,
    classId
  ) => {
    UtilCtx.setLoader(true);

    try {
      await API.put(
        "main",
        `/admin/edit-schedule-recording/${InstitutionData.InstitutionId}`,
        {
          body: {
            classId: classId,
            instructorNames: newInstructorName,
            instructorId: instructorId,
            classType: classType,
          },
        }
      );

      const updatedClasses = Ctx.previousClasses.map((clas) => {
        if (clas.classId === classId) {
          return {
            ...clas,
            instructorNames: newInstructorName,
            instructorId: instructorId,
          };
        }
        return clas;
      });

      Ctx.setPreviousClasses(updatedClasses);

      UtilCtx.setLoader(false);
    } catch (e) {
      alert(e.message);
      UtilCtx.setLoader(false);
    }
  };

  //Functions For adding attendance starts here
  const markAttendance = async (ChoosenClassId) => {
    try {
      const data = {
        classId: ChoosenClassId,
        emailId: UserCtx.userData.emailId,
      };

      const response = await API.post(
        "main",
        `/user/put-attendance/${UserCtx.userData.institution}`,
        {
          body: data,
        }
      );

      console.log(response);
      alert("Attendance Marked Successfully");
      fetchAttendance();
    } catch (error) {
      console.error(error);
      alert("An error occurred while marking attendance");
    }
  };

  const { userList } = useContext(Context);
  const [attendedUsers, setAttendedUsers] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  // eslint-disable-next-line
  const [classId2, setClassId2] = useState("");
  const [attendanceList, setAttendanceList] = useState(false);

  useEffect(() => {
    if (UserCtx.userData.userType === "admin") {
      const activeUsers = userList.filter((user) => user.status === "Active");
      setActiveUsers(activeUsers);
      const attendedIds = attendedUsers.map((user) => user.cognitoId);
      const updatedStatus = {};
      activeUsers.forEach((user) => {
        updatedStatus[user.cognitoId] = attendedIds.includes(user.cognitoId)
          ? "Attended"
          : "Not Attended";
      });
      setAttendanceStatus(updatedStatus);
      console.log(activeUsers);
    }
    // eslint-disable-next-line
  }, [UserCtx]);

  const showMembersAttended = async (classId) => {
    console.log(classId);
    try {
      const response = await API.get(
        "main",
        `/admin/query-attendance/${UserCtx.userData.institution}?classId=${classId}`
      );
      setAttendedUsers(response.Items);
      setAttendanceList(true);
      setClassId2(classId);
      console.log(response);
      // Update attendance status based on fetched attendance records
      const updatedStatus = {};
      activeUsers.forEach((user) => {
        updatedStatus[user.cognitoId] = response.Items.some(
          (attendedUser) => attendedUser.cognitoId === user.cognitoId
        )
          ? "Attended"
          : "Not Attended";
      });
      setAttendanceStatus(updatedStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showButton, setShowButton] = useState(false);

  // Function to filter users based on search term
  const filterUsers = () => {
    if (!searchTerm) {
      return activeUsers;
    } else {
      return activeUsers.filter((user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };
  const filteredUsers = filterUsers();

  // Sort the filteredUsers array based on attendance status
  filteredUsers.sort((a, b) => {
    if (
      attendanceStatus[a.cognitoId] === "Attended" &&
      attendanceStatus[b.cognitoId] !== "Attended"
    ) {
      return -1; // attended users first
    } else if (
      attendanceStatus[a.cognitoId] !== "Attended" &&
      attendanceStatus[b.cognitoId] === "Attended"
    ) {
      return 1; // non-attended users last
    } else {
      return 0; // maintain the current order
    }
  });

  const [cognitoIds, setCognitoIds] = useState("");
  const [emailIds, setEmailIds] = useState("");

  const handleCheckboxClick = async (clickedCognitoId, clickedEmailId) => {
    // Add the clicked ids to the arrays
    setShowButton(true);
    setCognitoIds(clickedCognitoId);
    setEmailIds(clickedEmailId);
  };

  const handleCheckboxUnclick = async (
    unclickedCognitoId,
    unclickedEmailId
  ) => {
    // Remove the unclicked ids from the arrays
    setShowButton(false); // Hide the button if there are no more ids
    setCognitoIds("");
    setEmailIds("");
  };

  const adminPutAttendance = async () => {
    try {
      const body = {
        cognitoId: cognitoIds,
        emailId: emailIds,
        classId: classId,
      };

      // Make API request to mark attendance
      await API.post(
        "main",
        `/admin/put-attendance/${UserCtx.userData.institution}`,
        { body: body }
      );

      // Update attended status for the user
      const updatedAttendanceStatus = { ...attendanceStatus };
      updatedAttendanceStatus[cognitoIds] = "Attended";
      setAttendanceStatus(updatedAttendanceStatus);

      // Deselect checkbox and reset cognitoIds and emailIds
      handleCheckboxUnclick();

      alert("Attendance marked successfully");
    } catch (error) {
      console.log(error);
      alert("An error occurred while putting Attendance");
    } finally {
      showMembersAttended(classId);
    }
  };

  const fetchAttendance = async () => {
    const sortedClasses = [...sortedPreviousClasses];

    // Prepare initial attendance status
    const initialStatus = {};
    sortedClasses.forEach(({ classId }) => {
      initialStatus[classId] = "Loading..."; // Show loading initially
    });
    setAttendanceStatus(initialStatus);

    const updateAttendanceStatus = (classId, status) => {
      setAttendanceStatus((prevAttendanceStatus) => ({
        ...prevAttendanceStatus,
        [classId]: status,
      }));
    };

    // Fetch attendance for classes scheduled today
    for (const { classId } of sortedClasses) {
      try {
        const response = await API.get(
          "main",
          `/admin/query-attendance/${UserCtx.userData.institution}?classId=${classId}&userId=${UserCtx.userData.cognitoId}`
        );
        if (response.Items.length > 0) {
          const { cognitoId } = response.Items[0];

          if (cognitoId === UserCtx.userData.cognitoId) {
            updateAttendanceStatus(classId, "Attended");
          } else {
            updateAttendanceStatus(classId, "Mark Attendance");
          }
        } else {
          updateAttendanceStatus(classId, "Mark Attendance"); // Default to 'Mark Attendance'
        }
      } catch (error) {
        console.error(error);
        updateAttendanceStatus(classId, "Mark Attendance"); // Handle error case
      }
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line
  }, [UserCtx]);

  let classes = sortedPreviousClasses
    .filter((clas) => {
      if (instructorTypeFilter === "") {
        return true;
      } else {
        return clas.instructorNames === instructorTypeFilter;
      }
    })
    .filter((clas) => {
      if (classTypeFilter === "") {
        return true;
      } else {
        return clas.classType === classTypeFilter;
      }
    });
  totalPages = Math.ceil(classes.length / itemsPerPage);

  if (classes.length < itemsPerPage) {
    startIndex = 0;
    endIndex = classes.length;
  } else {
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
  }

  return (
    <>
      <div>
        <div className={`w-full px-2 pb-4`}>
          <h2
            className={`text-[1.4rem] mb-3 font-bold text-black-700 mt-10 text-center`}
          >
            Previous Sessions
          </h2>

          <div className="w-full flex justify-end mb-3 mr-2">
            <Button
              color={"primary"}
              onClick={() => {
                setShowFilters(!showFilters);
              }}
            >
              Filter
            </Button>
          </div>
          <div className={`flex flex-col-reverse w-full`}>
            <div className={`filters ${showFilters ? "show" : ""}`}>
              <div className={`w-[95%] flex justify-end m-[0.8rem] gap-3`}>
                <label className={`font-bold`} htmlFor="instructorTypeFilter">
                  Instructor:{" "}
                </label>
                <select
                  className={`rounded-[0.51rem] px-4`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor,
                  }}
                  id="instructorTypeFilter"
                  value={instructorTypeFilter}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setinstructorTypeFilter(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  {Array.from(
                    new Set(
                      Ctx.previousClasses.map((clas) => clas.instructorNames)
                    )
                  ).map((instructorNames) => (
                    <option key={instructorNames} value={instructorNames}>
                      {instructorNames}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`w-[95%] flex justify-end m-[0.8rem] gap-3`}>
                <label className={`font-bold`} htmlFor="classTypeFilter">
                  Classes:{" "}
                </label>
                <select
                  className={`rounded-[0.51rem] px-4 `}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor,
                  }}
                  id="classTypeFilter"
                  value={classTypeFilter}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setClassTypeFilter(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  {classTypes.map((classType) => (
                    <option key={classType} value={classType}>
                      {classType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {!attendanceList ? (
            <div
              className={`grid gap-[1.4rem] md:gap-4 grid-cols-1 sm:grid-cols-2`}
            >
              {classes.slice(startIndex, endIndex).map((clas, i) => (
                <div key={clas.classId} className={`class-container`}>
                  <div
                    className={`rounded-lg p-3 md:p-4 shadow-md relative`}
                    style={{
                      background: InstitutionData.SecondaryColor,
                      boxShadow: "0 0px 15px rgba(0, 0, 0, 0.4)",
                      borderRadius: "1.8rem",
                    }}
                  >
                    <div className="absolute bottom-0 h-12 left-0 w-[100%] bg-gradient-to-b from-transparent to-[#00000070] rounded-b-3xl"></div>
                    <div className={`flex justify-between items-center `}>
                      <div className={`w-[7rem] attractive-dropdown-container`}>
                        {Ctx.userData.userType === "admin" ||
                        Ctx.userData.userType === "instructor" ? (
                          <div className={`dropdown-wrapper`}>
                            <select
                              className={`rounded-[0.51rem] px-1 attractive-dropdown" // Add the CSS class "attractive-dropdown`}
                              style={{
                                backgroundColor: InstitutionData.SecondaryColor,
                              }}
                              value={clas.instructorNames}
                              onChange={(e) =>
                                onInstructorNameChange(
                                  e.target.value,
                                  getInstructor(e.target.value).name,
                                  clas.classType,
                                  clas.classId
                                )
                              }
                            >
                              {Ctx.instructorList
                                .sort(function (a, b) {
                                  if (a.name < b.name) {
                                    return -1;
                                  }
                                  if (a.name > b.name) {
                                    return 1;
                                  }
                                  return 0;
                                })
                                .map(
                                  (i) =>
                                    i.name !== "cancelled" && (
                                      <option
                                        key={i.name}
                                        value={i.name}
                                        onChange={(e) => {}}
                                      >
                                        {i.name}
                                      </option>
                                    )
                                )}
                              <option
                                key="cancelled"
                                value="cancelled"
                                onChange={(e) => {}}
                              >
                                cancelled
                              </option>
                            </select>
                            {/* <div className={`dropdown-arrow`}></div> */}
                          </div>
                        ) : (
                          <p className={`rounded-[0.51rem] bg-[#04f8bf00]`}>
                            {clas.instructorNames}
                          </p>
                        )}
                      </div>
                      {UserCtx.userData.userType === "admin" &&
                        (showUpdateContainer && classId === clas.classId ? (
                          <button
                            className={`sans-sarif rounded-lg py-1 w-[4.8rem] bg-black text-white`}
                            onClick={handleCancel}
                            style={{
                              borderRadius: "0.8rem",
                            }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            className={`sans-sarif font-[400] rounded-lg py-1 w-[4.8rem] bg-black text-white`}
                            onClick={() => handleAddLink(clas.classId)}
                          >
                            Add
                          </button>
                        ))}
                    </div>
                    <div className={`mb-1`}>Class: {clas.classType}</div>
                    <div>Date: {formatDate(clas.date)}</div>
                    {UserCtx.userData.userType === "admin" && (
                      <div className="flex gap-2">
                        <p className="font-[600]">
                          See Attendance Details{" "}
                          <span className="text-[1.1rem] font-bold">→</span>
                        </p>
                        <p
                          className=" text-blue-600 underline z-10"
                          onClick={() => showMembersAttended(clas.classId)}
                        >
                          View
                        </p>
                      </div>
                    )}
                    {clas.recordingLink && (
                      <div className={`mb-2`}>
                        Recording Link:{" "}
                        {clas.recordingLink ? (
                          <a
                            href={clas.recordingLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Watch
                          </a>
                        ) : (
                          "No Link"
                        )}
                      </div>
                    )}
                    {!clas.zoomLink &&
                      UserCtx.userData.userType === "member" && (
                        <button
                          className="px-2 p-1 w-[9rem] text-[black] rounded-1 bg-[#0c754800] absolute right-3 bottom-1/4 z-20 border border-black text-center"
                          onClick={() => markAttendance(clas.classId)}
                        >
                          {attendanceStatus[clas.classId]}
                        </button>
                      )}
                    {showUpdateContainer && classId === clas.classId && (
                      <div className={`mt-2`}>
                        <form className={`update-container`}>
                          <input
                            placeholder="Recording Link"
                            className={`bg-snow sans-sarif px-4 py-1 rounded-lg w-[74%]`}
                            value={recordingLink}
                            onChange={(e) => setRecordingLink(e.target.value)}
                            style={{
                              borderRadius: "1.8rem",
                            }}
                          />
                          <button
                            className={`sans-sarif mt-2 ml-1 rounded-lg py-1 w-[4.8rem] bg-black text-white`}
                            onClick={onRecordingUpdate}
                            style={{
                              borderRadius: "1rem",
                            }}
                          >
                            Update
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div
                className={`grid gap-[1.4rem] md:gap-4 grid-cols-1 sm:grid-cols-2 mx-auto`}
              >
                <div className="flex ml-[-6rem] mx-auto w-[98vw] mb-3 mt-[-1rem] justify-between items-center h-[4rem]">
                  <div
                    className="text-[2.5rem] px-4 cursor-pointer"
                    onClick={() => setAttendanceList(false)}
                  >
                    ←
                  </div>
                  <div className="flex-col">
                    <div className="flex ">
                      <input
                        type="text"
                        placeholder="Search by user name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ height: "2rem" }} // Apply height style here
                        className="focus:outline-none flex-grow border border-black p-3 w-[70vw]"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="gray"
                        className="w-6 h-6 relative right-8 top-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>
                    <button
                      className={
                        showButton
                          ? " text-white p-1 px-2 mr-3 rounded-[3px] mt-3 ml-[8rem]"
                          : "hidden"
                      }
                      onClick={adminPutAttendance}
                      style={{ backgroundColor: InstitutionData.PrimaryColor }}
                    >
                      Mark Attendance
                    </button>
                  </div>
                </div>
                <div className="overflow-y-scroll">
                  {filteredUsers.map((user) => (
                    // <div key={user.cognitoId} className='grid grid-cols-3 text-black font-[400] text-center'>
                    <div
                      className={`rounded-lg p-3 md:p-4 shadow-md relative mb-4`}
                      style={{
                        background: InstitutionData.SecondaryColor,
                        boxShadow: "0 0px 15px rgba(0, 0, 0, 0.4)",
                        borderRadius: "1.8rem",
                      }}
                    >
                      <div className="flex justify-between">
                        <p className="text-[1.2rem]">
                          <span className="font-bold">Name: </span>
                          {user.userName}
                        </p>
                        <p>
                          <span className="font-bold">
                            {attendanceStatus[user.cognitoId]}
                          </span>
                        </p>
                      </div>
                      <p>
                        <span className="font-[600]">Email: </span>
                        {user.emailId}
                      </p>
                      <p>
                        <span className="font-[600]">PhoneNumber: </span>
                        {user.phoneNumber}
                      </p>
                      <div className="flex gap-2">
                        <p>select to mark attendance</p>
                        <label className="custom-checkbox mt-[2px]">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={(event) =>
                              event.target.checked
                                ? handleCheckboxClick(
                                    user.cognitoId,
                                    user.emailId
                                  )
                                : handleCheckboxUnclick(
                                    user.cognitoId,
                                    user.emailId
                                  )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <div
            className={`flex mb-[6rem] justify-center items-center mt-4 md:mt-6`}
          >
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(value) => setCurrentPage(value)}
            />
          </div>
        </div>
      </div>
      {/* } */}
    </>
  );
};

export default PreviousSessionsMobile;
