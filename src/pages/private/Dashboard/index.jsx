import React, { useContext, useState } from 'react'
import Choreography from './Choreography'
import LeftBanner from './LeftBanner'
import PreviousSessions from './PreviousSessions'
import ProfileUpdate from './ProfileUpdate'
import UpcomingSessions from './UpcomingSessions'
import UsersList from './UsersList'
import DashboardRating from './DashboardRating'
import Billing from './Billing'
import NavBar from '../../../components/Header'
import Context from '../../../Context/Context'
import { useNavigate } from 'react-router-dom'
import InstitutionContext from '../../../Context/InstitutionContext'

const DashBoard = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData
  const Navigate = useNavigate()
  const [click, setClick] = useState(0)
  const [userCheck, setUserCheck] = useState(0)
  const Ctx = useContext(Context)
  const unpaidUser = {
    text: 'Embrace a world of possibilities. Unlock exclusive features. Subscribe now and elevate your experience with our extraordinary offerings.'
  }

  const displayAfterClick = () => {
    switch (click) {
      case 0:
        return <UpcomingSessions />

      case 1:
        return <PreviousSessions />

      case 2:
        return <Choreography />

      case 3:
        return (
          <ProfileUpdate
            setClick={setClick}
            displayAfterClick={displayAfterClick}
          />
        )

      case 4:
        return <UsersList userCheck={userCheck} setUserCheck={setUserCheck} />

      case 5:
        return (
          <div className="">
            <DashboardRating />
          </div>
        )

      case 6:
        return <Billing />

      default:
        return <div></div>
    }
  }

  const isProfileSection = click === 3

  return (
    <div
      className={` w-screen min-h-screen `}
      style={{ minHeight: '100vh' }}
    >
      <NavBar />
      <div
        className={`w-[calc(100vw-1rem)] ml-4 rounded-3xl flex max1050:w-screen max1050:ml-0 max536:rounded-none max536:mt-10 items-top mt-[4rem]`}
      >
        <LeftBanner
          displayAfterClick={(data) => {
            setClick(data)
          }}
        />
        <div
          className={`flex flex-col w-[100%] pt-8 max536:pt-0 justify-start h-[calc(100vh-2rem)]`}
        >
          {Ctx.userData.status === 'InActive' &&
          Ctx.userData.userType === 'member' &&
          !isProfileSection ? (
            <div className={`relative`}>
              <div
                className={`absolute z-10 top-[30%] right-[15%] max1050:w-[92%] flex justify-between rounded-[0.51rem]`}
              >
                <div className={`w-[100%]`}>
                  <div
                    className={`locked-screen relative flex items-center justify-center text-center mt-[3.5rem]`}
                  >
                    <div className={`unlock-button`}>
                      <h2
                        className={`w-[fit-content] text-[1.5rem] max500:text-[1.2rem] ml-[5rem]`}
                      >
                        {unpaidUser.text}
                      </h2>
                      <div
                        className={`Subscribe-button ml-[8rem] w-[6rem] h-[3rem] m-[2rem] rounded-[1.5rem] text-white`}
                        onClick={() => {
                          // Redirect the user to the subscription page
                          Navigate('/subscription')
                        }}
                        style={{
                          backgroundColor: InstitutionData.PrimaryColor
                        }}
                      >
                        <img
                          src={`https://institution-utils.s3.amazonaws.com/institution-common/images/Dashboard/lock.svg`} // Provide the source for the lock image
                          alt=""
                          className={`top-7 w-[2.8rem] translate-x-[-2%] absolute fa-4x mb-4`}
                          onClick={() => {
                            // Redirect the user to the subscription page
                            Navigate('/subscription')
                          }}
                        />

                        <span className={`Latch`}>
                          <span className={`Lock`}></span>
                        </span>
                        <span className={`UnlockText`}>UNLOCK</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`opacity-[20%]`}>{displayAfterClick()}</div>
            </div>
          ) : (
            <div>{displayAfterClick()} </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashBoard
