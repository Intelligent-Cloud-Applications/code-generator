import { API } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import Context from "../../../../Context/Context";
import { Button, Pagination } from "flowbite-react";
import PreviousSessionsMobile from "./mobile";
import { useMediaQuery } from "../../../../utils/helpers";
import { Button2 } from "../../../../common/Inputs";
import InstitutionContext from "../../../../Context/InstitutionContext";
import { toast } from "react-toastify";

// import { useNavigate } from "react-router-dom";

const formatDate = (epochDate) => {
  const date = new Date(epochDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so we add 1 to get the correct month
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const PreviousSessions = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const [classId, setClassId] = useState("");
  const [recordingLink, setRecordingLink] = useState("");
  const UserCtx = useContext(Context);
  const Ctx = useContext(Context);
  const UtilCtx = useContext(Context).util;
  // const Navigate = useNavigate()

  // const instructorNamesOptions = Ctx.instructorList.map((i) => i.name)
  const [classTypeFilter, setClassTypeFilter] = useState("");
  const [instructorTypeFilter, setinstructorTypeFilter] = useState("");
  const filteredClasses = Ctx.previousClasses.filter(
    (clas) =>
      instructorTypeFilter === "" ||
      clas.instructorNames === instructorTypeFilter
  );

  const classTypes = Array.from(
    new Set(filteredClasses.map((clas) => clas.classType))
  );

  const getInstructor = (name) => {
    return Ctx.instructorList.find(
      (i) => i.name?.toString().trim() === name?.toString().trim()
    );
  };

  const isMobileScreen = useMediaQuery("(max-width: 600px)");
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  let totalPages = Math.ceil(Ctx.previousClasses.length / itemsPerPage);
  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  const [showFilters, setShowFilters] = useState(false);

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
        `/admin/edit-schedule-name/${InstitutionData.InstitutionId}`,
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

  const onRecordingUpdate = async (e) => {
    e.preventDefault();
    UtilCtx.setLoader(true);

    try {
      if (classId.length === 0 && recordingLink.length === 0) {
        alert("Invalid Details");
        UtilCtx.setLoader(false);
      } else {
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
        toast.success("Recording Link Updated Successfully");

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

  //attendance
  const { userList } = useContext(Context);
  const [attendedUsers, setAttendedUsers] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [classId2, setClassId2] = useState("");
  const [attendanceList, setAttendanceList] = useState(false);
  const [currentPageAttendance, setCurrentPageAttendance] = useState(1);
  const usersPerPage = 10;
  useEffect(() => {
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
    // eslint-disable-next-line
  }, [UserCtx]);
  const indexOfLastUser = currentPageAttendance * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = activeUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (value) => {
    setCurrentPageAttendance(value);
  };

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
  const blurClass = "blur";
  const handleCheckboxClick = async (clickedCognitoId, clickedEmailId) => {
    // Add the clicked ids to the arrays
    setShowButton(true);
    setCognitoIds(clickedCognitoId);
    setEmailIds(clickedEmailId);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Loop through checkboxes
    checkboxes.forEach((checkbox) => {
      // Check if checkbox is checked
      if (checkbox.checked) {
        // Remove blur class from checked checkbox's parent container
        checkbox.closest(".grid").classList.remove(blurClass);
      } else {
        // Apply blur class to unchecked checkbox's parent container
        checkbox.closest(".grid").classList.add(blurClass);
      }
    });
  };

  const handleCheckboxUnclick = async (
    unclickedCognitoId,
    unclickedEmailId
  ) => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    setShowButton(false); // Hide the button if there are no more ids
    setCognitoIds("");
    setEmailIds("");
    checkboxes.forEach((checkbox) => {
      checkbox.closest(".grid").classList.remove(blurClass);
    });
  };

  const adminPutAttendance = async () => {
    try {
      const body = {
        cognitoId: cognitoIds,
        emailId: emailIds,
        classId: classId2,
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
      showMembersAttended(classId2);
    }
  };

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
      {!isMobileScreen && (
        <>
          <div className={`w-[100%] flex flex-col items-center pt-6 gap-3`}>
            <h2 className={`text-[1.6rem] sans-sarif font-[700]`}>
              Previous Sessions
            </h2>
            {/* <div className={`w-[80%] flex justify-start`}>
              <button
                className={`filter-button w-[8rem] tracking-[1.3px] text-[1.1rem] m-[1rem] mr-0 ml-12 rounded-[0.2rem] text-white`}
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  backgroundColor: InstitutionData.PrimaryColor
                }}
              >
                Filter
              </button>
            </div> */}
            <div className="w-[75%] flex justify-end">
              <Button
                color={"primary"}
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
              >
                Filter
              </Button>
            </div>
            <div className={`flex flex-col-reverse w-[75%]`}>
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

            {(Ctx.userData.userType === "admin" ||
              Ctx.userData.userType === "instructor") &&
              classId && (
                <form className={`flex gap-6 w-[88%] Sansita`}>
                  <input
                    placeholder="Recording Link"
                    className={` text-[#0008] sans-sarif px-4 py-1 rounded-lg w-[85%]`}
                    style={{
                      backgroundColor: InstitutionData.LightestPrimaryColor,
                    }}
                    value={recordingLink}
                    onChange={(e) => setRecordingLink(e.target.value)}
                  />
                  <Button2 fn={onRecordingUpdate} data="Update" w="6rem" />
                </form>
              )}

            <ul
              className={`relative pb-[3rem] w-[75%] min-h-[62vh] flex flex-col rounded-3 items-center justify-start pt-6`}
              style={{
                backgroundColor: InstitutionData.LightestPrimaryColor,
              }}
            >
              {!attendanceList ? (
                <li
                  className={`w-[96%] flex flex-col items-center justify-center p-2`}
                >
                  <div
                    className={`flex w-[85%] justify-between  mb-3 font-bold`}
                  >
                    <p className={`w-[25%] overflow-hidden`}>Instructor</p>
                    <p
                      className={`w-[20%] text-left overflow-hidden ml-[-4rem]`}
                    >
                      Class
                    </p>
                    <p className={`overflow-hidden w-[3.7rem] ml-[-1rem] `}>
                      Date
                    </p>
                    <p
                      className={
                        UserCtx.userData.userType === "member"
                          ? "w-[7.3rem] mr-0"
                          : `w-[7.3rem] mr-[3.5rem]`
                      }
                    >
                      Recording Link
                    </p>
                  </div>
                </li>
              ) : (
                <div
                  className="flex w-full ml-[-2rem] mb-3 mt-[-1rem] justify-between border-b-2 items-center h-[4rem]"
                  style={{
                    borderColor: InstitutionData.PrimaryColor,
                    backgroundColor: InstitutionData.LightestPrimaryColor,
                  }}
                >
                  <div
                    className="text-[2.5rem] px-4 cursor-pointer"
                    onClick={() => setAttendanceList(false)}
                  >
                    ←
                  </div>
                  <div className="flex ">
                    <input
                      type="text"
                      placeholder="Search by user name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ height: "2rem" }} // Apply height style here
                      className="focus:outline-none  px-4 py-2 w-[25rem] "
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
                        ? "bg-[#1b7571] text-white p-1 px-2 mr-3 rounded-[3px]"
                        : "bg-transparent text-transparent"
                    }
                    onClick={adminPutAttendance}
                  >
                    Mark Attendance
                  </button>
                </div>
              )}
              <div
                className={`overflow-auto flex flex-col gap-2 w-[100%] items-center`}
              >
                {!attendanceList ? (
                  <div
                    className={`overflow-auto flex flex-col gap-2 w-[100%] items-center`}
                  >
                    {classes.slice(startIndex, endIndex).map((clas, i) => {
                      return (
                        <li
                          key={clas.classId}
                          className={`w-[96%] flex flex-col items-center justify-center p-2`}
                        >
                          <div
                            className={`flex w-[85%] justify-between items-center relative`}
                          >
                            <div className={`w-[25%] overflow-hidden relative`}>
                              {Ctx.userData.userType === "admin" ||
                              Ctx.userData.userType === "instructor" ? (
                                <select
                                  className={`rounded-[0.51rem] pr-[1.5rem] pl-[0rem]`}
                                  style={{
                                    backgroundColor:
                                      InstitutionData.LightestPrimaryColor,
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
                              ) : (
                                clas.instructorNames
                              )}
                            </div>
                            <p
                              className={`w-[25%] text-left overflow-hidden m-0`}
                            >
                              {clas.classType}
                            </p>
                            <p className={`overflow-hidden w-[5.7rem] m-0`}>
                              {formatDate(parseInt(clas.date))}
                            </p>
                            <div
                              className={
                                !(UserCtx.userData.userType === "member")
                                  ? "flex gap-5"
                                  : ""
                              }
                            >
                              <div
                                className={`w-[9rem] rounded-[4px] max-h-[1.8rem] self-center flex justify-center items-center`}
                                style={{
                                  backgroundColor: InstitutionData.PrimaryColor,
                                }}
                              >
                                {clas.recordingLink ? (
                                  <a
                                    href={clas.recordingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`no-underline px-2 text-center w-[9rem] sans-sarif text-white`}
                                  >
                                    Watch
                                  </a>
                                ) : (
                                  <div className="w-[9rem] rounded-[4px] px-2 max-h-[1.8rem] self-center flex justify-center items-start">
                                    {Ctx.userData.userType === "admin" ||
                                    Ctx.userData.userType === "instructor" ? (
                                      <div>
                                        {classId === clas.classId ? (
                                          <button
                                            className={`px-2 py-1 sans-sarif text-[0.9rem] text-white`}
                                            onClick={() => {
                                              setClassId("");
                                              setRecordingLink("");
                                            }}
                                          >
                                            Cancel
                                          </button>
                                        ) : (
                                          <button
                                            className={`w-[3rem] px-2 py-1 sans-sarif text-white`}
                                            onClick={() => {
                                              setClassId(clas.classId);
                                              setRecordingLink(
                                                clas.recordingLink
                                              );
                                            }}
                                          >
                                            Add
                                          </button>
                                        )}
                                      </div>
                                    ) : !clas.zoomLink ? (
                                      <button
                                        className="w-[9rem] max-h-[1.8rem] text-white no-underline rounded-1"
                                        style={{
                                          backgroundColor:
                                            InstitutionData.PrimaryColor,
                                        }}
                                        onClick={() =>
                                          markAttendance(clas.classId)
                                        }
                                      >
                                        {attendanceStatus[clas.classId]}
                                      </button>
                                    ) : (
                                      <button
                                        className="w-[9rem] max-h-[1.8rem] text-white no-underline rounded-1"
                                        style={{
                                          backgroundColor:
                                            InstitutionData.PrimaryColor,
                                        }}
                                        onClick={() =>
                                          markAttendance(clas.classId)
                                        }
                                      >
                                        No Link
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div
                                className={
                                  "w-fit" +
                                  (UserCtx.userData.userType === "member"
                                    ? " hidden"
                                    : " ")
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 cursor-pointer"
                                  onClick={() =>
                                    showMembersAttended(clas.classId)
                                  }
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <div className="w-full grid grid-cols-6 text-black text-[1.1rem] font-[600]">
                      <p>User Name</p>
                      <p className="col-span-2">Email ID</p>
                      <p>Phone Number</p>
                      <p>Attendance Status</p>
                      <div></div>
                    </div>
                    <div className="w-full max-h-[30rem]">
                      {currentUsers.map((user) => (
                        <div
                          key={user.cognitoId}
                          className="grid grid-cols-6 text-black font-[400]"
                        >
                          <p>{user.userName}</p>
                          <p className="col-span-2">{user.emailId}</p>
                          <p>{user.phoneNumber}</p>
                          <p>{attendanceStatus[user.cognitoId]}</p>
                          {attendanceStatus[user.cognitoId] !== "Attended" && (
                            <label className="custom-checkbox">
                              <input
                                type="checkbox"
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
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-3">
                      <Pagination
                        totalPages={Math.ceil(
                          activeUsers.length / usersPerPage
                        )}
                        currentPage={currentPageAttendance}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </>
                )}
                {!attendanceList && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 flex justify-center mb-4`}
                  >
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={(value) => setCurrentPage(value)}
                    />
                  </div>
                )}
              </div>
            </ul>
          </div>
          {/* ) */}
        </>
      )}

      {/* Conditionally render the PreviousSessionsMobile component */}
      {isMobileScreen && <PreviousSessionsMobile />}
    </>
  );
};

export default PreviousSessions;
