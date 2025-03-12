import { API } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import Context from "../../../../Context/Context";
import { Button, Pagination } from "flowbite-react";
import PreviousSessionsMobile from "./mobile";
import { useMediaQuery } from "../../../../utils/helpers";
import { Button2 } from "../../../../common/Inputs";
import InstitutionContext from "../../../../Context/InstitutionContext";
import { toast } from "react-toastify";


import { Table } from "flowbite-react";

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
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const UserCtx = useContext(Context);
  const Ctx = useContext(Context);
  const UtilCtx = useContext(Context).util;
  // const Navigate = useNavigate()

  // const instructorNamesOptions = Ctx.instructorList.map((i) => i.name)
  const [classTypeFilter, setClassTypeFilter] = useState("");
  const [instructorTypeFilter, setinstructorTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // First sort the classes by date
  const sortedPreviousClasses = Ctx.previousClasses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Then apply filters
  const filteredClasses = sortedPreviousClasses
    .filter((clas) => {
      if (instructorTypeFilter === "") {
        return true;
      }
      return clas.instructorNames === instructorTypeFilter;
    })
    .filter((clas) => {
      if (classTypeFilter === "") {
        return true;
      }
      return clas.classType === classTypeFilter;
    });

  const classTypes = Array.from(
    new Set(sortedPreviousClasses.map((clas) => clas.classType))
  );

  // Pagination logic
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Get current page classes
  const currentClasses = filteredClasses.slice(startIndex, endIndex);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // const onInstructorNameChange = async (
  //   newInstructorName,
  //   instructorId,
  //   classType,
  //   classId
  // ) => {
  //   UtilCtx.setLoader(true);

  //   try {
  //     await API.put(
  //       "main",
  //       `/admin/edit-schedule-name/${InstitutionData.InstitutionId}`,
  //       {
  //         body: {
  //           classId: classId,
  //           instructorNames: newInstructorName,
  //           instructorId: instructorId,
  //           classType: classType,
  //         },
  //       }
  //     );

  //     const updatedClasses = Ctx.previousClasses.map((clas) => {
  //       if (clas.classId === classId) {
  //         return {
  //           ...clas,
  //           instructorNames: newInstructorName,
  //           instructorId: instructorId,
  //         };
  //       }
  //       return clas;
  //     });

  //     Ctx.setPreviousClasses(updatedClasses);

  //     UtilCtx.setLoader(false);
  //   } catch (e) {
  //     alert(e.message);
  //     UtilCtx.setLoader(false);
  //   }
  // };

  const onRecordingUpdate = async (e) => {
    e.preventDefault();
    UtilCtx.setLoader(true);

    try {
      if (!selectedClassId || !recordingLink) {
        toast.error("Invalid Details");
        UtilCtx.setLoader(false);
        return;
      }

      await API.put(
        "main",
        `/admin/edit-schedule-recording/${InstitutionData.InstitutionId}`,
        {
          body: {
            classId: selectedClassId,
            recordingLink: recordingLink,
          },
        }
      );
      
      toast.success("Recording Link Updated Successfully");

      const updatedClasses = Ctx.previousClasses.map((clas) => {
        if (clas.classId === selectedClassId) {
          return {
            ...clas,
            recordingLink: recordingLink,
          };
        }
        return clas;
      });

      Ctx.setPreviousClasses(updatedClasses);
      setSelectedClassId(null);
      setRecordingLink("");
      setShowUpdateModal(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      UtilCtx.setLoader(false);
    }
  };

  const handleUpdateClick = (classId, currentLink) => {
    setSelectedClassId(classId);
    setRecordingLink(currentLink || "");
    setShowUpdateModal(true);
  };

  //attendance
  const { userList = [], userAttendance = {} } = useContext(Context) || {};
  const [attendedUsers, setAttendedUsers] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [classId2, setClassId2] = useState("");
  const [attendanceList, setAttendanceList] = useState(false);
  const [currentPageAttendance, setCurrentPageAttendance] = useState(1);
  const usersPerPage = 10;
  useEffect(() => {
    const activeUsers = (userList || []).filter((user) => user?.status === "Active");
    setActiveUsers(activeUsers.toSorted((a, b) => {
      const x = userAttendance[a?.cognitoId] || 0;
      const y = userAttendance[b?.cognitoId] || 0;
      return y - x;
    }));
    const attendedIds = attendedUsers.map((user) => user?.cognitoId);
    const updatedStatus = {};
    activeUsers.forEach((user) => {
      if (user?.cognitoId) {
        updatedStatus[user.cognitoId] = attendedIds.includes(user.cognitoId)
          ? "Attended"
          : "Not Attended";
      }
    });
    setAttendanceStatus(updatedStatus);
    console.log(activeUsers);
    // eslint-disable-next-line
  }, [UserCtx]);
  const indexOfLastUser = currentPageAttendance * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = activeUsers.slice(indexOfFirstUser, indexOfLastUser);

  // const handlePageChange = (value) => {
  //   setCurrentPageAttendance(value);
  // };

  // const showMembersAttended = async (classId) => {
  //   console.log(classId);
  //   try {
  //     const response = await API.get(
  //       "main",
  //       `/admin/query-attendance/${UserCtx.userData.institution}?classId=${classId}`
  //     );
  //     setAttendedUsers(response.Items);
  //     setAttendanceList(true);
  //     setClassId2(classId);
  //     console.log(response);
  //     // Update attendance status based on fetched attendance records
  //     const updatedStatus = {};
  //     activeUsers.forEach((user) => {
  //       updatedStatus[user.cognitoId] = response.Items.some(
  //         (attendedUser) => attendedUser.cognitoId === user.cognitoId
  //       )
  //         ? "Attended"
  //         : "Not Attended";
  //     });
  //     setAttendanceStatus(updatedStatus);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [searchTerm, setSearchTerm] = useState("");
  const [showButton, setShowButton] = useState(false);

  // Function to filter users based on search term
  // const filterUsers = () => {
  //   if (!searchTerm) {
  //     return activeUsers;
  //   } else {
  //     return activeUsers.filter((user) =>
  //       user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }
  // };
  // const filteredUsers = filterUsers();

  // Sort the filteredUsers array based on attendance status
  // filteredUsers.sort((a, b) => {
  //   if (
  //     attendanceStatus[a.cognitoId] === "Attended" &&
  //     attendanceStatus[b.cognitoId] !== "Attended"
  //   ) {
  //     return -1; // attended users first
  //   } else if (
  //     attendanceStatus[a.cognitoId] !== "Attended" &&
  //     attendanceStatus[b.cognitoId] === "Attended"
  //   ) {
  //     return 1; // non-attended users last
  //   } else {
  //     return 0; // maintain the current order
  //   }
  // });

  const [cognitoIds, setCognitoIds] = useState("");
  const [emailIds, setEmailIds] = useState("");
  const blurClass = "blur";
  // const handleCheckboxClick = async (clickedCognitoId, clickedEmailId) => {
  //   // Add the clicked ids to the arrays
  //   setShowButton(true);
  //   setCognitoIds(clickedCognitoId);
  //   setEmailIds(clickedEmailId);
  //   const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  //   // Loop through checkboxes
  //   checkboxes.forEach((checkbox) => {
  //     // Check if checkbox is checked
  //     if (checkbox.checked) {
  //       // Remove blur class from checked checkbox's parent container
  //       checkbox.closest(".grid").classList.remove(blurClass);
  //     } else {
  //       // Apply blur class to unchecked checkbox's parent container
  //       checkbox.closest(".grid").classList.add(blurClass);
  //       checkbox.disabled = true;
  //     }
  //   });
  // };

  // const handleCheckboxUnclick = async (
  //   unclickedCognitoId,
  //   unclickedEmailId
  // ) => {
  //   const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  //   setShowButton(false); // Hide the button if there are no more ids
  //   setCognitoIds("");
  //   setEmailIds("");
  //   checkboxes.forEach((checkbox) => {
  //     checkbox.closest(".grid").classList.remove(blurClass);
  //     checkbox.disabled = false;
  //   });
  // };

  // useEffect(() => {
  //   handleCheckboxUnclick("", "");
  // }, [currentPageAttendance]);

  // const adminPutAttendance = async () => {
  //   try {
  //     const body = {
  //       cognitoId: cognitoIds,
  //       emailId: emailIds,
  //       classId: classId2,
  //     };

  //     // Make API request to mark attendance
  //     await API.post(
  //       "main",
  //       `/admin/put-attendance/${UserCtx.userData.institution}`,
  //       { body: body }
  //     );

  //     // Update attended status for the user
  //     const updatedAttendanceStatus = { ...attendanceStatus };
  //     updatedAttendanceStatus[cognitoIds] = "Attended";
  //     setAttendanceStatus(updatedAttendanceStatus);

  //     // Deselect checkbox and reset cognitoIds and emailIds
  //     handleCheckboxUnclick();

  //     alert("Attendance marked successfully");
  //   } catch (error) {
  //     console.log(error);
  //     alert("An error occurred while putting Attendance");
  //   } finally {
  //     showMembersAttended(classId2);
  //   }
  // };

  // const markAttendance = async (ChoosenClassId) => {
  //   try {
  //     const data = {
  //       classId: ChoosenClassId,
  //       emailId: UserCtx.userData.emailId,
  //     };

  //     const response = await API.post(
  //       "main",
  //       `/user/put-attendance/${UserCtx.userData.institution}`,
  //       {
  //         body: data,
  //       }
  //     );

  //     console.log(response);
  //     alert("Attendance Marked Successfully");
  //     fetchAttendance();
  //   } catch (error) {
  //     console.error(error);
  //     alert("An error occurred while marking attendance");
  //   }
  // };

  // const fetchAttendance = async () => {
  //   const sortedClasses = [...sortedPreviousClasses];

  //   // Prepare initial attendance status
  //   const initialStatus = {};
  //   sortedClasses.forEach(({ classId }) => {
  //     initialStatus[classId] = "Loading..."; // Show loading initially
  //   });
  //   setAttendanceStatus(initialStatus);

  //   const updateAttendanceStatus = (classId, status) => {
  //     setAttendanceStatus((prevAttendanceStatus) => ({
  //       ...prevAttendanceStatus,
  //       [classId]: status,
  //     }));
  //   };

  //   // Fetch attendance for classes scheduled today
  //   for (const { classId } of sortedClasses) {
  //     try {
  //       const response = await API.get(
  //         "main",
  //         `/admin/query-attendance/${UserCtx.userData.institution}?classId=${classId}&userId=${UserCtx.userData.cognitoId}`
  //       );
  //       if (response.Items.length > 0) {
  //         const { cognitoId } = response.Items[0];

  //         if (cognitoId === UserCtx.userData.cognitoId) {
  //           updateAttendanceStatus(classId, "Attended");
  //         } else {
  //           updateAttendanceStatus(classId, "Mark Attendance");
  //         }
  //       } else {
  //         updateAttendanceStatus(classId, "Mark Attendance"); // Default to 'Mark Attendance'
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       updateAttendanceStatus(classId, "Mark Attendance"); // Handle error case
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchAttendance();
  //   // eslint-disable-next-line
  // }, [UserCtx]);
  
  // let classes = sortedPreviousClasses
  //   .filter((clas) => {
  //     if (instructorTypeFilter === "") {
  //       return true;
  //     } else {
  //       return clas.instructorNames === instructorTypeFilter;
  //     }
  //   })
  //   .filter((clas) => {
  //     if (classTypeFilter === "") {
  //       return true;
  //     } else {
  //       return clas.classType === classTypeFilter;
  //     }
  //   });

  // totalPages = Math.ceil(classes.length / itemsPerPage);

  // if (classes.length < itemsPerPage) {
  //   startIndex = 0;
  //   endIndex = classes.length;
  // } else {
  //   startIndex = (currentPage - 1) * itemsPerPage;
  //   endIndex = startIndex + itemsPerPage;
  // }

  const isMobileScreen = useMediaQuery("(max-width: 600px)");

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState(null);
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState({});

  const handleAttendanceClick = async (classId) => {
    setSelectedClassForAttendance(classId);
    setShowAttendanceModal(true);
    
    try {
      const response = await API.get(
        "main",
        `/admin/query-attendance/${UserCtx.userData.institution}?classId=${classId}`
      );
      const attendedUsers = response.Items || [];
      const initialSelectedUsers = {};
      
      // Initialize with currently attended users
      attendedUsers.forEach(user => {
        initialSelectedUsers[user.cognitoId] = true;
      });
      
      setSelectedUsers(initialSelectedUsers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch attendance data");
    }
  };

  const handleToggleAttendance = (cognitoId) => {
    setSelectedUsers(prev => ({
      ...prev,
      [cognitoId]: !prev[cognitoId]
    }));
  };

  const handleSaveAttendance = async () => {
    UtilCtx.setLoader(true);
    try {
      // Get all selected users
      const selectedUserIds = Object.entries(selectedUsers)
        .filter(([_, isSelected]) => isSelected)
        .map(([cognitoId]) => cognitoId);

      // Make API call to update attendance
      await API.post(
        "main",
        `/admin/put-attendance/${UserCtx.userData.institution}`,
        {
          body: {
            classId: selectedClassForAttendance,
            attendedUsers: selectedUserIds,
          },
        }
      );

      toast.success("Attendance updated successfully");
      setShowAttendanceModal(false);
      setSelectedClassForAttendance(null);
      setSelectedUsers({});
    } catch (error) {
      console.error(error);
      toast.error("Failed to update attendance");
    } finally {
      UtilCtx.setLoader(false);
    }
  };

  const filteredUsers = (userList || [])
    .filter(user => user?.status === "Active")
    .filter(user => {
      if (!attendanceSearchTerm) return true;
      return (
        user?.userName?.toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
        user?.emailId?.toLowerCase().includes(attendanceSearchTerm.toLowerCase())
      );
    });

  return (
    <>
      {!isMobileScreen && (
        <>
          <div className={`w-[100%] flex flex-col items-center pt-6 gap-3`}>

            {/* Header Section */}
            <h2 className={`text-[1.6rem] sans-sarif font-[700]`}>
              Previous Sessions
            </h2>

            {/* Filter Section */}
            <div className="w-[75%] flex justify-end">
              <Button
                style={{
                  backgroundColor: InstitutionData.LightPrimaryColor,
                }}
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

            {/* Recording Link Update Section */}
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

              <div className="w-[75%]">
                <Table hoverable striped> 
                  <Table.Head>
                    
                    <Table.HeadCell className="font-semibold">
                      Instructor
                    </Table.HeadCell>
                    <Table.HeadCell className="font-semibold">
                      Date
                    </Table.HeadCell>
                    <Table.HeadCell className="font-semibold">
                      Recording Link
                    </Table.HeadCell>
                    <Table.HeadCell className="font-semibold">
                      Attendance
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {currentClasses.map((clas) => (
                      <Table.Row 
                        key={clas.classId} 
                        className="bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Table.Cell className="text-gray-700 font-semibold">
                          {clas.instructorNames}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 font-semibold">
                          {formatDate(clas.date)}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 font-semibold">
                          <div className="flex items-center gap-4">
                            {clas.recordingLink ? (
                              <>
                                <Button
                                  href={clas.recordingLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  size="xs"
                                  style={{
                                    backgroundColor: InstitutionData.LightPrimaryColor,
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  View Recording
                                </Button>
                                {(Ctx.userData.userType === "admin" || Ctx.userData.userType === "instructor") && (
                                  <button
                                    onClick={() => handleUpdateClick(clas.classId, clas.recordingLink)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                )}
                              </>
                            ) : (
                              <>
                                
                                {(Ctx.userData.userType === "admin" || Ctx.userData.userType === "instructor") && (
                                  <Button
                                    onClick={() => handleUpdateClick(clas.classId, "")}
                                    size="xs"
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "1px solid #000",
                                    }}
                                    className="flex items-center gap-2 text-black"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Recording
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 font-semibold">
                          <div className="flex items-center gap-4">
                            {(Ctx.userData.userType === "admin" || Ctx.userData.userType === "instructor") && (
                              <Button
                                onClick={() => handleAttendanceClick(clas.classId)}
                                size="xs"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #000",
                                }}
                                className="flex items-center gap-3 text-black"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Mark Attendance
                              </Button>
                            )}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>

                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(endIndex, filteredClasses.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredClasses.length}</span> results
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons={true}
                  />
                </div>
              </div>

            
            
          </div>
          {/* ) */}
        </>
      )}

      {/* Conditionally render the PreviousSessionsMobile component */}
      {isMobileScreen && <PreviousSessionsMobile />}

      {/* Update Recording Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%]">
            <h3 className="text-lg font-semibold mb-4">Update Recording Link</h3>
            <form onSubmit={onRecordingUpdate} className="space-y-4">
              <div>
                <input
                  type="url"
                  placeholder="Enter recording link"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={recordingLink}
                  onChange={(e) => setRecordingLink(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  color="gray" 
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedClassId(null);
                    setRecordingLink("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" style={{
                  backgroundColor: InstitutionData.LightPrimaryColor,
                }}>
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mark Attendance</h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={attendanceSearchTerm}
                onChange={(e) => setAttendanceSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.cognitoId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.userName}</p>
                    <p className="text-sm text-gray-600">{user.emailId}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={selectedUsers[user.cognitoId] || false}
                      onChange={() => handleToggleAttendance(user.cognitoId)}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer 
                      ${selectedUsers[user.cognitoId] ? 'bg-green-600' : 'bg-gray-200'} 
                      peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                      after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                      after:transition-all`}>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                color="gray"
                onClick={() => {
                  setShowAttendanceModal(false);
                  setSelectedClassForAttendance(null);
                  setSelectedUsers({});
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAttendance}
                style={{
                  backgroundColor: InstitutionData.LightPrimaryColor,
                }}
              >
                Save Attendance
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviousSessions;
