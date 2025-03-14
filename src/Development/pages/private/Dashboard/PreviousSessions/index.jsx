import { API } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import Context from "../../../../Context/Context";
import { Button, Table } from "flowbite-react";
import PreviousSessionsMobile from "./mobile";
import { useMediaQuery } from "../../../../utils/helpers";
import { Button2 } from "../../../../common/Inputs";
import InstitutionContext from "../../../../Context/InstitutionContext";
import { toast } from "react-toastify";
import DateFormatter from "../../../../common/utils/DateFormatter";
import PaginationComponent from "../../../../common/Pagination";
import AttendanceModal from "../../../../common/AttendanceModal";
import formatTime from "../../../../common/utils/format-time";


const PreviousSessions = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const [classId, setClassId] = useState("");
  const [recordingLink, setRecordingLink] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const UserCtx = useContext(Context);
  const Ctx = useContext(Context);
  const UtilCtx = useContext(Context).util;
  const [classTypeFilter, setClassTypeFilter] = useState("");
  const [instructorTypeFilter, setinstructorTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Get current page classes
  const currentClasses = filteredClasses.slice(startIndex, endIndex);

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

  useEffect(() => {
    const activeUsers = (userList || []).filter(
      (user) => user?.status === "Active"
    );
    setActiveUsers(
      activeUsers.toSorted((a, b) => {
        const x = userAttendance[a?.cognitoId] || 0;
        const y = userAttendance[b?.cognitoId] || 0;
        return y - x;
      })
    );
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

  const isMobileScreen = useMediaQuery("(max-width: 600px)");
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] =
    useState(null);
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState({});

  const handleAttendanceClick = (classId) => {
    setSelectedClassForAttendance(classId);
    setShowAttendanceModal(true);
  };

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false);
    setSelectedClassForAttendance(null);
  };

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false);
    setSelectedUsers({});
    setSelectedClassForAttendance(null);
  };

  const filteredUsers = (userList || [])
    .filter((user) => user?.status === "Active")
    .filter((user) => {
      if (!attendanceSearchTerm) return true;
      return (
        user?.userName
          ?.toLowerCase()
          .includes(attendanceSearchTerm.toLowerCase()) ||
        user?.emailId
          ?.toLowerCase()
          .includes(attendanceSearchTerm.toLowerCase())
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
                    Time
                  </Table.HeadCell>
                  <Table.HeadCell className="font-semibold">
                    Recording Link
                  </Table.HeadCell>
                  {(Ctx.userData.userType === "admin" ||
                    Ctx.userData.userType === "instructor") && (
                    <Table.HeadCell className="font-semibold">
                      Attendance
                    </Table.HeadCell>
                  )}
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
                        <DateFormatter epochDate={clas.date} />
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 font-semibold">
                        {formatTime(clas.date)}
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 font-semibold">
                        <div className="flex items-center gap-2 w-fit">
                          {clas.recordingLink ? (
                            <>
                              <Button
                                href={clas.recordingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="xs"
                                style={{
                                  backgroundColor:
                                    InstitutionData.LightPrimaryColor,
                                }}
                                className="flex items-center justify-center gap-4"
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
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                View Recording
                              </Button>
                              {(Ctx.userData.userType === "admin" ||
                                Ctx.userData.userType === "instructor") && (
                                <button
                                  onClick={() =>
                                    handleUpdateClick(
                                      clas.classId,
                                      clas.recordingLink
                                    )
                                  }
                                  className="text-gray-600 hover:text-gray-800"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {Ctx.userData.userType === "admin" ||
                              Ctx.userData.userType === "instructor" ? (
                                <Button
                                  onClick={() =>
                                    handleUpdateClick(clas.classId, "")
                                  }
                                  size="xs"
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "1px solid #000",
                                  }}
                                  className="flex items-center gap-2 text-black"
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
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                  </svg>
                                  Add Recording
                                </Button>
                              ) : (
                                <p className="ml-2 text-gray-500">
                                  No Recording
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </Table.Cell>
                      {(Ctx.userData.userType === "admin" ||
                        Ctx.userData.userType === "instructor") && (
                        <Table.Cell className="text-gray-700 font-semibold">
                          <div className="flex items-center gap-4">
                            {(Ctx.userData.userType === "admin" ||
                              Ctx.userData.userType === "instructor") && (
                              <Button
                                onClick={() =>
                                  handleAttendanceClick(clas.classId)
                                }
                                size="xs"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #000",
                                }}
                                className="flex items-center gap-3 text-black"
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
                                Mark Attendance
                              </Button>
                            )}
                          </div>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              {/* Common components */}
              <PaginationComponent
                data={filteredClasses}
                itemsPerPage={6}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </>
      )}

      {/* Conditionally render the PreviousSessionsMobile component */}
      {isMobileScreen && <PreviousSessionsMobile />}

      {/* Update Recording Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%]">
            <h3 className="text-lg font-semibold mb-4">
              Update Recording Link
            </h3>
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
                <Button
                  type="submit"
                  style={{
                    backgroundColor: InstitutionData.LightPrimaryColor,
                  }}
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TODO: Common component */}
      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={handleCloseAttendanceModal}
        classId={selectedClassForAttendance}
        institutionId={InstitutionData.InstitutionId}
      />
    </>
  );
};

export default PreviousSessions;
