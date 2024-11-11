import React from 'react';
import { useContext } from 'react';
import Context from '../../../../Context/Context';
import { Pagination } from "flowbite-react";
import InstitutionContext from '../../../../Context/InstitutionContext';
import CreateUser from './CreateUser';
import './index.css';
import './mobile.css';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const UsersListMobile = ({
  // User data props
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

  // UI state props
  createButton,
  showUserAdd,
  isModalOpen,

  // State setters
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

  // Search and filter props
  userStatus,
  setUserStatus,
  searchQuery,
  setSearchQuery,

  // Pagination props
  currentPage,
  setCurrentPage,
  itemsPerPage,

  // Data arrays
  filteredUserList,
  activeUserList,

  // Helper functions
  handleDeleteUser,
  formatDate,
  availableStatuses,

  // Additional functionality
  showDeleteModal,
  setShowDeleteModal,
  confirmDelete,
  requestSort,
  handleSelectChange,
  selectedOption
}) => {
  const InstitutionData = useContext(InstitutionContext).institutionData;

  // Calculate pagination
  const totalPages = Math.ceil(activeUserList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = activeUserList.slice(startIndex, endIndex);

  const handleToggleUserAdd = () => {
    setUserCheck(prev => prev === 1 ? 0 : 1);
    setIsModalOpen(true);
    setCreateButton(true);
  };

  const handleUpdateProfile = (user) => {
    if (!user) return;

    setIsModalOpen(true);
    setCognitoId(user.cognitoId || '');
    setName(user.userName || '');
    setEmail(user.emailId || '');
    setPhoneNumber(user.phoneNumber || '');
    setStatus(user.status || '');
    setBalance(user.balance || '');
    setUserCheck(2);
    setCreateButton(false);
  };

  return (
    <div className="w-full px-2 pb-4">
      {/* Add New User Button */}
      <div className="container">
        <button
          className="filter-button w-full m-[1rem] h-[2.1rem] rounded-[0.3rem] text-snow text-white"
          style={{
            backgroundColor: isModalOpen && userCheck === 1 ? InstitutionData?.PrimaryColor : 'black'
          }}
          onClick={handleToggleUserAdd}
        >
          Add New User
        </button>
      </div>

      {/* CreateUser Modal */}
      {(showUserAdd || isModalOpen) && (
        <div className="showBox open">
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
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="w-full flex justify-center pr-2">
          <div className="relative w-[80vw]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone"
              className="p-2 rounded-[0.3rem] w-full shadow-md"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <img
                src="https://institution-utils.s3.amazonaws.com/institution-common/Assests/search.png"
                alt="Search"
                className="h-6 w-6 opacity-80"
              />
            </span>
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full flex justify-end px-4">
          <div className="flex items-center gap-2">
            <label className="font-bold whitespace-nowrap" htmlFor="userStatusFilter">
              User Status:
            </label>
            <select
              id="userStatusFilter"
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              className="rounded-[0.51rem] py-1 px-2 bg-white shadow-md"
            >
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <h2 className="text-[1.4rem] mb-5 font-bold text-black-700 mt-10 text-center">
        Members List
        {activeUserList.length > 0 && ` (${activeUserList.length})`}
      </h2>

      <div className="grid gap-[1.5rem] md:gap-4 grid-cols-1 sm:grid-cols-2">
        {currentUsers.map((user) => (
          <div
            key={user?.cognitoId || Math.random()}
            className="rounded-[1.5rem] p-3 md:p-4 shadow-lg relative"
            style={{
              background: 'linear-gradient(to bottom, rgb(0 255 196), rgb(26 203 164))',
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold mb-2">{user?.userName || 'N/A'}</h3>
            </div>
            <div className="space-y-1">
              <div>Email: {user?.emailId || 'N/A'}</div>
              <div>Phone: {user?.phoneNumber || 'N/A'}</div>
              <div>Country: {user?.country || 'N/A'}</div>
              <div>Joining Date: {formatDate(user?.joiningDate)}</div>
              <div>Due: {user?.balance || '0'}</div>
              <div>
                Attendance: {user?.currentMonthZPoints || 0}/{user?.lastMonthZPoints || 0}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-white rounded-[0.3rem] px-3 py-1 text-black font-bold text-center flex-1"
                onClick={() => handleUpdateProfile(user)}
              >
                Update Profile
              </button>
              <button
                className="absolute top-3 right-1 rounded-[0.3rem] px-3 py-1 font-bold"
                onClick={() => handleDeleteUser(user.institution, user.cognitoId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 md:mt-6 mb-[6rem]">
          <Pagination
            currentPage={currentPage}
            layout="pagination"
            onPageChange={setCurrentPage}
            showIcons={true}
            totalPages={totalPages}
            previousLabel="Previous"
            nextLabel="Next"
          />
        </div>
      )}
    </div>
  );
};

export default UsersListMobile;