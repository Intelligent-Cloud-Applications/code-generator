import React, { useState } from 'react'
import { useContext } from 'react'
import Context from '../../../../Context/Context'
import './index.css'
import { API } from 'aws-amplify'
import {Pagination} from "flowbite-react";
import 'bootstrap/dist/css/bootstrap.min.css'
import './mobile.css'
import InstitutionContext from '../../../../Context/InstitutionContext'

const UsersListMobile = ({ userCheck, setUserCheck }) => {
  const InstitutionData = useContext(InstitutionContext).institutionData
  const Ctx = useContext(Context)
  const [isUserAdd, setIsUserAdd] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus] = useState('Active')
  const [balance, setBalance] = useState('')
  const UtilCtx = useContext(Context).util
  const [userStatus, setUserStatus] = useState('all')
  // eslint-disable-next-line
  const [cognitoId, setCognitoId] = useState('')
  const [isViewingProfile, setIsViewingProfile] = useState(true)

  const toggleProfileView = () => {
    setIsViewingProfile(!isViewingProfile)
  }

  const filterUsersByStatus = (status) => {
    if (status === 'all') {
      return Ctx.userList
    }
    return Ctx.userList.filter((user) => user.status === status)
  }

  const availableStatuses = [
    'all',
    ...Array.from(new Set(Ctx.userList.map((user) => user.status)))
  ]

  const itemsPerPage = 5 // Set the desired number of items per page
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(Ctx.userList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  // eslint-disable-next-line
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  const [searchQuery, setSearchQuery] = useState('') // Step 1: Add state for the search query

  const formatDate = (epochDate) => {
    const date = new Date(epochDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed, so we add 1 to get the correct month
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Step 2: Implement the search functionality
  const filter2 = filterUsersByStatus(userStatus)
  const filteredUserList = filter2
    .filter((user) => {
      return (
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.emailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNumber.includes(searchQuery)
      )
    })
    .slice(startIndex, endIndex)
  // eslint-disable-next-line
  const onUpdateUser = async (e) => {
    e.preventDefault()

    if (!(name && email && phoneNumber && status && balance)) {
      alert('Fill all Fields')
      return
    }
    if (!name) {
      alert('Fill Name')
      return
    } else if (!email) {
      alert('Fill email')
      return
    } else if (!phoneNumber) {
      alert('Fill Phone Number')
      return
    } else if (!status) {
      alert('Fill Status')
      return
    } else if (!balance) {
      alert('Fill Balance')
      return
    }

    UtilCtx.setLoader(true)

    try {
      await API.put(
        'main',
        `/admin/update-user/${InstitutionData.InstitutionId}`,
        {
          body: {
            cognitoId: cognitoId,
            emailId: email,
            userName: name,
            phoneNumber: phoneNumber,
            status: status,
            balance: balance
          }
        }
      )

      alert('User Updated')

      setName('')
      setEmail('')
      setPhoneNumber('')
      setStatus('')
      setBalance('')

      Ctx.onreload()

      UtilCtx.setLoader(false)
    } catch (e) {
      console.log(e)
      UtilCtx.setLoader(false)
    }
  }

  const onCreateUser = async (e) => {
    e.preventDefault()

    if (!(name && email && phoneNumber && status && balance)) {
      alert('Fill all Fields')
      return
    }
    if (!name) {
      alert('Fill Name')
      return
    } else if (!email) {
      alert('Fill email')
      return
    } else if (!phoneNumber) {
      alert('Fill Phone Number')
      return
    } else if (!status) {
      alert('Fill Status')
      return
    } else if (!balance) {
      alert('Fill Balance')
      return
    }

    UtilCtx.setLoader(true)

    try {
      await API.post(
        'main',
        `/admin/create-user/${InstitutionData.InstitutionId}`,
        {
          body: {
            emailId: email,
            userName: name,
            phoneNumber: phoneNumber,
            status: status,
            balance: balance
          }
        }
      )
      Ctx.setUserList([
        ...Ctx.userList,
        {
          emailId: email,
          userName: name,
          phoneNumber: phoneNumber,
          status: status,
          balance: balance
        }
      ])

      alert('User Added')

      setName('')
      setEmail('')
      setPhoneNumber('')
      setStatus('')
      setBalance('')

      UtilCtx.setLoader(false)
    } catch (e) {
      console.log(e)
      UtilCtx.setLoader(false)
    }
  }

  const handleToggleUserAdd = () => {
    setUserCheck((prevState) => (prevState === 1 ? 0 : 1))
    setIsUserAdd((prevState) => !prevState)
  }

  const sendReminder = async (cognitoId) => {
    UtilCtx.setLoader(true)

    const pa = 'happyprancer@ybl'
    const pn = 'happyprancer'
    const am = 10

    try {
      const res = await API.post(
        'main',
        `/user/send-email/${InstitutionData.InstitutionId}`,
        {
          body: {
            pa,
            pn,
            am,
            cognitoId
          }
        }
      )

      alert(res.message)
      UtilCtx.setLoader(false)
    } catch (e) {
      console.log(e)
      UtilCtx.setLoader(false)
    }
  }

  return (
    <div className={`w-full px-2 pb-4`}>
      <div className={`container`}>
        {/* Step 1: Update the button class */}
        <button
          className={`filter-button w-full m-[1rem] h-[2.1rem] rounded-[0.3rem] text-snow  text-white`}
          style={{
            backgroundColor:
              isUserAdd && userCheck === 1
                ? InstitutionData.PrimaryColor
                : 'black'
          }}
          onClick={handleToggleUserAdd} // Use the custom function to handle toggle
        >
          {isUserAdd && userCheck === 1 ? 'Cancel' : 'Add New User'}{' '}
          {/* Toggle button text */}
        </button>
      </div>
      {isUserAdd && userCheck === 1 && (
        <form className={`flex flex-col gap-6 w-full Sansita`}>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[0.5rem]`}
          >
            {/* Step 2: Apply the custom input field class to the input elements */}
            <input
              required
              placeholder="Name"
              className={`input-field`}
              type={'text'}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
            <input
              required
              placeholder="Email Address"
              className={`input-field`}
              type={'email'}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
            <input
              required
              className={`input-field`}
              placeholder="Phone Number"
              type={'number'}
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
              }}
            />
            <select
              className={`input-field`}
              onChange={(e) => {
                setStatus(e.target.value)
              }}
              value={status}
            >
              <option value={'Active'}>Active</option>
              <option value={'InActive'}>InActive</option>
            </select>
            <input
              required
              className={`input-field`}
              placeholder="Balance"
              type={'number'}
              value={balance}
              onChange={(e) => {
                setBalance(e.target.value)
              }}
            />
            <div className={`flex gap-3 w-full justify-center items-center`}>
              {/* Step 4: Update the button styles */}
              <button
                className={`sans-serif tracking-wider h-[2.4rem] w-[85%] rounded-lg py-2 bg-black text-white`}
                onClick={onCreateUser}
              >
                Create
              </button>
            </div>
          </div>
        </form>
      )}
      <div className={`w-full flex justify-center pr-2 mb-3`}>
        {/* Step 6: Add the search bar */}
        <div className={`relative`}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone"
            style={{
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)'
            }}
            className={`p-1 rounded-[0.3rem] w-[80vw] ml-2`}
          />

          <span
            className={`absolute right-2 top-1/2 transform -translate-y-1/2`}
          >
            {/* Custom Search Icon */}
            <img
              src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/search.png`}
              alt="Search Icon"
              className={`h-6 w-6 text-gray-500 opacity-80`}
            />
          </span>
        </div>
      </div>
      <div className={`flex`}>
        <div className={`w-[95%] flex justify-end gap-3`}>
          <label className={`font-bold" htmlFor="userStatusFilter`}>
            User Status:
          </label>
          <select
            className={`rounded-[0.51rem] mr-3 py-1 px-1 bg-snow`}
            id="userStatusFilter"
            value={userStatus}
            onChange={(e) => setUserStatus(e.target.value)}
            style={{ boxShadow: '0 0 12px rgba(0, 0, 0, 0.3)' }}
          >
            {availableStatuses.map((status) => (
              <option
                key={status}
                value={status}
                style={{ background: 'white' }}
              >
                {status === 'all' ? 'All' : status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h2
        className={`text-[1.4rem] mb-5 font-bold text-black-700 mt-10 text-center`}
      >
        Members List
      </h2>
      <div className={`grid gap-[1.5rem] md:gap-4 grid-cols-1 sm:grid-cols-2`}>
        {filteredUserList.map((user, i) => (
          <div
            key={user.cognitoId}
            className={`bg-gradient-to-r from-#1b7571  to-#1b7571 rounded-lg p-3 md:p-4 shadow-md`}
            style={{
              background: `linear-gradient(to bottom,rgb(0 255 196), rgb(26 203 164))`,
              boxShadow: '0 0px 15px rgba(0, 0, 0, 0.4)',
              borderRadius: '1.5rem'
            }}
          >
            {isUserAdd && userCheck === 2 && cognitoId === user.cognitoId && (
              <form className={`flex flex-col gap-[1rem] w-full Sansita`}>
                <input
                  required
                  placeholder="Name"
                  className={` p-[4px] pl-[1rem] rounded-[0.3rem] item-center bg-[#9dffdeba]`}
                  type={'text'}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
                <input
                  required
                  placeholder="Email Address"
                  className={` p-[4px] pl-[1rem] rounded-[0.3rem] item-center bg-[#9dffdeba]`}
                  type={'email'}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                />

                <input
                  required
                  className={` p-[4px] pl-[1rem] rounded-[0.3rem] item-center bg-[#9dffdeba]`}
                  placeholder="Phone Number"
                  type={'number'}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                  }}
                />
                <div className={`flex gap-3 w-full`}>
                  <select
                    className={` w-[42vw] p-[4px] pl-[1rem] rounded-[0.3rem] item-center bg-[#9dffdeba]`}
                    onChange={(e) => {
                      setStatus(e.target.value)
                    }}
                    value={status}
                  >
                    <option value={'Active'}>Active</option>
                    <option value={'InActive'}>InActive</option>
                  </select>
                  <input
                    required
                    className={` w-[42vw] p-[4px] pl-[1rem] rounded-[0.3rem] item-center bg-[#9dffdeba]`}
                    placeholder="Balance"
                    type={'number'}
                    value={balance}
                    onChange={(e) => {
                      setBalance(e.target.value)
                    }}
                  />
                </div>
                <button
                  className={`sans-sarif w-[87vw] tracking-wide rounded-[0.2rem] py-1 bg-black text-white`}
                  onClick={(e) => {
                    e.preventDefault()
                    sendReminder(cognitoId)
                  }}
                >
                  Send Invoice
                </button>
                <div
                  className={`flex gap-3 w-full items-center justify-center`}
                >
                  <button
                    className={`sans-sarif w-[41vw] tracking-wide rounded-[0.2rem] py-1 mb-4 bg-black text-white`}
                    onClick={() => {
                      setIsUserAdd(false)
                      setUserCheck(0)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`sans-sarif w-[41vw] tracking-wide rounded-[0.2rem] py-1 mb-4 bg-black text-white`}
                    onClick={onUpdateUser}
                  >
                    Update
                  </button>
                </div>
              </form>
            )}

            <div className={`flex items-center justify-between`}>
              <h3 className={`text-lg font-bold mb-2`}>{user.userName}</h3>
            </div>
            <div className={`mb-1`}>Email: {user.emailId}</div>
            <div>Phone: {user.phoneNumber}</div>
            <div className={`mb-1`}>Country: {user.country}</div>
            <div className={`mb-2`}>
              Joining Date: {formatDate(user.joiningDate)}
            </div>
            <div className={``}>Due:{user.balance}</div>
            <div className={``}>
              Attendance:{' '}
              {user.currentMonthZPoints ? user.currentMonthZPoints : 0}/
              {user.lastMonthZPoints ? user.lastMonthZPoints : 0}
            </div>
            <button
              className={`bg-white rounded-[0.3rem] px-3 py-1 text-black font-bold text-center mt-2 w-[87vw]`}
              onClick={() => {
                if (isViewingProfile) {
                  // View Profile logic
                  setIsUserAdd(true)
                  setCognitoId(user.cognitoId)
                  setName(user.userName)
                  setEmail(user.emailId)
                  setPhoneNumber(user.phoneNumber)
                  setStatus(user.status)
                  setBalance(user.balance)
                  setUserCheck(2)
                } else {
                  // Unview Profile logic (e.g., close the profile)
                  // Add your close profile logic here
                  setIsUserAdd(false)
                  setUserCheck(0)
                }
                toggleProfileView() // Toggle the profile view
              }}
            >
              {' '}
              {isViewingProfile ? 'View Profile' : 'Unview Profile'}
            </button>
          </div>
        ))}
      </div>
      <div
        className={`flex mb-[6rem] justify-center items-center mt-4 md:mt-6`}
      >
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(value) => setCurrentPage(value)}
        />
      </div>
    </div>
  )
}

export default UsersListMobile
