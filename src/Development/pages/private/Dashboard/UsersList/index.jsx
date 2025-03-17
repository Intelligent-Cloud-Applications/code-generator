import React, { useState } from "react";
import { useMediaQuery } from "../../../../utils/helpers";
import UsersListMobile from "./moblie";
import { useContext } from "react";
import Context from "../../../../Context/Context";
import "./index.css";
import { Pagination } from "flowbite-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye } from "react-icons/fa6";
import { Button2 } from "../../../../common/Inputs";
import InstitutionContext from "../../../../Context/InstitutionContext";
import CreateUser from "./CreateUpdateUser";
import { toast } from "react-toastify";
import { API } from "aws-amplify";
import InstructorList from "./InstructorList";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Table } from "flowbite-react";

const UsersList = ({ userCheck, setUserCheck }) => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Ctx = useContext(Context);
  const [isUserAdd, setIsUserAdd] = useState(false);
  const [showUserAdd, setShowUserAdd] = useState(false);
  const { getUserList, userAttendance } = useContext(Context);
  const [userName, setuserName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("InActive");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [productType, setProductType] = useState("Product Type");
  const [selectedProductAmount, setSelectedProductAmount] = useState("");
  const [createButton, setCreateButton] = useState("");
  const [cognitoId, setCognitoId] = useState("");
  const [name, setName] = useState("");
  const [userStatus, setUserStatus] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Members List");

  const itemsPerPage = 5;
  const isMobileScreen = useMediaQuery("(max-width: 600px)");

  // Filter functions
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

  const filter2 = filterUsersByStatus(userStatus);
  console.log("filtter2:", filter2);
  // Search functionality
  const searchedUserList = filter2?.filter((user) => {
    return (
      (typeof user?.userName === "string" &&
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user?.emailId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.phoneNumber?.includes(searchQuery)
    );
  });
  console.log("searched:", searchedUserList);
  const activeUserList = searchedUserList.filter((user) => !user.isArchived);

  // Sort functionality
  activeUserList.sort((a, b) => {
    return b.joiningDate - a.joiningDate;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredUserList = activeUserList.slice(startIndex, endIndex);

  // Delete functionality
  const handleDelete = async (institution, cognitoId) => {
    try {
      const response = await API.put("main", "/admin/delete-user", {
        body: {
          institution: institution,
          cognitoId: cognitoId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Delete response:", response); // Add this for debugging
      
      if (response) {
        toast.success("User deleted successfully!", { autoClose: 3000 });
        await getUserList(); // Refresh the user list
        return true;
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user. Please try again.", { autoClose: 3000 });
      return false;
    }
  };

  const handleCancel = () => {
    toast.dismiss();
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteUser = (institution, cognitoId) => {
    if (!institution || !cognitoId) {
      toast.error("Invalid user data for deletion");
      return;
    }
    setUserToDelete({ institution, cognitoId });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      const success = await handleDelete(userToDelete.institution, userToDelete.cognitoId);
      if (success) {
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  const formatDate = (epochDate) => {
    if (!epochDate || isNaN(new Date(epochDate))) return "NA";

    const date = new Date(epochDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Sort functionality
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

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  //for profile pic
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  const getColor = () => {
    return InstitutionData.PrimaryColor;
  };

  const mobileProps = {
    userCheck,
    setUserCheck,
    phoneNumber,
    name,
    email,
    status,
    cognitoId,
    balance,
    countryCode,
    productType,
    selectedProductAmount,
    createButton,
    showUserAdd,
    isModalOpen,
    setStatus,
    setCognitoId,
    setShowUserAdd,
    setPhoneNumber,
    setCreateButton,
    setIsModalOpen,
    setEmail,
    setCountryCode,
    setName,
    setBalance,
    setProductType,
    setSelectedProductAmount,
    userStatus,
    setUserStatus,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    filteredUserList,
    activeUserList,
    handleDeleteUser,
    formatDate,
    availableStatuses,
    itemsPerPage,
    requestSort,
    handleSelectChange,
    selectedOption,
    filter2,
    setShowDeleteModal,
    showDeleteModal,
    confirmDelete,
    confirmDelete,
  };

  return (
    <>
      {isMobileScreen ? (
        <UsersListMobile {...mobileProps} />
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
                  setCreateButton(true);
                  setuserName("");
                  setLastName("");
                  setName("");
                  setCountryCode("+91");
                  setEmail("");
                  setStatus("InActive");
                  setPhoneNumber("");
                  setBalance("");
                  setProductType("");
                  setShowUserAdd(true);
                }}
                w={"12rem"}
              />
              <select
                className="pl-5 font-sans text-[1.4rem] max536:mb-3 max536:text-[1.7rem] bg-transparent font-bold appearance-none border-none focus:border-transparent focus:ring-0 focus:outline-none"
                value={selectedOption}
                onChange={handleSelectChange}
              >
                <option value="Members List">Members List</option>
                <option value="Instructor List">Instructor List</option>
              </select>
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
                  onChange={(e) => {
                    setUserStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All" : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className={
                showUserAdd || isModalOpen ? "showBox open" : " hidden"
              }
            >
              <CreateUser
                productType={productType}
                setProductType={setProductType}
                selectedProductAmount={selectedProductAmount}
                setSelectedProductAmount={setSelectedProductAmount}
                createButton={createButton}
                setCreateButton={setCreateButton}
                phoneNumber={phoneNumber}
                cognitoId={cognitoId}
                balance={balance}
                status={status}
                email={email}
                countryCode={countryCode}
                name={name}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setPhoneNumber={setPhoneNumber}
                setBalance={setBalance}
                setStatus={setStatus}
                setEmail={setEmail}
                setCountryCode={setCountryCode}
                setName={setName}
                setShowUserAdd={setShowUserAdd}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </div>
          <div
            className={`w-[85%]  max536:bg-transparent max536:w-[100%] rounded-3xl p-2 flex flex-col items-center max1050:w-[94vw] mx-[2.5%] max1440:w-[95%]`}
          >
            <div
              className={`flex w-[94.5%] mt-4 rounded-md overflow-hidden gap-2`}

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
            {selectedOption === "Members List" ? (
              <div className="w-[94.5%] overflow-auto mt-4 pt-6">
                <Table striped>
                  <Table.Head className="font-semibold text-center">
                    <Table.HeadCell></Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Joining Date</Table.HeadCell>
                    <Table.HeadCell>Renew Date</Table.HeadCell>
                    <Table.HeadCell>Classes Attended</Table.HeadCell>
                    <Table.HeadCell>Balance</Table.HeadCell>
                    <Table.HeadCell>Action</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {filteredUserList.map((user) => {
                      if (!user.isArchived) {
                        return (
                          <Table.Row key={user.cognitoId}>
                            <Table.Cell>
                              {user.imgUrl ? (
                                <img
                                  src={user.imgUrl}
                                  alt={user.userName}
                                  className="h-10 w-10 rounded-full object-cover text-gray-700 font-semibold"
                                />
                              ) : (
                                <div
                                  className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                  style={{
                                    backgroundColor: getColor(
                                      user.userName
                                    ),
                                  }}
                                >
                                  {getInitials(user.userName)}
                                </div>
                              )}
                            </Table.Cell>
                            <Table.Cell
                              className="text-gray-700 font-semibold text-center"
                            >{user.userName}</Table.Cell>
                            <Table.Cell
                              className="text-gray-700 font-semibold text-center">
                              {formatDate(user.joiningDate)}
                            </Table.Cell>
                            <Table.Cell
                              className="text-gray-700 font-semibold text-center"
                            >
                              {formatDate(user.renewDate)}
                            </Table.Cell>
                            <Table.Cell
                              className="text-gray-700 font-semibold text-center"
                            >
                              {userAttendance[user.cognitoId] || 0}
                            </Table.Cell>
                            <Table.Cell
                              className={
                                parseFloat(user.balance) < 0
                                  ? "text-red-500 "
                                  : "text-gray-700 font-semibold text-center"
                              }
                            >
                              {user.balance}
                            </Table.Cell>
                            <Table.Cell className="flex items-center gap-3 text-gray-700 font-semibold text-center px-4 py-4">
                              <button
                                className="p-3 hover:bg-transparent rounded-md"
                                onClick={() => {
                                  setIsUserAdd(false);
                                  setIsModalOpen(true);
                                  setCognitoId(user.cognitoId);
                                  setName(user.userName);
                                  setEmail(user.emailId);
                                  setPhoneNumber(user.phoneNumber);
                                  setStatus(user.status);
                                  setBalance(user.balance);
                                }}
                              >
                                <FaEye size={15} />
                              </button>
                              <button
                                className="p-2 hover:bg-transparent rounded-md"
                                onClick={() => handleDeleteUser(user.institution, user.cognitoId)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </Table.Cell>

                          </Table.Row>
                        );
                      }
                      return null;
                    })}
                  </Table.Body>
                </Table>
                {/* Corrected Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, activeUserList.length)} of {activeUserList.length} results
                  </div>
                  <div className="flex overflow-x-auto sm:justify-end">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(activeUserList.length / itemsPerPage)}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo(0, 0);
                      }}
                      showIcons
                      layout="pagination"
                      className="text-gray-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <InstructorList />
            )}
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default UsersList;
