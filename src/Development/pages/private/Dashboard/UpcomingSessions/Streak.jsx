import React, { useState, useEffect, useContext, useRef } from "react";
import { fetchStreakCount } from "./StreakFunctions";
import "./Streak.css";
import InstitutionContext from "../../../../Context/InstitutionContext";
import { API } from "aws-amplify";
import { MdInfo, MdClose } from "react-icons/md";
import { Modal, Popover, Button } from "flowbite-react";

const Streak = () => {
  const [streakData, setStreakData] = useState({
    streakCount: 0,
    level: 0,
    attendance: 0,
    attendanceByClassTypes: {},
  });
  const [openModal, setOpenModal] = useState(false);
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await fetchStreakCount(InstitutionData.InstitutionId);
        console.log("STREAK DATA", data);
        const attendance = await API.get(
          "main",
          `/user/list-attendance/${InstitutionData.InstitutionId}`,
          {}
        );
        let attendanceByClassTypes = {};
        for (let classType of InstitutionData.ClassTypes) {
          attendanceByClassTypes[classType] = attendance.Items.reduce(
            (acc, item) => acc + (item.classType === classType ? 1 : 0),
            0
          );
        }
        console.log(attendanceByClassTypes);
        data.attendance = attendance.Count;
        data.attendanceByClassTypes = attendanceByClassTypes;
        console.log("STREAK DATA", data);
        setStreakData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Add event listener to handle clicks outside the modal
    const handleClickOutside = (event) => {
      if (
        openModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setOpenModal(false);
      }
    };

    // Add the event listener when the modal is open
    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  return (
    <>
      <div
        className="w-[100%] flex flex-row p-8 items-center justify-between rounded-md shadow-md bg-opacity-90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl relative overflow-hidden mb-4"
        style={{
          background: InstitutionData.LightestPrimaryColor,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>

        <div className="flex flex-col z-10 flex-1 mr-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Track Your Progress 🎯
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md">
            Keep the energy alive and rise higher with your performance and
            milestones
          </p>
        </div>

        <div className="flex items-center gap-12 z-10">
          <div className="flex flex-col items-center px-6 py-3 rounded-md bg-white bg-opacity-20 backdrop-blur-sm transition-transform hover:scale-105">
            <span className="text-gray-700 font-medium mb-1">ATTENDANCE</span>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-800">
                {streakData.attendance}
              </p>
              <MdInfo
                className="text-primaryColor hover:text-gray-800 cursor-pointer transition-colors"
                size={24}
                onClick={() => setOpenModal(true)}
              />
            </div>
          </div>

          <div className="flex flex-col items-center px-6 py-3 rounded-md bg-white bg-opacity-20 backdrop-blur-sm transition-transform hover:scale-105">
            <span className="text-gray-700 font-medium mb-1">LEVEL</span>
            <p className="text-2xl font-bold text-gray-800">
              {streakData.level}
            </p>
          </div>

          <div className="flex flex-col items-center px-6 py-3 rounded-md bg-white bg-opacity-20 backdrop-blur-sm transition-transform hover:scale-105">
            <span className="text-gray-700 font-medium mb-1">STREAK</span>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-800">
                {streakData.streakCount}
              </p>
              <span className="text-yellow-500">🔥</span>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        dismissible={true}
        popup={false}
        ref={modalRef}
        root={document.body}
      >
        <Modal.Header className="border-b-0 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-800">
              Your Attendance Summary
            </h3>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-0 pb-6 px-6">
          <p className="text-gray-600 my-4 ml-6">Classes attended by type</p>

          <div className="bg-white rounded-lg shadow-sm p-5 mb-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.getOwnPropertyNames(
                streakData.attendanceByClassTypes
              ).map((classType, index) => {
                // Create an array of colors for variety

                return (
                  <div
                    key={classType}
                    className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-800 truncate max-w-[120px]">
                          {classType}
                        </h4>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-xs text-gray-500">
                        Classes Attended
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: InstitutionData.PrimaryColor }}
                      >
                        {streakData.attendanceByClassTypes[classType]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: InstitutionData.PrimaryColor }}
                >
                  <span className="text-white text-2xl">🏆</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">
                    Total Classes Attended
                  </span>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: InstitutionData.PrimaryColor }}
                  >
                    {streakData.attendance}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500 block">
                  Current Streak
                </span>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-gray-800">
                    {streakData.streakCount}
                  </p>
                  <span className="text-yellow-500">🔥</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t-0 flex justify-center pt-0"></Modal.Footer>
      </Modal>
    </>
  );
};

export default Streak;
