import React, { useState } from "react";
import { useMediaQuery } from "../../../../utils/helpers";
import UsersListMobile from "./moblie";
import { useContext } from "react";
import Context from "../../../../Context/Context";
import "./index.css";
import { Pagination } from "flowbite-react";
import "bootstrap/dist/css/bootstrap.min.css";
// import LeftBanner from "./LeftBanner";
import { API } from "aws-amplify";
import { FaEye } from "react-icons/fa6";
import Modal from "./UserProfile";
import UserProfile from "./UserProfile";
import { Button2 } from "../../../../common/Inputs";
import InstitutionContext from "../../../../Context/InstitutionContext";
import { toast } from "react-toastify";
import CreateUser from "./CreateUser";

const UsersList = ({ userCheck, setUserCheck }) => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Ctx = useContext(Context);
  const [isUserAdd, setIsUserAdd] = useState(false);
  const [showUserAdd, setShowUserAdd] = useState(false);
  const [userName, setuserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("InActive");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [balance, setBalance] = useState("");

  // eslint-disable-next-line
  // const [country, setCountry] = useState('')

  const UtilCtx = useContext(Context).util;
  // eslint-disable-next-line
  const [cognitoId, setCognitoId] = useState("");
  // eslint-disable-next-line
  const [name, setName] = useState("");
  const [userStatus, setUserStatus] = useState("all");
  // eslint-disable-next-line
  // const [selectedUser, setSelectedUser] = useState(null);

  const filterUsersByStatus = (status) => {
    if (status === "all") {
      return Ctx.userList;
    }
    return Ctx.userList.filter((user) => user.status === status);
  };

  const availableStatuses = [
    "all",
    ...Array.from(new Set(Ctx.userList.map((user) => user.status))),
  ];

  const isMobileScreen = useMediaQuery("(max-width: 600px)");

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  //  let totalPages = Math.ceil(Ctx.userList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState(""); // Step 1: Add state for the search query

  const formatDate = (epochDate) => {
    const date = new Date(epochDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Step 2: Implement the search functionality
  const filter2 = filterUsersByStatus(userStatus);
  const searchedUserList = filter2.filter((user) => {
    return (
      user?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.emailId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.phoneNumber?.includes(searchQuery)
    );
  });
  const filteredUserList = searchedUserList.slice(startIndex, endIndex);

  const updateUserInList = (updatedUser) => {
    // Update the user data in the userList
    const updatedList = Ctx.userList.map((user) => {
      if (user.cognitoId === updatedUser.cognitoId) {
        return updatedUser;
      }
      return user;
    });
    Ctx.setUserList(updatedList);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [modalUserData, setModalUserData] = useState();
  // Other state variables for user data like cognitoId, name, email, etc.

  // function generateUniqueEmail(name) {
  //   const timestamp = Math.floor(Math.random() * 90000) + 10000; // Generate a 5-digit timestamp
  //   return `${name}${timestamp}@gmail.com`;
  // }

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
              <Button2
                data={"Add New User"}
                fn={() => {
                  setUserCheck(1);
                  setuserName("");
                  setLastName("");
                  setCountryCode("+91");
                  setEmail("");
                  setStatus("InActive");
                  setPhoneNumber("");
                  setBalance("");
                  setShowUserAdd(true);
                }}
                w={"12rem"}
              />

              <div className={`flex gap-3 items-center mr-[8rem] mb-0`}>
                <label className={`font-bold" htmlFor="userStatusFilter`}>
                  User Status:
                </label>
                <select
                  className={`rounded-[0.51rem] px-4 `}
                  style={{
                    backgroundColor: InstitutionData.LightestPrimaryColor,
                  }}
                  id="userStatusFilter"
                  value={userStatus}
                  onChange={(e) => setUserStatus(e.target.value)}
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All" : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={(showUserAdd || isModalOpen) ? "showBox open" : " hidden"}>
              <CreateUser
                phoneNumber={phoneNumber}
                cognitoId={cognitoId}
                balance={balance}
                status={status}
                email={email}
                countryCode={countryCode}
                userName={name}
                lastName={lastName}
                setPhoneNumber={setPhoneNumber}
                setBalance={setBalance}
                setStatus={setStatus}
                setEmail={setEmail}
                setCountryCode={setCountryCode}
                setuserName={setuserName}
                setLastName={setLastName}
                setShowUserAdd={setShowUserAdd}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </div>
          <div
            className={`w-[85%]  max536:bg-transparent max536:w-[100%] rounded-3xl p-2 flex flex-col items-center max1050:w-[94vw] mx-[2.5%] max1440:w-[95%]`}
            style={{
              backgroundColor: InstitutionData.LightestPrimaryColor,
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
                backgroundColor: InstitutionData.LightestPrimaryColor,
              }}
            >
              <input
                className={`flex-1 p-2 outline-none rounded-md`}
                type="text"
                placeholder="Search members by name, email or phone no."
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value);
                }}
              />
              <Button2
                data={"Clear"}
                fn={() => {
                  setCurrentPage(1);
                  setSearchQuery("");
                }}
                w={"5rem"}
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
                      onClick={() => requestSort("email")}
                      style={{ cursor: "pointer" }}
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
                            onClick={() => requestSort("email")}
                            style={{ cursor: "pointer" }}
                            title={user.emailId}
                          >
                            {user.emailId?.split("@")[0]}@
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
                            style={{
                              color:
                                parseFloat(user.balance) < 0 ? "red" : "black",
                            }}
                          >
                            {user.balance}{" "}
                          </div>

                          <button
                            className={`pl-[0.4rem]`}
                            onClick={() => {
                              console.log(
                                "User data before opening modal:",
                                user
                              );
                              setIsUserAdd(false);
                              openModal();
                              setCognitoId(user.cognitoId);
                              setName(user.userName);
                              setEmail(user.emailId);
                              setPhoneNumber(user.phoneNumber);
                              // setCountry(user.country)
                              setStatus(user.status);
                              setBalance(user.balance);
                              setModalUserData(user);
                            }}
                          >
                            <FaEye size={20} />
                          </button>
                          {/* <div className={isModalOpen ? "show open" : " hidden"}>
                            <CreateUser
                              phoneNumber={phoneNumber}
                              balance={balance}
                              status={status}
                              email={email}
                              countryCode={countryCode}
                              userName={name}
                              setPhoneNumber={setPhoneNumber}
                              setBalance={setBalance}
                              setStatus={setStatus}
                              setEmail={setEmail}
                              setCountryCode={setCountryCode}
                              setuserName={setuserName}
                              setShowUserAdd={setShowUserAdd}
                              setIsModalOpen={setIsModalOpen}
                            />
                          </div> */}
                        </div>
                      </li>
                    );
                  })}
                  <div
                    className={`absolute bottom-0 flex justify-center items-center w-full`}
                  >
                    <Pagination
                      totalPages={Math.ceil(
                        searchedUserList.length / itemsPerPage
                      )}
                      currentPage={currentPage}
                      onPageChange={(value) => setCurrentPage(value)}
                      style={{ margin: "0 auto" }}
                    />
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersList;