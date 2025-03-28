import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../../../../Context/Context'
import InstitutionContext from '../../../../Context/InstitutionContext'
import web from '../../../../utils/data.json'
import {
  FaUser,
  FaCalendarAlt,
  FaHistory,
  FaUsers,
  FaVideo,
  FaEdit,
  FaShoppingCart,
  FaEnvelope,
} from 'react-icons/fa'
import { GiStarsStack } from 'react-icons/gi'
import { HiCurrencyDollar } from 'react-icons/hi2'
import {FaQrcode} from "react-icons/fa6";

const LeftBanner = ({ displayAfterClick }) => {
  const [click, setClick] = useState('Upcoming Classes')
  const [mobileClick, setMobileClick] = useState('Upcoming')
  const Navigate = useNavigate()
  const UserCtx = useContext(Context)
  const InstitutionData = useContext(InstitutionContext).institutionData
  
  const isMember = UserCtx.userData.userType === 'member'
  const isAdmin = UserCtx.userData.userType === 'admin'
  const isInstructor = UserCtx.userData.userType === 'instructor'

  const getInitials = (name) => {
    if (!name) return ''
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
    return initials
  }

  const getColor = (name) => {
    if (!name) return '#888888'
    const colors = [
      '#FF5733',
      '#33FF57',
      '#5733FF',
      '#FF5733',
      '#33FF57',
      '#5733FF',
      '#FF5733',
      '#33FF57',
      '#5733FF',
      '#FF5733',
      '#33FF57',
      '#5733FF'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const ListItem = ({ icon, text, onClickFn }) => {
    return (
      <div
        className={`w-[90%] px-2 flex flex-row items-center rounded-md hover:bg-lighestPrimaryColor hover:bg-opacity-10 cursor-pointer ${click === text && `bg-lighestPrimaryColor bg-opacity-20 font-medium`}`}
        onClick={onClickFn}
      >
        <span className="px-2">{icon}</span>
        <li
          className={`px-1 py-2 ${click === text ? `font-semibold` : `font-medium`}`}
        >
          {text}
        </li>
      </div>
    )
  }

  const ListItemMobile = ({ icon, text, onClickFn }) => {
    return (
      <button
        type="button"
        class={`inline-flex flex-col items-center justify-center font-medium px-3.5 py-3.5 rounded hover:bg-gray-50  group focus:outline-none ${mobileClick === text && `bg-gray-200`}`}
        onClick={onClickFn}
      >
        <div className="text-gray-500 w-5 h-5 mb-1 ">
          {icon}
        </div>
        <span class="text-[0.5rem] w-12 text-gray-500 dark:text-gray-400">
          {text}
        </span>
      </button>
    )
  }

  return (
    <>

      {/*for Mobile View */}
      <div class="fixed bottom-0 left-0 z-50 w-full h-auto bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 min800:hidden">
        <div
          class="flex flex-row h-full w-full overflow-x-auto justify-between items-center border-t"
          style={{ borderColor: InstitutionData.PrimaryColor }}
        >
          <ListItemMobile
            icon={<FaCalendarAlt size={20} />}
            text={'Upcoming'}
            onClickFn={() => {
              setMobileClick('Upcoming')
              displayAfterClick(0)
            }}
          />
          <ListItemMobile
            icon={<FaHistory size={20} />}
            text={'Previous'}
            onClickFn={() => {
              setMobileClick('Previous')
              displayAfterClick(1)
            }}
          />
          <ListItemMobile
            icon={<FaVideo size={20} />}
            text={'Choreography'}
            onClickFn={() => {
              setMobileClick('Choreography')
              displayAfterClick(2)
            }}
          />
          <ListItemMobile
            icon={<GiStarsStack size={20} />}
            text={'Ratings'}
            onClickFn={() => {
              setMobileClick('Ratings')
              displayAfterClick(5)
            }}
          />
          {isAdmin && (
            <ListItemMobile
              icon={<FaUsers size={20} />}
              text={'Members'}
              onClickFn={() => {
                setMobileClick('Members')
                displayAfterClick(4)
              }}
            />
          )}
          {!isInstructor && (
            <ListItemMobile
              icon={<HiCurrencyDollar size={20} />}
              text={isAdmin ? 'Revenue' : 'Payments'}
              onClickFn={() => {
                isMember ? setMobileClick('Payments') : setMobileClick('Revenue')
                isMember ? displayAfterClick(6) : displayAfterClick(7)
              }}
            />
          )}
          <ListItemMobile
            icon={<FaUser size={20} />}
            text={'Account'}
            onClickFn={() => {
              setMobileClick('Account')
              displayAfterClick(3)
            }}
          />
          <ListItemMobile
            icon={<FaEnvelope size={20} />}
            text={'Contact'}
            onClickFn={() => Navigate('/query')}
          />
        </div>
      </div>

      {/* for Desktop view */}
      <div
        className="text-[#E4E4E4] w-[18rem] relative max800:hidden"
        style={{ backgroundColor: InstitutionData.PrimaryColor }}
      >
        <nav>
          <div className="h-auto flex items-center gap-3 px-3 py-3">
            {UserCtx.userData.imgUrl ? (
              <img
                className="h-12 w-12 rounded-full bg-white"
                src={UserCtx.userData.imgUrl}
                alt="profile"
              />
            ) : (
              <div
                className={`rounded-full p-2 h-12 w-12 bg-gray-600 flex items-center justify-center text-[1rem] text-white`}
                style={{ backgroundColor: getColor(UserCtx.userData.userName) }}
              >
                {getInitials(UserCtx.userData.userName)}
              </div>
            )}

            <div className="m-0 p-0 text-lg font-semibold flex flex-col gap-2 mt-1">
              Hi👋, {UserCtx.userData.userName?.split(' ')[0]}
              <div className="flex justify-center items-center">
                <div
                  className=" bg-white py-0 px-2 text-center inline-block rounded-xl text-[0.75rem] font-medium capitalize "
                  style={{ color: InstitutionData.PrimaryColor }}
                >
                  {UserCtx.userData.userType}
                </div>
              </div>
            </div>
          </div>
          <span className="h-[1px] w-full bg-primaryColor block mb-3"></span>
          <ul className="flex flex-col gap-2 justify-center ml-0 list-none pl-0 items-center overflow-y-auto">
            <ListItem
              icon={<FaCalendarAlt size={18} />}
              text="Upcoming Classes"
              onClickFn={() => {
                setClick('Upcoming Classes')
                displayAfterClick(0)
              }}
            />
            <ListItem
              icon={<FaHistory size={18} />}
              text="Previous Classes"
              onClickFn={() => {
                setClick('Previous Classes')
                displayAfterClick(1)
              }}
            />
            <ListItem
              icon={<FaVideo size={18} />}
              text="Choreography"
              onClickFn={() => {
                setClick('Choreography')
                displayAfterClick(2)
              }}
            />
            <ListItem
              icon={<GiStarsStack size={18} />}
              text="Ratings"
              onClickFn={() => {
                setClick('Ratings')
                displayAfterClick(5)
              }}
            />
            {isAdmin && (
              <ListItem
                icon={<FaUsers size={18} />}
                text="Members"
                onClickFn={() => {
                  setClick('Members')
                  displayAfterClick(4)
                }}
              />
            )}
            {!isInstructor && (
              <ListItem
                icon={<HiCurrencyDollar size={18} />}
                text={isAdmin ? 'Revenue' : 'Payments'}
                onClickFn={() => {
                  isMember ? setClick('Payments') : setClick('Revenue')
                  isMember ? displayAfterClick(6) : displayAfterClick(7)
                }}
              />
            )}

            <ListItem
              icon={
                isAdmin ? <FaEdit size={18} /> : <FaShoppingCart size={18} />
              }
              text="Subscriptions"
              onClickFn={() => {
                const baseUrl =
                  process.env.REACT_APP_STAGE === "DEV"
                    ? "https://beta.happyprancer.com"
                    : "https://happyprancer.com";

                const url = `${baseUrl}/allpayment/${web.InstitutionId}/${UserCtx.userData.cognitoId}/${UserCtx.userData.emailId}`
                window.open(url, '_blank', 'noopener,noreferrer')
              }}
            />

            <ListItem
              icon={<FaUser size={18} />}
              text="Account"
              onClickFn={() => {
                setClick('Account')
                displayAfterClick(3)
              }}
            />

            <ListItem
              icon={<FaEnvelope size={18} />}
              text="Contact us ?"
              onClickFn={() => Navigate('/query')}  
            />

            {isAdmin && (
              <ListItem
                icon={<FaQrcode size={18} />}
                text="QR Codes"
                onClickFn={() => {
                  setClick('QR Codes')
                  displayAfterClick(8)
                }}
              />
            )}

          </ul>
        </nav>
      </div>
    </>
  )
}

export default LeftBanner