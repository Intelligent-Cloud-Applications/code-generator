import React, { useState, useEffect, useContext } from 'react'
import { fetchStreakCount } from './StreakFunctions'
import './Streak.css'
import InstitutionContext from '../../../../Context/InstitutionContext'
import {API} from "aws-amplify";

const Streak = () => {
  const [streakData, setStreakData] = useState({ streakCount: 0, level: 0, attendance: 0 })
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
        data.attendance = attendance.Count;
        console.log('STREAK DATA', data);
        setStreakData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <div
      className="w-[100 flex flex-row p-[2rem] px-[3rem] items-center justify-between border h-[15%] main"
      style={{
        backgroundColor: InstitutionData.LightestPrimaryColor
      }}
    >
      <div className="flex flex-col p-[2rem]">
        <h2 className="stkm">Your Streak:</h2>
        <p className="mov">
          Increase your potential and your level with your streak
        </p>
      </div>
      <div className="flex flex-col text-[17px] text-center lev">
        ATTENDANCE
        <p className="text-[35px] stk">{streakData.attendance}</p>
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
  )
}

export default Streak
