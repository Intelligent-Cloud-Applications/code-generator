import React, { useState, useContext, useEffect } from "react";
import { Button } from "flowbite-react";
import { API } from "aws-amplify";
import Context from "../../Context/Context";
import { toast } from "react-toastify";

const AttendanceModal = ({ isOpen, onClose, classId, institutionId }) => {
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState({});
  const { userList = [], util } = useContext(Context) || {};

  // Filter users based on search term
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
    })
    .sort((a, b) => {
      // Sort by attendance status (marked first)
      const aIsMarked = selectedUsers[a.cognitoId] || false;
      const bIsMarked = selectedUsers[b.cognitoId] || false;
      
      if (aIsMarked && !bIsMarked) return -1;
      if (!aIsMarked && bIsMarked) return 1;
      
      // If both have same attendance status, sort alphabetically by name
      return a.userName?.localeCompare(b.userName || '');
    });

  // Fetch attendance data when modal opens
  useEffect(() => {
    if (isOpen && classId) {
      fetchAttendanceData();
    }

    // Cleanup function to reset state when component unmounts
    return () => {
      setSelectedUsers({});
      setAttendanceSearchTerm("");
    };
  }, [isOpen, classId]);

  const fetchAttendanceData = async () => {
    util.setLoader(true);
    try {
      const response = await API.get(
        "main",
        `/admin/query-attendance/${institutionId}?classId=${classId}`
      );
      const attendedUsers = response.Items || [];
      const initialSelectedUsers = {};

      // Initialize with currently attended users
      attendedUsers.forEach((user) => {
        initialSelectedUsers[user.cognitoId] = true;
      });

      setSelectedUsers(initialSelectedUsers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch attendance data");
    } finally {
      util.setLoader(false);
    }
  };

  const handleToggleAttendance = async (cognitoId, emailId) => {
    util.setLoader(true);
    try {
      await API.post("main", `/admin/put-attendance/${institutionId}`, {
        body: {
          classId: classId,
          cognitoId: cognitoId,
          emailId: emailId,
        },
      });

      // Update local state
      setSelectedUsers((prev) => ({
        ...prev,
        [cognitoId]: !prev[cognitoId],
      }));

      toast.success("Attendance updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update attendance");
    } finally {
      util.setLoader(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Mark Attendance</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
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
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No users found</p>
          ) : (
            filteredUsers.map((user) => (
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
                    onChange={() =>
                      handleToggleAttendance(user.cognitoId, user.emailId)
                    }
                    disabled={selectedUsers[user.cognitoId] || false}
                    title={selectedUsers[user.cognitoId] ? "Already marked" : ""}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer 
                      ${
                        selectedUsers[user.cognitoId]
                          ? "bg-primaryColor"
                          : "bg-gray-200"
                      } 
                      peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                      after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                      after:transition-all
                      ${selectedUsers[user.cognitoId] ? "opacity-75 cursor-not-allowed" : ""}`}
                  ></div>
                </label>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
