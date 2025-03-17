import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../../../../Context/Context";
import { useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { FaEdit } from "react-icons/fa";
import { Table, Pagination } from "flowbite-react";
import "./index.css";
import { useMediaQuery } from "../../../../utils/helpers";
import UpcomingSessionsMobile from "./mobile";
import "./mobile.css";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Streak from "./Streak";
import { onJoinClass } from "./StreakFunctions";
import { toast } from "react-toastify";

import DateFormatter from "../../../../common/utils/DateFormatter";
import PaginationComponent from "../../../../common/Pagination";
import AttendanceModal from "../../../../common/AttendanceModal";
import formatTime from "../../../../common/utils/format-time";

import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { FaUserTie, FaCalendarAlt, FaClock } from "react-icons/fa";
import { HiOutlineLink } from "react-icons/hi";
import { GrYoga } from "react-icons/gr";

const formatDate = (epochDate) => {
  const date = new Date(epochDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so we add 1 to get the correct month
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const UpcomingSessions = () => {
  //for unpaid user
  // const unpaidUser = {
  //   text: "You need a subscription to access the Upcoming classes.",
  // };
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const [classType, setClassType] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [selectedInstructor, setselectedInstructor] = useState("");
  // const [date, setDate] = useState("");
  const [datePicker, setDatePicker] = useState("");
  const [time, setTime] = useState("00:00:00");
  // const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [attendanceList, setAttendanceList] = useState(false);
  // const [instructorName, setInstructorName] = useState("");
  // const [classId, setClassId] = useState();
  const UserCtx = useContext(Context);
  const Ctx = useContext(Context);
  const { userAttendance } = Ctx;
  const UtilCtx = useContext(Context).util;
  const [classTypeFilter, setClassTypeFilter] = useState("");
  const [instructorTypeFilter, setInstructorTypeFilter] = useState("");
  const filteredClasses = Ctx.upcomingClasses.filter(
    (clas) =>
      instructorTypeFilter === "" ||
      clas.instructorNames === instructorTypeFilter
  );
  const sortedFilteredClasses = filteredClasses
    .filter((clas) => {
      const classTime = new Date(parseInt(clas.date)).getTime();
      const currentTime = new Date().getTime();
      const oneHourInMillis = 60 * 60 * 1000; // 1 hour in milliseconds

      // Check if the class time is within the next hour
      return classTime + oneHourInMillis > currentTime;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const classTypes = Array.from(
    new Set(filteredClasses.map((clas) => clas.classType))
  );
  const isMobileScreen = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(Ctx.upcomingClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [showFilters, setShowFilters] = useState(false);
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // const instructorNamesArray = Ctx.instructorList;
  const classTypeNameArray = InstitutionData.ClassTypes;
  const [count, setCount] = useState(0);
  const [modal, setModal] = useState(false);

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] =
    useState(null);

  const handleAttendanceClick = (classId) => {
    setSelectedClassForAttendance(classId);
    setShowAttendanceModal(true);
  };

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false);
    setSelectedClassForAttendance(null);
  };

  // if (Ctx.userData.status === "InActive" && Ctx.userData.userType === "member") {
  //   Navigate("/subscription");
  // }
  const [instructorClassTypes, setInstructorClassTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTime, setEditingTime] = useState({});

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (Ctx.userData.userType === "instructor") {
        try {
          // Fetch data from the API
          const response = await API.get(
            "main",
            `/any/instructor-list/${InstitutionData.InstitutionId}`
          );
          // Assuming response is an array of instructors
          const instructor = response.find(
            (inst) => inst.instructorId === Ctx.userData.cognitoId
          );
          console.log(instructor);
          // Set classType if found, or an empty array if not
          setInstructorClassTypes(instructor?.classType || []);
        } catch (error) {
          console.error("Error fetching instructor data:", error);
        } finally {
          setIsLoading(false); // Stop loading regardless of success or failure
        }
      }
    };

    fetchInstructorData(); // Call the async function
  }, [Ctx.userData.userType, InstitutionData.InstitutionId]);

  const getInstructor = (name) => {
    return Ctx.instructorList.find(
      (i) => i.name?.toString().trim() === name?.toString().trim()
    );
  };

  const onClassUpdated = async (
    classId,
    editedInstructorNames,
    editedClassType,
    instructorId,
    date
  ) => {
    UtilCtx.setLoader(true);

    try {
      if (!instructorId) {
        toast.warn("Please select an instructor.");
        UtilCtx.setLoader(false);
        return;
      }

      if (!editedClassType) {
        toast.warn("Please select a Class Type.");
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
              date: date,
            }
          : c
      );

      // Now, you can make the API call to update the class on the server
      await API.put(
        "main",
        `/admin/edit-schedule-name/${InstitutionData.InstitutionId}`,
        {
          body: {
            classId: classId,
            instructorNames: editedInstructorNames,
            instructorId: instructorId,
            classType: editedClassType,
            date: date,
          },
        }
      );
      Ctx.setUpcomingClasses(updatedClasses);

      setEditingIndex(-1);
      toast.success("Class updated successfully");
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

      // Check if any of the required fields are empty
      if (!classType || !selectedInstructor.name || !datePicker || !time) {
        toast.warn("Please fill in all sections.");
        return;
      }

      // Validate the Zoom link if provided
      if (zoomLink) {
        try {
          new URL(zoomLink);
        } catch (error) {
          toast.warn("Invalid Zoom link. Please enter a valid URL.");
          UtilCtx.setLoader(false);
          return;
        }
      }

      const newClass = await API.post(
        "main",
        `/admin/add-schedule/${InstitutionData.InstitutionId}`,
        {
          body: {
            classType: classType,
            startTimeEst: new Date(datePicker + "T" + time).getTime(),
            instructorEmailId: Ctx.userData.emailId,
            duration: 60,
            instructorId: selectedInstructor.instructorId,
            instructorNames: selectedInstructor.name,
            classDescription: "",
            zoomLink: zoomLink || "",
            date: new Date(datePicker + "T" + time).getTime(),
          },
        }
      );

      toast.success("Class Added");

      Ctx.setUpcomingClasses([...Ctx.upcomingClasses, newClass]);

      setClassType("");
      setselectedInstructor({});
      setZoomLink("");
      setDatePicker("");
      setTime("00:00:00");
      setModal(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      UtilCtx.setLoader(false);
    }
  };

  function handleClose() {
    setModal(false);
    setClassType("");
    setselectedInstructor({});
    setZoomLink("");
    setDatePicker("");
    setTime("00:00:00");
  }

  // const handleAttendanceClick = async (classId) => {
  //   setSelectedClassForAttendance(classId);
  //   setShowAttendanceModal(true);

  //   try {
  //     const response = await API.get(
  //       "main",
  //       `/admin/query-attendance/${UserCtx.userData.institution}?classId=${classId}`
  //     );
  //     const attendedUsers = response.Items || [];
  //     const initialSelectedUsers = {};

  //     // Initialize with currently attended users
  //     attendedUsers.forEach((user) => {
  //       initialSelectedUsers[user.cognitoId] = true;
  //     });

  //     setSelectedUsers(initialSelectedUsers);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to fetch attendance data");
  //   }
  // };

  // const handleToggleAttendance = (cognitoId) => {
  //   setSelectedUsers((prev) => ({
  //     ...prev,
  //     [cognitoId]: !prev[cognitoId],
  //   }));
  // };

  // const handleSaveAttendance = async () => {
  //   UtilCtx.setLoader(true);
  //   try {
  //     // Get all selected users
  //     const selectedUserIds = Object.entries(selectedUsers)
  //       .filter(([_, isSelected]) => isSelected)
  //       .map(([cognitoId]) => cognitoId);

  //     // Make API call to update attendance
  //     await API.post(
  //       "main",
  //       `/admin/put-attendance/${UserCtx.userData.institution}`,
  //       {
  //         body: {
  //           classId: selectedClassForAttendance,
  //           attendedUsers: selectedUserIds,
  //         },
  //       }
  //     );

  //     toast.success("Attendance updated successfully");
  //     setShowAttendanceModal(false);
  //     setSelectedClassForAttendance(null);
  //     setSelectedUsers({});
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to update attendance");
  //   } finally {
  //     UtilCtx.setLoader(false);
  //   }
  // };

  const [showForm, setShowForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
  const [openedOnce, setOpenedOnce] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);

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

  //attendance
  const { userList } = useContext(Context);
  const [attendedUsers, setAttendedUsers] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [classId, setClassId] = useState("");
  const [currentPageAttendance, setCurrentPageAttendance] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const activeUsers = userList.filter((user) => user.status === "Active");
    setActiveUsers(
      activeUsers.toSorted((a, b) => {
        const x = userAttendance[a.cognitoId] || 0;
        const y = userAttendance[b.cognitoId] || 0;
        return y - x;
      })
    );
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
  // const filteredUsers = filterUsers();

  // filteredUsers.sort((a, b) => {
  //   if (
  //     attendanceStatus[a.cognitoId] === "Attended" &&
  //     attendanceStatus[b.cognitoId] !== "Attended"
  //   ) {
  //     return -1;
  //   } else if (
  //     attendanceStatus[a.cognitoId] !== "Attended" &&
  //     attendanceStatus[b.cognitoId] === "Attended"
  //   ) {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  // });

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
        checkbox.disabled = true;
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
      checkbox.disabled = false;
    });
  };

  useEffect(() => {
    handleCheckboxUnclick("", "");
  }, [currentPageAttendance]);

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
      fetchAttendance();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while putting Attendance");
    } finally {
      showMembersAttended(classId);
    }
  };

  const fetchAttendance = async () => {
    const sortedClasses = [...sortedFilteredClasses];
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

  const getDate = (epochTime) => {
    const date = new Date(epochTime);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };

  const getTime = (epochTime) => {
    const date = new Date(epochTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line
  }, [UserCtx]);

  const markAttendance = async (ChoosenClassId) => {
    try {
      const data = {
        classId: ChoosenClassId,
        emailId: UserCtx.userData.emailId,
      };

      try {
        const response = await API.post(
          "main",
          `/user/put-attendance/${UserCtx.userData.institution}`,
          {
            body: data,
          }
        );
      } catch {
        toast.error("Too early to give attendance");
      }

      console.log(response);
      toast.success("Attendance Marked Successfully");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while marking attendance");
    }
  };

  const handleTimeChange = (e, classId) => {
    setEditingTime({
      ...editingTime,
      [classId]: e.target.value,
    });
  };

  const handleTimeBlur = (
    classId,
    instructorNames,
    classType,
    instructorId,
    date,
    newTime
  ) => {
    // Only call API if time has changed
    if (newTime && newTime !== getTime(date)) {
      const newDate = new Date(`${getDate(date)}T${newTime}`).getTime();
      onClassUpdated(
        classId,
        instructorNames,
        classType,
        instructorId,
        newDate
      );
    }

    // Reset the editing state for this class
    setEditingTime((prev) => {
      const updated = { ...prev };
      delete updated[classId];
      return updated;
    });
  };

  return (
    <>
      {/*  Create a new class modal */}
      <Modal show={modal} size="lg" onClose={handleClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-2 min800:flex-row">
              <div className="w-full">
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
              <div className="w-full">
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
            </div>

            <div className="flex flex-col justify-between gap-2 min800:flex-row">
              <div className="w-full">
                <div className="mb-2 block">
                  <Label value="Date" />
                </div>
                <TextInput
                  icon={FaCalendarAlt}
                  color={"primary"}
                  placeholder="Select Date and Time"
                  type={"date"}
                  value={datePicker}
                  onChange={(e) => {
                    setDatePicker(e.target.value);
                  }}
                />
              </div>
              <div className="w-full">
                <div className="mb-2 block">
                  <Label value="Time" />
                </div>
                <TextInput
                  icon={FaClock}
                  color={"primary"}
                  placeholder="Select Date and Time"
                  type={"time"}
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                />
              </div>
            </div>
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-full flex justify-center">
            <Button
              style={{
                backgroundColor: InstitutionData.PrimaryColor,
              }}
              onClick={onScheduleCreate}
            >
              Create
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {!isMobileScreen && (
        <div className={`w-[100%] flex flex-col items-center`}>
          <div className={`mt-8 w-[80%] max1050:w-[92%] flex justify-between`}>
            <div className={`w-[100%]`}>
              <h3 className={`text-center text-[2rem] my-4 font-bold`}>
                Upcoming Classes
              </h3>

              <div
                className={`flex ${
                  Ctx.userData.userType === "admin" ||
                  Ctx.userData.userType === "instructor"
                    ? "justify-between"
                    : "justify-end"
                } relative`}
              >
                {(Ctx.userData.userType === "admin" ||
                  Ctx.userData.userType === "instructor") && (
                  <Button
                    style={{
                      backgroundColor: InstitutionData.PrimaryColor,
                    }}
                    onClick={() => setModal(true)}
                  >
                    Create Class
                  </Button>
                )}
                <Button
                  style={{
                    backgroundColor: InstitutionData.PrimaryColor,
                  }}
                  onClick={() => setShowFilters((e) => !e)}
                >
                  Filters
                </Button>
              </div>

              <div className={`flex flex-col-reverse my-2 `}>
                <div className={`filters ${showFilters ? "show" : ""}`}>
                  <div className={`w-[95%] flex justify-end m-[0.8rem] gap-3`}>
                    <label
                      className={`font-bold `}
                      htmlFor="instructorTypeFilter"
                    >
                      Instructor:{" "}
                    </label>
                    <select
                      className={`rounded-[0.51rem] px-4 `}
                      style={{
                        backgroundColor: InstitutionData.LightestPrimaryColor,
                      }}
                      id="instructorTypeFilter"
                      value={instructorTypeFilter}
                      onChange={(e) => {
                        setInstructorTypeFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All</option>
                      {Array.from(
                        new Set(
                          Ctx.upcomingClasses.map(
                            (clas) => clas.instructorNames
                          )
                        )
                      ).map((instructorNames) => (
                        <option key={instructorNames} value={instructorNames}>
                          {instructorNames}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={`w-[95%] flex justify-end m-[0.8rem] gap-3`}>
                    <label className={`font-bold htmlFor=classTypeFilter`}>
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
                        setClassTypeFilter(e.target.value);
                        setCurrentPage(1);
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
                Ctx.userData.userType === "member" ? (
                  <Streak count={count} setCount={setCount} />
                ) : (
                  ""
                )
              ) : (
                <div
                  className="flex mb-5 justify-between border-b-2 items-center h-[4rem]"
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
                      style={{ height: "2rem" }}
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

              <div className="">
                {!attendanceList ? (
                  <div className="">
                    <Table hoverable striped>
                      <Table.Head
                        className="font-semibold text-white text-center"
                        style={{
                          backgroundColor: InstitutionData.PrimaryColor,
                        }}
                      >
                        <Table.HeadCell className="font-semibold ">
                          Date
                        </Table.HeadCell>
                        <Table.HeadCell className="font-semibold ">
                          Instructor
                        </Table.HeadCell>
                        <Table.HeadCell className="font-semibold">
                          Description
                        </Table.HeadCell>
                        <Table.HeadCell className="font-semibold">
                          Time
                        </Table.HeadCell>

                        <Table.HeadCell className="text-center w-[80px] ">
                          {/* {sortedFilteredClasses[0]?.zoomLink
                            ? "Join"
                            : "Attendance"} */}
                          Attendance
                        </Table.HeadCell>
                      </Table.Head>

                      <Table.Body className="divide-y">
                        {sortedFilteredClasses
                          .slice(startIndex, endIndex)
                          .map((clas, i) => (
                            <Table.Row
                              key={clas.classId}
                              className="bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                              <Table.Cell className="text-gray-700 text-xs font-semibold text-center">
                                {/* {formatDate(parseInt(clas.date))} */}
                                <DateFormatter epochDate={clas.date} />
                              </Table.Cell>
                              <Table.Cell className="text-gray-700 text-xs font-semibold text-center">
                                {Ctx.userData.userType === "admin" ||
                                Ctx.userData.userType === "instructor" ? (
                                  <select
                                    className="w-[70%] h-8 px-2 rounded-[0.5rem] focus:outline-none focus:border-blue-500 text-xs border-nonetext-center font-semibold"
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "1px solid #d1d5db",
                                    }}
                                    value={
                                      getInstructor(clas.instructorNames)?.name
                                    }
                                    onChange={(e) => {
                                      onClassUpdated(
                                        clas.classId,
                                        getInstructor(e.target.value).name,
                                        clas.classType,
                                        getInstructor(e.target.value)
                                          .instructorId,
                                        clas.date
                                      );
                                    }}
                                  >
                                    {Ctx.instructorList
                                      .sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                      )
                                      .filter((i) => i.name !== "Cancelled")
                                      .map((i) => (
                                        <option key={i.name} value={i.name}>
                                          {i.name}
                                        </option>
                                      ))}
                                  </select>
                                ) : (
                                  <p className="h-10 flex items-center justify-center rounded text-[14px] ">
                                    {getInstructor(clas.instructorNames)?.name}
                                  </p>
                                )}
                              </Table.Cell>

                              <Table.Cell className="text-gray-700 font-semibold text-center md:table-cell  w-32 lg:w-48">
                                <div className="w-full flex justify-center">
                                  <div
                                    className="flex items-center justify-center gap-4 w-28 h-7 text-white rounded-lg"
                                    style={{
                                      backgroundColor:
                                        InstitutionData.LightPrimaryColor,
                                    }}
                                  >
                                    {clas.classType}
                                  </div>
                                </div>
                              </Table.Cell>

                              <Table.Cell className="text-gray-700 font-semibold text-center">
                                <div className="text-center">
                                  {Ctx.userData.userType === "admin" ||
                                  Ctx.userData.userType === "instructor" ? (
                                    <div className="relative flex items-center justify-center text-center">
                                      <input
                                        value={
                                          editingTime[clas.classId] ||
                                          getTime(clas.date)
                                        }
                                        type="time"
                                        className={`w-full h-10 rounded text-center outline-none z-10 relative ${
                                          editingTime[clas.classId]
                                            ? "border border-blue-500 bg-blue-50"
                                            : "bg-transparent border-none"
                                        }`}
                                        onChange={(e) =>
                                          handleTimeChange(e, clas.classId)
                                        }
                                        onBlur={(e) =>
                                          handleTimeBlur(
                                            clas.classId,
                                            getInstructor(clas.instructorNames)
                                              ?.name,
                                            clas.classType,
                                            clas.instructorId,
                                            clas.date,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <FaEdit
                                        className="absolute
                                      translate-x-8
                                      text-gray-500 cursor-pointer"
                                      />
                                    </div>
                                  ) : (
                                    <p className="h-10 flex items-center justify-center text-md">
                                      {formatTime(clas.date)}
                                    </p>
                                  )}
                                </div>
                              </Table.Cell>

                              {/* <Table.Cell className="text-gray-700 w-48 font-semibold text-center">
                                <div className="flex items-center">
                                  {(Ctx.userData.userType === "admin" ||
                                    Ctx.userData.userType === "instructor" ||
                                    Ctx.userData.userType === "member") && (
                                    <Button
                                      onClick={() => {
                                        if (clas.zoomLink) {
                                          window.open(
                                            clas.zoomLink,
                                            "_blank",
                                            "noreferrer"
                                          );
                                          onJoinClass(
                                            InstitutionData.InstitutionId
                                          );
                                        }
                                        if (
                                          Ctx.userData.userType === "admin"
                                          // ||
                                          // Ctx.userData.userType === "member"
                                        ) {
                                          handleAttendanceClick(clas.classId);
                                        }
                                      }}
                                      size="xs"
                                      style={{
                                        backgroundColor: "transparent",
                                      }}
                                      className="flex items-center gap-3 text-black w-full"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                      </svg>
                                      {clas.zoomLink
                                        ? "Join"
                                        : attendanceStatus[clas.classId] ||
                                          "Mark Attendance"}
                                    </Button>
                                  )}
                                </div>
                              </Table.Cell> */}

                              <Table.Cell className="text-gray-700 w-48 font-semibold text-center">
                                <div className="flex items-center">
                                  {(Ctx.userData.userType === "admin" ||
                                    Ctx.userData.userType === "instructor" ||
                                    Ctx.userData.userType === "member") && (
                                    <Button
                                      onClick={() => {
                                        if (
                                          Ctx.userData.userType === "member"
                                        ) {
                                          if (clas.zoomLink) {
                                            window.open(
                                              clas.zoomLink,
                                              "_blank",
                                              "noreferrer"
                                            );
                                          }
                                          markAttendance(clas.classId);
                                        } else if (
                                          Ctx.userData.userType === "admin" ||
                                          Ctx.userData.userType === "instructor"
                                        ) {
                                          // if (clas.zoomLink) {
                                          //   window.open(
                                          //     clas.zoomLink,
                                          //     "_blank",
                                          //     "noreferrer"
                                          //   );
                                          // }
                                          handleAttendanceClick(clas.classId);
                                        }
                                      }}
                                      size="xs"
                                      style={{ backgroundColor: "transparent" }}
                                      className="flex items-center gap-3 text-black w-full"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                      </svg>
                                      {Ctx.userData.userType === "member"
                                        ? clas.zoomLink
                                          ? attendanceStatus[clas.classId] ===
                                            "Joined"
                                            ? "Joined"
                                            : "Join"
                                          : "Mark Attendance"
                                        : attendanceStatus[clas.classId] ||
                                          "Mark Attendance"}
                                    </Button>
                                  )}
                                </div>
                              </Table.Cell>

                              {/* {(Ctx.userData.userType === "admin" ||
                                Ctx.userData.userType === "instructor") && (
                                <Table.Cell className="text-gray-700 font-semibold text-center">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={() =>
                                      showMembersAttended(clas.classId)
                                    }
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                  </svg>
                                </Table.Cell>
                              )} */}
                            </Table.Row>
                          ))}
                      </Table.Body>
                    </Table>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-6 text-black text-[1.1rem] font-[600] ml-8">
                      <p>User Name</p>
                      <p className="col-span-2">Email ID</p>
                      <p>Phone Number</p>
                      <p>Attendance Status</p>
                      <div></div>
                    </div>
                    <div className="overflow-y-scroll max-h-[30rem]">
                      {currentUsers.map((user) => (
                        <div
                          key={user.cognitoId}
                          className="grid grid-cols-6 text-black font-[400] ml-8"
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
                  <PaginationComponent
                    showIcons={true}
                    data={filteredClasses}
                    itemsPerPage={5}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobileScreen && <UpcomingSessionsMobile />}

      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={handleCloseAttendanceModal}
        classId={selectedClassForAttendance}
        institutionId={InstitutionData.InstitutionId}
      />
    </>
  );
};

export default UpcomingSessions;
