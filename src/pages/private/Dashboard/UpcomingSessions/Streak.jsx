import React, { useState, useEffect, useContext } from 'react'
import { fetchStreakCount } from './StreakFunctions'
import './Streak.css'
import InstitutionContext from '../../../../Context/InstitutionContext'
import {API} from "aws-amplify";
import {MdInfo} from "react-icons/md";
import {Modal, Popover} from "flowbite-react";

const Streak = () => {
  const [streakData, setStreakData] = useState({ streakCount: 0, level: 0, attendance: 0, attendanceByClassTypes: {} })
  const [openModal, setOpenModal] = useState(false);
  const InstitutionData = useContext(InstitutionContext).institutionData

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await fetchStreakCount(InstitutionData.InstitutionId);
        console.log('STREAK DATA', data);
        const attendance = await API.get(
          'main',
          `/user/list-attendance/${InstitutionData.InstitutionId}`,
          {}
        );
        let attendanceByClassTypes = {};
        for (let classType of InstitutionData.ClassTypes) {
          attendanceByClassTypes[classType] = attendance.Items.reduce((acc, item) => acc + (item.classType === classType ? 1 : 0), 0);
        }
        console.log(attendanceByClassTypes);
        data.attendance = attendance.Count;
        data.attendanceByClassTypes = attendanceByClassTypes;
        console.log('STREAK DATA', data);
        setStreakData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <div
        className="w-[100%] flex flex-row p-[2rem] px-[1.5rem] items-center justify-between border h-[15%] main"
        style={{
          backgroundColor: InstitutionData.LightestPrimaryColor
        }}
      >
        <div className="flex flex-col">
          <h2 className="stkm">Your Streak:</h2>
          <p className="mov">
            Increase your potential and your level with your streak
          </p>
        </div>
        <div className="flex flex-col text-[17px] text-center lev">
          ATTENDANCE
          <p className="text-[35px] stk flex justify-center items-center gap-2">
            {streakData.attendance}
            <MdInfo className="inline" size={24} onClick={() => setOpenModal(true)}/>
          </p>
        </div>
        <div className="flex flex-col text-[17px] text-center lev">
          LEVEL
          <p className="text-[35px] stk">{streakData.level}</p>
        </div>
        <div className="flex flex-col text-[17px] text-center stk mr-6">
          STREAK
          <p className="text-[35px] stk">{streakData.streakCount}</p>
        </div>
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="p-2">Attendance</Modal.Header>
        <Modal.Body className="flex justify-center gap-4">
          {Object.getOwnPropertyNames(streakData.attendanceByClassTypes).map(a =>
            <div key={a} className="p-4 flex flex-col items-center gap-2 border-2">
              <h4>{a}</h4>
              <p>{streakData.attendanceByClassTypes[a]}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Streak