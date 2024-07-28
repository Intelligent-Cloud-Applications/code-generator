import React, { useContext, useState, useEffect, useCallback } from 'react';
import NavBar from '../../../components/Header';
import InstitutionContext from '../../../Context/InstitutionContext';
import { API } from 'aws-amplify';
import './Schedule.css';
import Footer from '../../../components/Footer';
import Context from '../../../Context/Context';

const groupScheduleByDay = (scheduleData) => {
  const groupedSchedule = {};
  scheduleData.forEach((classInfo) => {
    const date = new Date(classInfo.startTime);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const startTime = formatTime(date);
    const track = classInfo.track || '';
    if (!groupedSchedule[dayOfWeek]) {
      groupedSchedule[dayOfWeek] = {};
    }
    if (!groupedSchedule[dayOfWeek][track]) {
      groupedSchedule[dayOfWeek][track] = [];
    }
    groupedSchedule[dayOfWeek][track].push({ ...classInfo, startTime });
  });
  return groupedSchedule;
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const extractCommonTimes = (classes) => {
  const commonTimes = new Set();
  classes.forEach((classInfo) => {
    const date = new Date(classInfo.startTime);
    const startTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    commonTimes.add(startTime);
  });
  return Array.from(commonTimes).sort();
};

const generateTimeSlotList = (nextWeekClasses) => {
  const timeSlotList = {};

  nextWeekClasses.forEach(classInfo => {
    const date = new Date(classInfo.startTime);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const startTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    if (!timeSlotList[startTime]) {
      timeSlotList[startTime] = {};
    }

    if (!timeSlotList[startTime][dayOfWeek]) {
      timeSlotList[startTime][dayOfWeek] = [];
    }

    timeSlotList[startTime][dayOfWeek].push(classInfo);
  });

  return timeSlotList;
};

const Schedule = () => {
  const [schedule, setSchedule] = useState({});
  const [commonTimeSlots, setCommonTimeSlots] = useState([]);
  const { institutionData } = useContext(InstitutionContext);
  const [loaderInitialized, setLoaderInitialized] = useState(false);
  const UtilCtx = useContext(Context).util;
  const [timeSlotList, setTimeSlotList] = useState({});

  const fetchSchedule = useCallback(async () => {
    try {
      if (!loaderInitialized) {
        UtilCtx.setLoader(true);
        setLoaderInitialized(true);
      }

      const currentDate = new Date();
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const nextWeekEndDate = new Date(today);
      nextWeekEndDate.setDate(nextWeekEndDate.getDate() + 7);

      const response = await API.get('main', `/user/schedule/${institutionData.InstitutionId}`);

      const nextWeekClasses = response.filter(classInfo => {
        const classDate = new Date(classInfo.startTime);
        return classDate >= today && classDate < nextWeekEndDate;
      });

      if (nextWeekClasses.length === 0) {
        setSchedule(null);
      } else {
        const groupedSchedule = groupScheduleByDay(nextWeekClasses);
        setSchedule(groupedSchedule);
        const commonTimes = extractCommonTimes(nextWeekClasses);
        setCommonTimeSlots(commonTimes);
        const timeSlotList = generateTimeSlotList(nextWeekClasses);

        const scheduleData = {
          timestamp: Date.now(),
          groupedSchedule,
          commonTimes,
          timeSlotList,
        };

        localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
        setTimeSlotList(scheduleData.timeSlotList);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      UtilCtx.setLoader(false);
    }
  }, [institutionData.InstitutionId, UtilCtx, loaderInitialized]);

  useEffect(() => {
    const cachedSchedule = localStorage.getItem('scheduleData');
    if (cachedSchedule) {
      const data = JSON.parse(cachedSchedule);
      const cacheTimestamp = data.timestamp;
      const currentTime = Date.now();
      const cacheAge = currentTime - cacheTimestamp;
      const cacheMaxAge = 60 * 60 * 1000; 

      if (cacheAge > cacheMaxAge) {
        localStorage.removeItem('scheduleData');
        fetchSchedule();
      } else {
        setSchedule(data.groupedSchedule);
        setCommonTimeSlots(data.commonTimes);
        setTimeSlotList(data.timeSlotList);
      }
    } else {
      fetchSchedule();
    }
  }, [fetchSchedule]);

  return (
    <div className="page-wrapper">
      <NavBar />
      <div className="container text-[#ffffff]">
        {schedule === null ? (
          <div className="text-[#000000] flex flex-row justify-center items-center w-full">
            <h1 className="font-bold">No classes scheduled for the next 7 days.</h1>
            <div className='h-24'></div>
          </div>
        ) : (
          <div className="schedule-container">
            <table style={{ backgroundColor: institutionData.PrimaryColor, zIndex: 1000 }}>
              <thead>
                <tr>
                  <th></th>
                  {commonTimeSlots.map((timeSlot, idx) => (
                    <th key={idx} colSpan="2">{timeSlot}</th>
                  ))}
                </tr>
                <tr className='mob'>
                  <th></th>
                  {commonTimeSlots.map((timeSlot, idx) => (
                    <React.Fragment key={idx}>
                      <th>Class Type</th>
                      <th>Instructor Name</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(schedule).map((day, idx) => (
                  <tr key={idx}>
                    <td>{day}</td>
                    {commonTimeSlots.map((timeSlot, idx) => (
                      <td key={idx} colSpan="2">
                        {(timeSlotList[timeSlot] && timeSlotList[timeSlot][day]) ? (
                          <table>
                            <tbody className="no-border">
                              {timeSlotList[timeSlot][day].map((classInfo, index) => (
                                <tr key={index} className='cls'>
                                  <td>{classInfo.classType}</td>
                                  <td>{classInfo.instructorNames}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : <h1 className='text-[#ffffff]'>--</h1>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className='h-10'></div>
      <Footer />
    </div>
  );
};

export default Schedule;
