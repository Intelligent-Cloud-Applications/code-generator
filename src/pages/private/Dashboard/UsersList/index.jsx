import React, { useState } from 'react'
import { useMediaQuery } from "../../../../utils/helpers";
import UsersListMobile from './moblie'
import { useContext } from 'react'
import Context from '../../../../Context/Context'
import './index.css'
import {Pagination} from "flowbite-react";
import 'bootstrap/dist/css/bootstrap.min.css'
// import LeftBanner from "./LeftBanner";
import { API } from 'aws-amplify'
import { FaEye } from 'react-icons/fa6'
import Modal from './UserProfile'
import UserProfile from './UserProfile'
import {Button2} from "../../../../common/Inputs";
import InstitutionContext from '../../../../Context/InstitutionContext'
import { toast } from 'react-toastify'

const UsersList = ({ userCheck, setUserCheck }) => {
  const InstitutionData = useContext(InstitutionContext).institutionData
  const Ctx = useContext(Context)
  const [isUserAdd, setIsUserAdd] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  // eslint-disable-next-line
  // const [country, setCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus] = useState('Active')
  const [balance, setBalance] = useState('')
  const UtilCtx = useContext(Context).util
  // eslint-disable-next-line
  const [cognitoId, setCognitoId] = useState('')
  const [userStatus, setUserStatus] = useState('all')
  // eslint-disable-next-line
  // const [selectedUser, setSelectedUser] = useState(null);

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

  const isMobileScreen = useMediaQuery('(max-width: 600px)')

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
//  let totalPages = Math.ceil(Ctx.userList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [searchQuery, setSearchQuery] = useState('') // Step 1: Add state for the search query

  const formatDate = (epochDate) => {
    const date = new Date(epochDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Step 2: Implement the search functionality
  const filter2 = filterUsersByStatus(userStatus)
  const searchedUserList = filter2
    .filter((user) => {
      return (
        user?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.emailId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.phoneNumber?.includes(searchQuery)
      )
    })
  const filteredUserList = searchedUserList.slice(startIndex, endIndex)

  // const selectedUser = null;
  // eslint-disable-next-line
//  const onUpdateUser = async (e) => {
//    e.preventDefault()
//
//    if (
//      !(
//        name &&
//        email &&
//        phoneNumber &&
//        status &&
//        balance &&
//        cognitoId &&
//        country
//      )
//    ) {
//      toast.warn('Fill all Fields')
//      return
//    }
//    if (!name) {
//      toast.warn('Fill Name')
//      return
//    } else if (!email) {
//      toast.warn('Fill email')
//      return
//    } else if (!phoneNumber) {
//      toast.warn('Fill Phone Number')
//      return
//    } else if (!status) {
//      toast.warn('Fill Status')
//      return
//    } else if (!balance) {
//      toast.warn('Fill Balance')
//      return
//    } else if (!phoneNumber.startsWith('+') || phoneNumber.length < 10 || isNaN(phoneNumber)) {
//      toast.warn('Please enter valid Phone Number')
//      return
//    } else if (isNaN(balance)) {
//      toast.warn('Please enter valid balance')
//      return
//    } else if (!email.includes('@')) {
//      toast.warn('Please enter valid email')
//      return
//    }
//
//    UtilCtx.setLoader(true)
//
//    try {
//      await API.put(
//        'main',
//        `/admin/create-user`,
//        {
//          body: {
//            cognitoId: cognitoId,
//            emailId: email,
//            userName: name,
//            phoneNumber: phoneNumber,
//            status: status,
//            balance: balance
//          }
//        }
//      )
//
//      alert('User Updated')
//
//      setName('')
//      setEmail('')
//      setPhoneNumber('')
//      setStatus('')
//      setBalance('')
//
//      Ctx.onreload()
//
//      UtilCtx.setLoader(false)
//    } catch (e) {
//      console.log(e)
//      UtilCtx.setLoader(false)
//    }
//  }
  const updateUserInList = (updatedUser) => {
    // Update the user data in the userList
    const updatedList = Ctx.userList.map((user) => {
      if (user.cognitoId === updatedUser.cognitoId) {
        return updatedUser
      }
      return user
    })
    Ctx.setUserList(updatedList)
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const [modalUserData, setModalUserData] = useState()
  // Other state variables for user data like cognitoId, name, email, etc.

  const onCreateUser = async (e) => {
    e.preventDefault();
  
    if (!(name && email && phoneNumber && status && balance)) {
      toast.warn('Fill all Fields');
      return;
    }
    if (!name) {
      toast.warn('Fill Name');
      return;
    } else if (!email) {
      toast.warn('Fill email');
      return;
    } else if (!phoneNumber) {
      toast.warn('Fill Phone Number');
      return;
    } else if (!status) {
      toast.warn('Fill Status');
      return;
    } else if (!balance) {
      toast.warn('Fill Balance');
      return;
    } else if (!phoneNumber.startsWith('+') || phoneNumber.length < 10 || isNaN(phoneNumber)) {
      toast.warn('Please enter valid Phone Number');
      return;
    } else if (isNaN(balance)) {
      toast.warn('Please enter valid balance');
      return;
    } else if (!email.includes('@')) {
      toast.warn('Please enter valid email');
      return;
    }
  
    UtilCtx.setLoader(true);
  
    try {
      const response = await API.post(
        'main',
        `/admin/create-user`,
        {
          body: {
            institution: InstitutionData.InstitutionId,
            emailId: email,
            userName: name,
            name: name,
            phoneNumber: phoneNumber,
            status: status,
            balance: balance,
            userType: 'member'
          }
        }
      );
      
      console.log('User created successfully:', response);
      Ctx.setUserList([
        ...Ctx.userList,
        {
          emailId: email,
          userName: name,
          phoneNumber: phoneNumber,
          status: status,
          balance: balance
        }
      ]);
  
      toast.success('User Added');
  
      setName('');
      setEmail('');
      setPhoneNumber('');
      setStatus('');
      setBalance('');
  
      UtilCtx.setLoader(false);
    } catch (e) {
      console.error('Error creating user:', e);
      toast.error('Error creating user. Please try again later.');
      UtilCtx.setLoader(false);
    }
  };

  return (
    <>
      {isMobileScreen ? (
        <UsersListMobile userCheck={userCheck} setUserCheck={setUserCheck} />
      ) : (
        <div
          className={`w-[99%] flex flex-col items-center pt-6 max536:pt-0 gap-10`}
        >
          <div className={`w-[100%] pt-6 max536:pt-0`}>
            <div className={`flex justify-between items-start ml-[9%] mb-0`}>
              {!isUserAdd && (
                <Button2
                  data={'Add New User'}
                  fn={() => {
                    setUserCheck(1)
                    setName('')
                    setEmail('')
                    setPhoneNumber('')
                    setStatus('Active')
                    setBalance('')
                    setIsUserAdd(true)
                  }}
                  w={'12rem'}
                />
              )}
              <div className={`flex gap-3 items-center mr-[8rem] mb-0`}>
                <label className={`font-bold" htmlFor="userStatusFilter`}>
                  User Status:
                </label>
                <select
                  className={`rounded-[0.51rem] px-4 `}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor
                  }}
                  id="userStatusFilter"
                  value={userStatus}
                  onChange={(e) => setUserStatus(e.target.value)}
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All' : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {isUserAdd && userCheck === 1 && (
              <form
                className={`flex flex-wrap gap-6 items-center justify-center max1250:w-[90%] max900:w-[auto] Sansita mt-4`}
              >
                <input
                  required
                  placeholder="Name"
                  className={` sans-sarif px-4 py-1 rounded-lg w-[13rem]`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor
                  }}
                  type={'text'}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
                <input
                  required
                  placeholder="Email Address"
                  className={` sans-sarif px-4 py-1 rounded-lg w-[13rem]`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor
                  }}
                  type={'email'}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                />

                <input
                  required
                  className={` sans-sarif px-4 py-1 rounded-lg w-[13rem`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor
                  }}
                  placeholder="Phone Number"
                  type={'text'}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                  }}
                />
                <select
                  className={` sans-sarif px-4 py-1 rounded-lg w-[13rem]`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor
                  }}
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
                  className={` sans-sarif px-4 py-1 rounded-lg w-[13rem]`}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor
                  }}
                  placeholder="Balance"
                  type={'text'}
                  value={balance}
                  onChange={(e) => {
                    setBalance(e.target.value)
                  }}
                />
                <div
                  className={`flex  gap-3 w-full justify-center items-center`}
                >
                  <Button2
                    data={'Cancel'}
                    fn={() => {
                      setIsUserAdd(false)
                      setUserCheck(0)
                    }}
                    w={'5rem'}
                  />
                  <Button2 data={'Create'} fn={onCreateUser} w={'5rem'} />
                </div>
              </form>
            )}
          </div>
          <div
            className={`w-[85%]  max536:bg-transparent max536:w-[100%] rounded-3xl p-2 flex flex-col items-center max1050:w-[94vw] mx-[2.5%] max1440:w-[95%]`}
            style={{
              backgroundColor: InstitutionData.LightestPrimaryColor
            }}
          >
            <h2
              className={`pl-5 font-sans text-[1.4rem] max536:mb-3 max536:text-[1.7rem] sans-serif max536:text-[bg-primaryColor] font-bold`}
            >
              Members List
            </h2>

            {/* Step 4: Create and integrate the search bar */}
            <div
              className={`flex w-[94.5%]  rounded-md overflow-hidden gap-2`}
              style={{
                backgroundColor: InstitutionData.LightestPrimaryColor
              }}
            >
              <input
                className={`flex-1 p-2 outline-none rounded-md`}
                type="text"
                placeholder="Search members by name, email or phone no."
                value={searchQuery}
                onChange={(e) =>{setCurrentPage(1); setSearchQuery(e.target.value)}}
              />
              <Button2
                data={'Clear'}
                fn={() => {setCurrentPage(1); setSearchQuery('')}}
                w={'5rem'}
              />
            </div>

            <div className={`overflow-x-auto w-full`}>
              <ul
                className={`relative px-0 pb-[3rem] w-[95%] max-w-[1700px] mx-auto flex flex-col max536:bg-primaryColor rounded-3xl items-center justify-start pt-6 max536:gap-3 max536:h-[calc(100vh-16rem)] max536:bg-gradient-to-b max536:from-[#dad7c6] max536:to-[#fdd00891]`}
              >
                <li
                  className={`w-full flex flex-col items-center justify-center p-2 max536:pt-5 max536:rounded-2xl`}
                >
                  <div
                    className={`d-flex justify-content-between w-[98%] max1050:w-[100%] mb-3 font-bold`}
                  >
                    <div className={`w-[15%]`}>Name</div>
                    <div
                      className={`w-[13%] email-hover`}
                      onClick={() => requestSort('email')}
                      style={{ cursor: 'pointer' }}
                    >
                      Email
                    </div>
                    <div className={`w-[11%]  font-sans ml-[0.5rem] `}>
                      Phone
                    </div>
                    {/* <div className={`w-[14%]  font-sans mr-2`}>Country</div> */}
                    <div className={`w-[11%] font-sans `}>Joining Date</div>
                    <div className={`w-[14%] font-sans `}>Attendance</div>
                    <div className={`w-[8%]  font-sans absolute right-[0rem]`}>
                      Balance
                    </div>

                    <div className={`w-10  font-sans h-10`}>
                      <img
                        src={`https://institution-utils.s3.amazonaws.com/institution-common/images/UsersList/userName.png`}
                        alt=""
                        className={`min536:hidden w-full h-full`}
                      />
                    </div>
                    <img
                      src={`https://institution-utils.s3.amazonaws.com/institution-common/images/UsersList/userName.png`}
                      alt=""
                      className={`min536:hidden w-10 h-10`}
                    />
                    <img
                      src={`https://institution-utils.s3.amazonaws.com/institution-common/images/UsersList/details.png`}
                      alt=""
                      className={`min536:hidden w-10 h-10 `}
                    />
                    <img
                      src={`https://institution-utils.s3.amazonaws.com/institution-common/images/UsersList/attendance.png`}
                      alt=""
                      className={`min536:hidden w-10 h-10 `}
                    />
                    <img
                      src={`https://institution-utils.s3.amazonaws.com/institution-common/images/UsersList/due.png`}
                      alt=""
                      className={`min536:hidden w-10 h-10`}
                    />
                  </div>
                </li>
                <div className={`overflow-auto max536:w-[96%] w-full`}>
                  {filteredUserList.map((user, i) => {
                    return (
                      <li
                        key={user.cognitoId}
                        className={`w-full flex flex-col gap-[4px] items-center justify-center p-2 max536:bg-primaryColor  max536:pt-6 max536:rounded-2xl Sansita max536:text-[0.8rem]`}
                      >
                        <div className={`flex justify-between w-[100%]`}>
                          <div
                            className={`w-[18%] font-[400] mr-2 font-sans truncate`}
                          >
                            {user.userName}
                          </div>
                          <div
                            className={`w-[16%] font-[400] font-sans email-hover `}
                            onClick={() => requestSort('email')}
                            style={{ cursor: 'pointer' }}
                            title={user.emailId}
                          >
                            {user.emailId.split('@')[0]}@
                          </div>
                          <div
                            className={`w-[18%] font-[400] font-sans ml-[3.2rem]`}
                          >
                            {user.phoneNumber}
                          </div>
                          {/* <div
                            className={`w-[14%] ml-[4rem] font-[400] font-sans max536:hidden`}
                          >
                            {user.country}
                          </div> */}
                          <div className={`w-[12%] font-[400] font-sans `}>
                            {formatDate(user.joiningDate)}
                          </div>
                          <div
                            className={`w-[15%] font-[400] font-sans overflow-hidden text-center mr-2`}
                          >
                            {user.currentMonthZPoints
                              ? user.currentMonthZPoints
                              : 0}
                            /{user.lastMonthZPoints ? user.lastMonthZPoints : 0}
                          </div>
                          <div
                            className={`w-[7%] h-7 rounded px-2 text-center `}
                            style={{ color: parseFloat(user.balance) < 0 ? 'red' : 'black' }}
                          >
                            {user.balance}{' '}
                          </div>

                          <button
                            className={`pl-[0.4rem]`}
                            onClick={() => {
                              console.log(
                                'User data before opening modal:',
                                user
                              )
                              setIsUserAdd(false)
                              openModal()
                              setCognitoId(user.cognitoId)
                              setName(user.userName)
                              setEmail(user.emailId)
                              setPhoneNumber(user.phoneNumber)
                              // setCountry(user.country)
                              setStatus(user.status)
                              setBalance(user.balance)
                              setModalUserData(user)
                            }}
                          >
                            <FaEye size={20} />
                          </button>
                          <Modal
                            isOpen={isModalOpen}
                            userCheck={userCheck}
                            setUserCheck={setUserCheck}
                            user={modalUserData}
                            onClose={closeModal}
                          >
                            <UserProfile
                              isUserAdd={isUserAdd}
                              userCheck={userCheck}
                              isOpen={isModalOpen}
                              onClose={closeModal}
                              user={modalUserData}
                              updateUserInList={updateUserInList} // Pass the function
                            />
                          </Modal>
                        </div>
                      </li>
                    )
                  })}
                  <div
                    className={`absolute bottom-0 flex justify-center items-center w-full`}
                  >
                    <Pagination
                      totalPages={Math.ceil(searchedUserList.length / itemsPerPage)}
                      currentPage={currentPage}
                      onPageChange={(value) => setCurrentPage(value)}
                      style={{ margin: '0 auto' }}
                    />
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UsersList