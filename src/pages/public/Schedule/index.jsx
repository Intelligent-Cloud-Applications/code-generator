import React, { useContext, useState, useEffect, useCallback } from "react";
import Img1 from "../../../utils/images/yoga.png";
import NavBar from "../../../components/Header";
import InstitutionContext from "../../../Context/InstitutionContext";
import { API } from "aws-amplify";
import "./Schedule.css";
import Context from "../../../Context/Context";
import Footer from "../../../components/Footer";

const groupScheduleByDay = (scheduleData) => {
  const groupedSchedule = {};
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  scheduleData.forEach((classInfo) => {
    const date = new Date(classInfo.startTime);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const startTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    if (!groupedSchedule[dayOfWeek]) {
      groupedSchedule[dayOfWeek] = [];
    }

    groupedSchedule[dayOfWeek].push({ ...classInfo, startTime });
  });

  // Sort the keys so that today appears first
  const sortedDays = Object.keys(groupedSchedule).sort((a, b) => {
    if (a === currentDay) return -1;
    if (b === currentDay) return 1;
    return 0;
  });

  // Create a new object with sorted keys
  const sortedSchedule = {};
  sortedDays.forEach((day) => {
    sortedSchedule[day] = groupedSchedule[day];
  });

  return sortedSchedule;
};

const Schedule = () => {
  const [schedule, setSchedule] = useState({});
  const { institutionData } = useContext(InstitutionContext);
  const [loaderInitialized, setLoaderInitialized] = useState(false);
  const UtilCtx = useContext(Context).util;

  const fetchSchedule = useCallback(async () => {
    try {
      if (!loaderInitialized) {
        UtilCtx.setLoader(true);
        setLoaderInitialized(true);
      }
      const currentDate = new Date();
      const today = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      const nextWeekStartDate = new Date(today);
      console.log(nextWeekStartDate);
      const nextWeekEndDate = new Date(today);
      nextWeekEndDate.setDate(nextWeekEndDate.getDate() + 7);

      const response = await API.get(
        "user",
        `/user/schedule/${institutionData.InstitutionId}`
      );
      const nextWeekClasses = response.filter((classInfo) => {
        const classDate = new Date(classInfo.startTime);
        return classDate >= today && classDate < nextWeekEndDate;
      });
      const groupedSchedule = groupScheduleByDay(nextWeekClasses);
      setSchedule(groupedSchedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      UtilCtx.setLoader(false);
    }
  }, [institutionData.InstitutionId, UtilCtx, loaderInitialized]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const isEmptySchedule = Object.keys(schedule).length === 0;
  return (
    <>
      <NavBar />
      <div className="flex justify-center pt-[2rem]">
        <div
          className="text-[3rem] max600:text-[2rem] text-center text-white rounded-lg px-4 py-2 monserrat-bold"
          style={{ backgroundColor: institutionData.PrimaryColor }}
        >
          <h1 className="text-white text-3xl mt-2 sm:text-5xl sm:mt-3 p-0 font-bold text-center monserrat-bold">
            This Week
          </h1>
        </div>
      </div>
      <div className="flex justify-center">
        {isEmptySchedule ? (
          <div className="flex flex-col items-center my-8 px-3">
            <div className="h-10"></div>
            <p className="text-lg sm:text-xl text-center text-black font-bold">
              Stay motivated! We're working on updating the schedule. Check back
              soon for new classes and keep your spirits high!
            </p>
            <div className="h-10"></div>
          </div>
        ) : (
          <div className="flex flex-row justify-evenly flex-wrap my-8 px-3 gap-x-0 gap-y-0 sm:gap-x-20 sm:gap-y-10 sm:w-[70vw]">
            {Object.keys(schedule).map((day, index) => (
              <Card
                key={index}
                day={day}
                events={schedule[day]}
                isToday={
                  day ===
                  new Date().toLocaleDateString("en-US", { weekday: "long" })
                }
                institutionData={institutionData}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

function Card({ day, events, isToday, institutionData }) {
  const sortedEvents = events.sort((a, b) => {
    const isAMa = a.startTime.includes("AM");
    const isAMb = b.startTime.includes("AM");
    if (isAMa && !isAMb) return -1;
    if (!isAMa && isAMb) return 1;
    return 0;
  });

  return (
    <div
      className={`relative scale-75 sm:scale-100 w-[14rem] mb-4 rounded-lg shadow-lg shadow-slate-700 ${
        isToday ? "bg-white text-black" : "text-white"
      } flex flex-col`}
      style={{ backgroundColor: institutionData.PrimaryColor }}
    >
      <div className="p-4 flex flex-col h-full justify-between">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-center text-3xl font-bold mb-2 fasthand-regular">
            {day}
          </h2>
          <ul className="flex justify-center items-start flex-col pl-0">
            {sortedEvents.map((event, index) => (
              <li
                key={index}
                className="my-0.5 flex justify-center text-sm sm:text-xm chelsea-market-regular"
              >
                {event.startTime} - {event.classType}
              </li>
            ))}
          </ul>
        </div>
        <div className="opacity-35 saturate-0 brightness-0 mt-4">
          <img src={Img1} alt="yoga" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}

export default Schedule;
