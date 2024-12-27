import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../../../../Context/Context";
import { useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { Pagination } from "flowbite-react";
import "./index.css";
import { useMediaQuery } from "../../../../utils/helpers";
import UpcomingSessionsMobile from "./mobile";
import "./mobile.css";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Streak from "./Streak";
import { onJoinClass } from "./StreakFunctions";
import { toast } from "react-toastify";

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
  const sortedFilteredClasses = filteredClasses.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const classTypes = Array.from(
    new Set(filteredClasses.map((clas) => clas.classType))
  );
  const isMobileScreen = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(Ctx.upcomingClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [showFilters, setShowFilters] = useState(false);
  // const instructorNamesArray = Ctx.instructorList;
  const classTypeNameArray = InstitutionData.ClassTypes;
  const [count, setCount] = useState(0);
  const [modal, setModal] = useState(false);

  // if (Ctx.userData.status === "InActive" && Ctx.userData.userType === "member") {
  //   Navigate("/subscription");
  // }
  const [instructorClassTypes, setInstructorClassTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
          console.log(instructor)
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
    date,
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

      // Update the state with the new classes

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
            zoomLink: zoomLink || "", // Provide an empty string if no Zoom link is provided
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

  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line
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
  const usersPerPage = 10;

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
      toast, error("An error occurred while marking attendance");
    }
  };

  useEffect(() => {
    const activeUsers = userList.filter((user) => user.status === "Active");
    setActiveUsers(activeUsers.toSorted((a, b) => {
      const x = userAttendance[a.cognitoId] || 0;
      const y = userAttendance[b.cognitoId] || 0;
      return y - x;
    }));
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
    return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
      }`;
  };

  const getTime = (epochTime) => {
    const date = new Date(epochTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes
      }`;
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line
  }, [UserCtx]);

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

            {/* <div className="w-full">
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
            </div> */}
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
            <Button color="primary" onClick={onScheduleCreate}>
              Create
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {!isMobileScreen && (
        <div className={`w-[100%] flex flex-col items-center`}>
          {Ctx.userData.userType === "admin" ||
            Ctx.userData.userType === "instructor" || (
              <div
                className={`w-[90%] h-[13rem] rounded-[2.5rem] p-2  flex items-center justify-between max1050:px-2`}
                style={{
                  backgroundColor: InstitutionData.LightestPrimaryColor,
                }}
              >
                <div className={`ml-20 max1050:ml-5`}>
                  {Ctx.isAuth ? (
                    <h2 className={`text-[2rem] max500:text-[1.4rem]`}>
                      Hello {Ctx.userData.userName}
                    </h2>
                  ) : (
                    <h2 className={`text-[2rem] max500:text-[1.3rem]`}>
                      Hello Simon
                    </h2>
                  )}

                  {Ctx.userData.status === "Active" || Ctx.userData.status === "Trial" ? (
                    <p className={`text-[1.4rem] font-bold max500:text-[1rem]`}>
                      {Ctx.userData.status === "Trial" ? (
                        `Your trial period ends in ${Math.ceil(
                          (new Date(Ctx.userData.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)
                        )} days`
                      ) : (
                        "Be Regular and Work Hard to Achieve Goals"
                      )}
                    </p>
                  ) : (
                    <div>
                      <p
                        className={`text-[1.4rem] font-bold cursor-pointer`}
                        onClick={() => {
                          Navigate("/subscription");
                        }}
                      >
                        Please Upgrade to start your Instructor training
                      </p>
                    </div>
                  )}
                </div>
                <div className={`mr-20 max1050:mr-5 `}>
                  <img
                    alt="Why"
                    src={`https://institution-utils.s3.amazonaws.com/happyprancer/images/why-bworkz-img.svg`}
                    className={`w-72`}
                  />
                </div>
              </div>
            )}

          {/* {(Ctx.userData.userType === "admin" ||
            Ctx.userData.userType === "instructor") && (
            <form className={`flex flex-col gap-6 w-[90%] max1050:hidden`}>
              <div className={`flex gap-6`}>
                <select
                  className={` font-[500] text-[0.95rem] px-2 pb-1 rounded-lg w-[10rem]`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor,
                  }}
                  value={classType}
                  onChange={(e) => {
                    setClassType(e.target.value);
                  }}
                >
                  <option value="">Select Class Type</option>
                  {classTypeNameArray.map((classType) => (
                    <option key={classType} value={classType}>
                      {classType}
                    </option>
                  ))}
                </select>

                <select
                  className={` font-[500] text-[0.95rem] px-2 pb-1 rounded-lg w-[10rem]`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor,
                  }}
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
                >
                  <option value="none">Select Instructor</option>
                  {Ctx.instructorList.map((i) => (
                    <option key={i.name} value={i.name}>
                      {i.name}
                    </option>
                  ))}
                </select>

                <textarea
                  className={` px-2 pt-4 rounded-lg text-[0.95rem] w-[10rem]  flex justify-center items-center flex-grow`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor,
                  }}
                  placeholder="Zoom Link"
                  value={zoomLink}
                  onChange={(e) => {
                    setZoomLink(e.target.value);
                  }}
                />

                <input
                  className={` px-2 pb-1 text-[1rem] rounded-lg w-[10rem]`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor,
                  }}
                  placeholder="Date"
                  type={"datetime-local"}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </div>
              <Button2 data={"Post"} fn={onScheduleCreate} />
            </form>
          )} */}

          <div className={`mt-8 w-[80%] max1050:w-[92%] flex justify-between`}>
            <div className={`w-[100%]`}>
              <h3 className={`text-center text-[1.7rem] pl-3 mb-4 font-bold`}>
                Upcoming Classes
              </h3>

              <div
                className={`flex ${Ctx.userData.userType === "admin" ||
                    Ctx.userData.userType === "instructor"
                    ? "justify-between"
                    : "justify-end"
                  } relative`}
              >
                {(Ctx.userData.userType === "admin" ||
                  Ctx.userData.userType === "instructor") && (
                    <Button color="primary" onClick={() => setModal(true)}>
                      Create Class
                    </Button>
                  )}
                <Button
                  color="primary"
                  onClick={() => setShowFilters((e) => !e)}
                >
                  Filters
                </Button>

                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(27, 117, 113)" className={`w-10 h-[2rem] ${!openedOnce ? '' : 'shake'} cursor-pointer`} onClick={handleSvgClick}>
                  <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
                  <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clipRule="evenodd" />
                </svg>
                {openedOnce && (
                  <p className="absolute w-[1rem] h-[1rem] text-center rounded-[100%] text-[12px] font-bold bg-[#f81818e0] top-[-9%] right-[0%]">
                    1
                  </p>
                )}
                {showForm && (
                  <div className="animate-slide-in absolute flex flex-col items-center w-[25rem] bg-white bg-opacity-50 p-4 rounded right-5 top-2 z-20" ref={formRef} style={{ backdropFilter: 'blur(10px)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 8px 6px' }}>
                    <div className='flex items-center justify-center'>
                      <p className='mt-2 ml-12 text-[1.2rem] font-bold'>🕺 Don't Miss a Step! Get Reminders on WhatsApp!</p>
                      <img className='w-[1.6rem] mt-4 mr-9' src={wp} alt="" />
                    </div>
                    <p className='mt-2 text-[1.2rem] font-bold'>Scan the QR</p>
                    <QRCode value={whatsappLink} size={256} />
                    <p className='mt-2 text-[1.2rem] text-[#125b43] font-bold'>OR</p>
                    <button className='bg-[#2b7f7b] rounded-[4px] w-full p-2 text-white font-[600]' onClick={() => { window.open(whatsappLink, '_blank') }}>Click Here</button>
                  </div>
                )} */}
              </div>

              <div className={`flex flex-col-reverse my-2`}>
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
                  className="flex justify-between border-b-2 items-center h-[4rem]"
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
              <ul
                className={`h-[28rem] relative pb-[3rem] flex flex-col overflow-auto pt-6 ${(Ctx.userData.userType === "admin" ||
                    Ctx.userData.userType === "instructor") &&
                  (attendanceList
                    ? "h-[32rem] relative pb-[3rem]"
                    : "h-[28rem] relative pb-[3rem]")
                  } flex flex-col overflow-auto pt-6`}
                style={{
                  backgroundColor: InstitutionData.LightestPrimaryColor,
                }}
              >
                {!attendanceList && (
                  <li
                    className={`w-[100%] flex flex-col items-center justify-center p-2 `}
                  >
                    <div
                      className={`flex w-[85%] max1050:w-[96%] justify-between font-bold relative pr-8 `}
                    >
                      <p className={`overflow-hidden w-[7rem]`}>Date</p>
                      <p className={`w-[7rem]`}>Instructor</p>
                      <p
                        className={`w-[8rem] overflow-hidden `}
                      >
                        Description
                      </p>
                      <p className={`w-[8rem]`}>Time</p>
                      <p
                        className={
                          `w-[8rem] px-2 text-black max-h-[1.8rem] self-center`
                        }
                      >
                        {sortedFilteredClasses[0]?.zoomLink
                          ? "Join"
                          : "Attendance"}
                      </p>
                    </div>
                  </li>
                )}

                {!attendanceList ? (
                  <div
                    className={
                      UserCtx.userData.userType === "admin"
                        ? `overflow-auto flex flex-col gap-2 py-4`
                        : "overflow-auto flex flex-col gap-2 py-4"
                    }
                  >
                    {sortedFilteredClasses
                      .slice(startIndex, endIndex)
                      .filter((clas) => {
                        if (instructorTypeFilter === "") {
                          return true;
                        } else {
                          return clas.instructorNames === instructorTypeFilter;
                        }
                      })
                      .filter((clas) => {
                        // If user is an instructor, filter by class types they are associated with
                        if (Ctx.userData.userType === "instructor") {
                          // Check if classType exists in the instructor's allowed classTypes
                          return instructorClassTypes.includes(clas.classType);
                        }
                        if (classTypeFilter === "") {
                          return true;
                        } else {
                          return clas.classType === classTypeFilter;
                        }
                      })
                      .map((clas, i) => {
                        return (
                          <li
                            key={clas.classId}
                            className={`w-[100%] flex flex-col items-center justify-center ${editingIndex === i ? "bg-[#fdd00823]" : ""
                              } `}
                          >
                            <div
                              className={`flex w-[85%] max1050:w-[96%] justify-between items-center max1050:justify-between relative pr-8`}
                            >
                              <p className={`overflow-hidden w-[5.6rem] m-0`}>
                                {formatDate(parseInt(clas.date))}
                              </p>

                              <div className={`w-[7rem] ml-8`}>
                                {Ctx.userData.userType === "admin" ||
                                  Ctx.userData.userType === "instructor" ? (
                                  <select
                                    className={`rounded-[0.51rem] px-4 `}
                                    style={{
                                      backgroundColor:
                                        InstitutionData.LightestPrimaryColor,
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
                                          i.name !== "Cancelled" && (
                                            <option
                                              key={i.name}
                                              value={i.name}
                                              onChange={(e) => { }}
                                            >
                                              {i.name}
                                            </option>
                                          )
                                      )}
                                    <option
                                      value="Cancelled"
                                      onChange={(e) => { }}
                                    >
                                      Cancelled
                                    </option>
                                  </select>
                                ) : (
                                  <p
                                    className={`rounded-[0.51rem] px-4 `}
                                    style={{
                                      backgroundColor:
                                        InstitutionData.LightestPrimaryColor,
                                    }}
                                  >
                                    {getInstructor(clas.instructorNames)?.name}
                                  </p>
                                )}
                              </div>
                              <div className={`w-[7rem]`}>
                                {Ctx.userData.userType === "admin" ||
                                  Ctx.userData.userType === "instructor" ? (
                                  <select
                                    className={`rounded-[0.51rem] px-4 `}
                                    style={{
                                      backgroundColor:
                                        InstitutionData.LightestPrimaryColor,
                                    }}
                                    value={clas.classType}
                                    onChange={(e) => {
                                      onClassUpdated(
                                        clas.classId,
                                        getInstructor(clas.instructorNames)
                                          ?.name,
                                        e.target.value,
                                        clas.instructorId,
                                        clas.date
                                      );
                                    }}
                                  >
                                    {classTypeNameArray.map((name) => (
                                      <option
                                        key={name}
                                        value={name}
                                        onChange={(e) => { }}
                                      >
                                        {name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <p
                                    className={`rounded-[0.51rem] px-4`}
                                    style={{
                                      backgroundColor:
                                        InstitutionData.LightestPrimaryColor,
                                    }}
                                  >
                                    {clas.classType}
                                  </p>
                                )}
                              </div>
                              {Ctx.userData.userType === "admin" ||
                                Ctx.userData.userType === "instructor" ? (
                                <input
                                  value={getTime(clas.date)}
                                  type="time"
                                  className="border border-black rounded bg-transparent"
                                  onChange={(e) => {
                                    onClassUpdated(
                                      clas.classId,
                                      getInstructor(clas.instructorNames)?.name,
                                      clas.classType,
                                      clas.instructorId,
                                      new Date(getDate(clas.date) + "T" + e.target.value).getTime()
                                    );
                                  }}
                                />
                              ) : (
                                <p className={`m-0 `}>
                                  {new Date(parseInt(clas.date)).toLocaleString(
                                    "en-us",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              )}

                              <div className="flex gap-4 justify-center items-center">
                                {clas.zoomLink ? (
                                  <button
                                    className={`px-2 max-h-[1.8rem] w-[9rem] ml-1 text-white no-underline rounded-1 mr-[-1rem] `}
                                    style={{
                                      backgroundColor:
                                        InstitutionData.PrimaryColor,
                                    }}
                                    onClick={() => {
                                      if (
                                        UserCtx.userData.userType === "member"
                                      ) {
                                        const meetingNumberRegex =
                                          /(?:https?:\/\/)?(?:www\.)?zoom\.us\/j\/(\d+)/;
                                        const meetingNumberMatch =
                                          clas.zoomLink.match(
                                            meetingNumberRegex
                                          );
                                        const meetingNumber = meetingNumberMatch
                                          ? meetingNumberMatch[1]
                                          : "";

                                        const passwordRegex = /[?&]pwd=([^&]+)/;
                                        const passwordMatch =
                                          clas.zoomLink.match(passwordRegex);
                                        const password = passwordMatch
                                          ? passwordMatch[1]
                                          : "";

                                        Navigate(
                                          `/meeting?instructorId=${clas.instructorId}&meetingNumber=${meetingNumber}&password=${password}`
                                        );
                                      } else {
                                        window.open(
                                          clas.zoomLink,
                                          "_blank",
                                          "noreferrer"
                                        );
                                      }
                                      onJoinClass(
                                        InstitutionData.InstitutionId
                                      );
                                    }}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Join
                                  </button>
                                ) : (
                                  <button
                                    className="px-2 max-h-[1.8rem] w-[9rem] ml-1 text-white no-underline rounded-1 mr-[-1rem]"
                                    style={{
                                      backgroundColor:
                                        InstitutionData.PrimaryColor,
                                    }}
                                    onClick={() => markAttendance(clas.classId)}
                                  >
                                    {attendanceStatus[clas.classId] ||
                                      "Mark Attendance"}
                                  </button>
                                )}
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
                                {/*{UserCtx.userData.userType !== "member" && (*/}
                                {/*  <div*/}
                                {/*    className={*/}
                                {/*      "w-fit" +*/}
                                {/*      (UserCtx.userData.userType === "member"*/}
                                {/*        ? " hidden"*/}
                                {/*        : " ")*/}
                                {/*    }*/}
                                {/*  >*/}
                                {/*    <a*/}
                                {/*      href={`https://qrtag.net/api/qr_4.png?url=https://beta.happyprancer.com/put-attendance/${clas.classId}`}*/}
                                {/*      target="_blank"*/}
                                {/*    >*/}
                                {/*      <FaQrcode />*/}
                                {/*    </a>*/}
                                {/*  </div>*/}
                                {/*)}*/}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-6 text-black text-[1.1rem] font-[600]">
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
                    className={`absolute bottom-0 left-0 right-0 flex justify-center mb-1`}
                  >
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={(value) => setCurrentPage(value)}
                    />
                  </div>
                )}
              </ul>
            </div>
          </div>
          {/* ) */}
        </div>
      )}
      {isMobileScreen && <UpcomingSessionsMobile />}
    </>
  );
};

export default UpcomingSessions;
