import React, { useState, useContext } from "react";
import Context from "../../../../Context/Context";
import { Pagination } from "flowbite-react";
import { API } from "aws-amplify";
import "./mobile.css";
import { Button1 } from "../../../../common/Inputs";
import Streak from "./Streak";
import InstitutionContext from "../../../../Context/InstitutionContext";
import { onJoinClass } from "./StreakFunctions";
import QRCode from "qrcode.react";
import wp from "../../../../utils/images/whatsapp.png";
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { FaUserTie, FaCalendarAlt } from "react-icons/fa";
import { HiOutlineLink } from "react-icons/hi";
import { GrYoga } from "react-icons/gr";

const UpcomingSessionsMobile = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  // const unpaidUser = {
  //     text: 'You need a subscription to access the Upcoming classes.',
  // }
  // const Navigate = useNavigate();
  const Ctx = useContext(Context);
  const UtilCtx = useContext(Context).util;
  const [date, setDate] = useState("");

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleFormValues, setScheduleFormValues] = useState({
    instructor: "",
    date: "",
    time: "",
    class: "",
    zoomLink: "",
  });

  // eslint-disable-next-line
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setScheduleFormValues({
      ...scheduleFormValues,
      [name]: value,
    });
  };

  // eslint-disable-next-line
  const [due, setDue] = useState(0);

  const [classType, setClassType] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [selectedInstructor, setselectedInstructor] = useState("");
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(Ctx.upcomingClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // eslint-disable-next-line
  const [editingIndex, setEditingIndex] = useState(-1);
  // const instructorNamesArray = Ctx.instructorList
  const classTypeNameArray = InstitutionData.ClassTypes;
  const [count, setCount] = useState(0);

  const formatDate = (epochDate) => {
    const date = new Date(parseInt(epochDate));
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    return `${formattedHours}:${minutes} ${period}`;
  };
  const formatdate = (epochDate) => {
    const date = new Date(epochDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so we add 1 to get the correct month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const UserCtx = useContext(Context);

  const isMember = UserCtx.userData.userType === "member";

  const getInstructor = (name) => {
    return Ctx.instructorList.find(
      (i) => i.name?.toString().trim() === name?.toString().trim()
    );
  };

  const onClassUpdated = async (
    classId,
    editedInstructorNames,
    editedClassType,
    instructorId
  ) => {
    UtilCtx.setLoader(true);

    try {
      if (!instructorId) {
        toast.warn("Please select an instructor.");
        UtilCtx.setLoader(false);
        return;
      }

      if (!editedClassType) {
        toast.warn("Please select an Class Type.");
        UtilCtx.setLoader(false);
        return;
      }

      const updatedClasses = Ctx.upcomingClasses.map((c) =>
        c.classId === classId
          ? {
              ...c,
              instructorNames: editedInstructorNames,
              instructorId,
              classType: editedClassType,
            }
          : c
      );
      await API.put(
        "main",
        `/admin/edit-schedule-name/${InstitutionData.InstitutionId}`,
        {
          body: {
            classId: classId,
            instructorNames: editedInstructorNames,
            instructorId,
            classType: editedClassType,
          },
        }
      );

      Ctx.setUpcomingClasses(updatedClasses);

      setEditingIndex(-1);

      UtilCtx.setLoader(false);
    } catch (e) {
      toast.error(e.message);
      UtilCtx.setLoader(false);
    }
  };

  const onScheduleCreate = async (e) => {
    e.preventDefault();

    try {
      UtilCtx.setLoader(true);

      if (!classType || !selectedInstructor.name || !zoomLink || !date) {
        toast.warn("Please fill in all sections.");
        return;
      }

      try {
        new URL(zoomLink);
      } catch (error) {
        toast.warn("Invalid Zoom link. Please enter a valid URL.");
        UtilCtx.setLoader(false);
        return;
      }

      const newClass = await API.post(
        "main",
        `/admin/add-schedule/${InstitutionData.InstitutionId}`,
        {
          body: {
            classType: classType,
            startTimeEst: new Date(date).getTime(),
            instructorEmailId: Ctx.userData.emailId,
            duration: 600,
            instructorId: selectedInstructor.instructorId,
            instructorNames: selectedInstructor.name,
            classDescription: "",
            zoomLink: zoomLink,
            date: new Date(date).getTime(),
          },
        }
      );
      try {
        new URL(zoomLink);
      } catch (error) {
        toast.warn("Invalid Zoom link. Please enter a valid URL.");
        UtilCtx.setLoader(false);
        return;
      }

      toast.success("Class Added");

      //  = {
      //   classType: classType,
      //   startTimeEst: new Date(date).getTime(),
      //   instructorEmailId: Ctx.userData.emailId,
      //   duration: 600,
      //   instructorId: selectedInstructor.instructorId,
      //   instructorNames: selectedInstructor.name,
      //   classDescription: '',
      //   zoomLink: zoomLink,
      //   date: new Date(date).getTime()
      // }
      Ctx.setUpcomingClasses([...Ctx.upcomingClasses, newClass]);

      setClassType("");
      setselectedInstructor("");
      setZoomLink("");
      setDate("");
      setShowScheduleForm(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      UtilCtx.setLoader(false);
    }
  };

  // Sort the upcoming classes based on the date in descending order
  const sortedUpcomingClasses = Ctx.upcomingClasses.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
  const [openedOnce, setOpenedOnce] = useState(true);

  const handleSvgClick = (event) => {
    setShowForm((prevState) => !prevState);
    setOpenedOnce(false);
    const svgPosition = event.target.getBoundingClientRect();
    setFormPosition({
      x: svgPosition.left + svgPosition.width + 10, // Adjust as needed
      y: svgPosition.top - 20,
    });
  };
  const whatsappLink = "https://wa.me/14155238886?text=join%20army-forest";

  //Functions For adding attendance starts here
  const { userList } = useContext(Context);
  const [attendedUsers, setAttendedUsers] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceList, setAttendanceList] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [classId, setClassId] = useState("");

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
      toast.success("Attendance Marked Successfully");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while marking attendance");
    }
  };

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

  const showMembersAttended = async (classId) => {
    console.log(classId);
    try {
      const response = await API.get(
        "main",
        `/admin/query-attendance/${UserCtx.userData.institution}?classId=${classId}`
      );
      setAttendedUsers(response.Items);
      setAttendanceList(true);
      setClassId(classId);
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

      toast.success("Attendance marked successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while putting Attendance");
    } finally {
      showMembersAttended(classId);
    }
  };

  const fetchAttendance = async () => {
    const sortedClasses = [...sortedUpcomingClasses];
    const attendanceData = {};
    const today = new Date();

    // Filter classes scheduled for today
    const classesForToday = sortedClasses.filter(({ date }) => {
      const classDate = new Date(date);
      return classDate.toDateString() === today.toDateString();
    });

    // Prepare initial attendance status
    const initialStatus = {};
    classesForToday.forEach(({ classId }) => {
      initialStatus[classId] = "Loading..."; // Show loading initially
    });
    setAttendanceStatus(initialStatus);

    // Fetch attendance for classes scheduled today
    for (const { classId } of classesForToday) {
      try {
        const response = await API.get(
          "main",
          `/admin/query-attendance/${UserCtx.userData.institution}?classId=${classId}&userId=${UserCtx.userData.cognitoId}`
        );
        console.log(`hello ${classId}`, response);

        if (response.Items.length > 0) {
          const { cognitoId } = response.Items[0];

          if (cognitoId === UserCtx.userData.cognitoId) {
            attendanceData[classId] = "Attended";
          } else {
            attendanceData[classId] = "Mark Attendance";
          }
          console.log(
            `Class ID: ${classId}, Attendance Status: ${attendanceData[classId]}`
          );
        } else {
          // Handle case where no items are returned
          attendanceData[classId] = "Mark Attendance"; // Default to 'Mark Attendance'
          console.log(`No data found for class ID: ${classId}`);
        }
      } catch (error) {
        console.error(error);
        attendanceData[classId] = "Mark Attendance"; // Handle error case
      }
    }

    // Update attendance status for all classes at once
    setAttendanceStatus((prevAttendanceStatus) => ({
      ...prevAttendanceStatus,
      ...attendanceData,
    }));
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line
  }, [UserCtx]);

  return (
    <>
      <Modal
        show={showScheduleForm}
        size="lg"
        onClose={() => {
          setShowScheduleForm(false);
          setClassType("");
          setselectedInstructor("");
          setZoomLink("");
          setDate("");
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block">
                <Label value="Zoom Link" />
              </div>
              <TextInput
                id="text"
                placeholder="Zoom Link"
                onChange={(e) => {
                  setZoomLink(e.target.value);
                }}
                color={"primary"}
                icon={HiOutlineLink}
                value={zoomLink}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Class Type" />
              </div>
              <Select
                icon={GrYoga}
                value={classType}
                onChange={(e) => {
                  setClassType(e.target.value);
                }}
                required
              >
                <option value="">Select Class Type</option>
                {classTypeNameArray.map((classType) => (
                  <option key={classType} value={classType}>
                    {classType}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Instructor" />
              </div>
              <Select
                icon={FaUserTie}
                value={
                  selectedInstructor
                    ? selectedInstructor.name
                      ? selectedInstructor.name
                      : "none"
                    : "none"
                }
                onChange={(e) => {
                  setselectedInstructor(getInstructor(e.target.value));
                }}
                required
              >
                <option value="none">Select Instructor</option>
                {Ctx.instructorList.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <div className="mb-2 block">
                <Label value="Date and Time" />
              </div>
              <TextInput
                icon={FaCalendarAlt}
                color={"primary"}
                placeholder="Select Date and Time"
                type={"datetime-local"}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-full flex justify-center">
            <Button color="primary" onClick={onScheduleCreate}>
              Create
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <div className={`w-full px-2 pb-4`}>
        {(Ctx.userData.userType === "admin" ||
          Ctx.userData.userType === "instructor") && (
          <div className={`container`}>
            <button
              className={`filter-button w-full m-[1rem] h-[2.1rem] rounded-[0.3rem] text-snow bg-black text-white`}
              onClick={() => setShowScheduleForm(true)}
            >
              CREATE A NEW SESSION
            </button>
          </div>
        )}
        <div>
          {isMember && (
            <div
              className={` w-[90%] m-[1rem] pt-[1rem] h-[2.1rem] rounded-[0.3rem] text-snow flex items-center justify-center bg-black text-white`}
            >
              <div className={`flex`}>
                <p className={`pr-3`}>
                  Attendance:{"  "}
                  <span style={{ color: "green" }}>
                    {UserCtx.userData.currentMonthZPoints
                      ? UserCtx.userData.currentMonthZPoints
                      : 0}
                  </span>{" "}
                  /{" "}
                  <span style={{ color: "red" }}>
                    {UserCtx.userData.lastMonthZPoint
                      ? UserCtx.userData.lastMonthZPoint
                      : 0}
                  </span>
                </p>
              </div>
              <div className={`flex ml-4`}>
                <p>{`Due: ${UserCtx.userData.balance || 0}`}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between relative">
            <h2
              className={`text-[1.4rem] mb-5 font-bold text-black-700 w-full text-center`}
            >
              Upcoming Sessions
            </h2>
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(27, 117, 113)" className={`w-10 h-[2rem] ${!openedOnce ? '' : 'shake'} cursor-pointer`} onClick={handleSvgClick}>
            <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
            <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clipRule="evenodd" />
          </svg>
          {openedOnce && (
            <p className="absolute w-[1rem] h-[1rem] text-center rounded-[100%] text-[12px] font-bold bg-[#f81818e0] top-[-9%] right-[0%]">
              1
            </p>
          )} */}
            {/* {showForm && (
            <div className="animate-slide-in absolute flex flex-col items-center w-[90vw] bg-white bg-opacity-50 p-4 rounded right-5 top-2 z-20" style={{ backdropFilter: 'blur(10px)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 8px 6px' }}>
              <div className='flex items-center justify-center'>
                <p className='mt-2 ml-10 text-[1.1rem] font-bold'>🕺 Don't Miss a Step! Get Reminders on WhatsApp!</p>
                <img className='w-[1.3rem] mr-7 mt-4' src={wp} alt="" />
              </div>
              <p className='mt-2 text-[1.2rem] font-bold'>Scan the QR</p>
              <QRCode value={whatsappLink} size={256} />
              <p className='mt-2 text-[1.2rem] text-[#125b43] font-bold'>OR</p>
              <button className='bg-[#2b7f7b] rounded-[4px] w-full p-2 text-white font-[600]' onClick={() => { window.open(whatsappLink, '_blank') }}>Click Here</button>
            </div>
          )} */}
          </div>
          {!attendanceList ? (
            <div>
              <Streak count={count} setCount={setCount} />

              <div
                className={`grid gap-[1.4rem] md:gap-4 grid-cols-1 sm:grid-cols-2 mx-auto`}
              >
                {sortedUpcomingClasses
                  .slice(startIndex, endIndex)
                  .map((clas, i) => (
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
                        <div className={`flex items-center justify-between`}>
                          <div>
                            <div
                              className={`w-[7rem]  attractive-dropdown-container`}
                            >
                              {/* Show the dropdowns only to admin and instructor users */}
                              {Ctx.userData.userType === "admin" ||
                              Ctx.userData.userType === "instructor" ? (
                                <div className={`dropdown-wrapper`}>
                                  <select
                                    className={`rounded-[0.51rem] px-1 attractive-dropdown`}
                                    style={{
                                      backgroundColor:
                                        InstitutionData.SecondaryColor,
                                    }}
                                    value={
                                      getInstructor(clas.instructorNames)?.name
                                    }
                                    onChange={(e) => {
                                      onClassUpdated(
                                        clas.classId,
                                        getInstructor(e.target.value).name,
                                        clas.classType,
                                        e.target.value
                                      );
                                    }}
                                  >
                                    {Ctx.instructorList.map((i) => (
                                      <option key={i.name} value={i.name}>
                                        {i.name.split(" ")[0]}
                                      </option>
                                    ))}
                                  </select>
                                  <div className={`dropdown-arrow`}></div>
                                </div>
                              ) : (
                                <p
                                  className={`rounded-[0.51rem] pr-4 max600:bg-[#09edb900] `}
                                  style={{
                                    backgroundColor:
                                      InstitutionData.SecondaryColor,
                                  }}
                                >
                                  {clas.instructorNames}
                                </p>
                              )}

                              {Ctx.userData.userType === "admin" ||
                              Ctx.userData.userType === "instructor" ? (
                                <div className={`dropdown-wrapper2`}>
                                  <select
                                    className={`rounded-[0.51rem] px-1 attractive-dropdown2`}
                                    style={{
                                      backgroundColor:
                                        InstitutionData.SecondaryColor,
                                    }}
                                    value={clas.classType}
                                    onChange={(e) => {
                                      onClassUpdated(
                                        clas.classId,
                                        getInstructor(clas.instructorNames)
                                          ?.name,
                                        e.target.value,
                                        clas.instructorId
                                      );
                                    }}
                                  >
                                    {classTypeNameArray.map((classType) => (
                                      <option key={classType} value={classType}>
                                        {classType}
                                      </option>
                                    ))}
                                  </select>
                                  <div className={`dropdown-arrow2`}></div>
                                </div>
                              ) : (
                                <p
                                  className={`rounded-[0.51rem] max600:bg-[#09edb900] `}
                                  style={{
                                    backgroundColor:
                                      InstitutionData.SecondaryColor,
                                  }}
                                >
                                  {clas.classType}
                                </p>
                              )}
                            </div>

                            <div className={`mb-1 mt-1`}>
                              Date: {formatdate(parseInt(clas.date))}
                            </div>
                            <div>Time: {formatDate(clas.date)}</div>
                            {UserCtx.userData.userType === "admin" && (
                              <div className="flex gap-2">
                                <p className="font-[600]">
                                  See Attendance Details{" "}
                                  <span className="text-[1.1rem] font-bold">
                                    →
                                  </span>
                                </p>
                                <p
                                  className=" text-blue-600 underline z-10"
                                  onClick={() =>
                                    showMembersAttended(clas.classId)
                                  }
                                >
                                  View
                                </p>
                              </div>
                            )}
                          </div>
                          <div className={`ml-2`}>
                            {clas.zoomLink ? (
                              <button
                                className={`sans-sarif px-4 py-[4px] rounded-lg bg-black text-white`}
                                style={{
                                  borderRadius: "1rem",
                                }}
                                onClick={() => {
                                  window.open(clas.zoomLink, "_blank");
                                  onJoinClass(InstitutionData.InstitutionId);
                                }}
                              >
                                Join
                              </button>
                            ) : (
                              <button
                                className="px-2 p-1 w-[9rem] text-[black] rounded-1 bg-[#0c754800] z-20 border border-black text-center"
                                onClick={() => markAttendance(clas.classId)}
                              >
                                {attendanceStatus[clas.classId] ||
                                  "Mark Attendance"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
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
                          ? "bg-[#1b7571] text-white p-1 px-2 mr-3 rounded-[3px] mt-3 ml-[8rem]"
                          : "hidden"
                      }
                      onClick={adminPutAttendance}
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
                            checked={cognitoIds === user.cognitoId}
                            disabled={
                              cognitoIds && cognitoIds !== user.cognitoId
                            }
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
          {!attendanceList && (
            <div
              className={`flex mb-[6rem] justify-center items-center mt-4 md:mt-6`}
            >
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(value) => setCurrentPage(value)}
              />
            </div>
          )}
        </div>
        {/* } */}
      </div>
    </>
  );
};

export default UpcomingSessionsMobile;
