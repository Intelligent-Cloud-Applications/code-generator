import React, { useContext, useEffect, useState } from 'react';
import { X } from "lucide-react";
import Country from "../../../../components_old/Country";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Context from '../../../../Context/Context';
import InputComponent from '../../../../common/InputComponent';
import { API } from 'aws-amplify';

function CreateUser({
  phoneNumber, lastName, firstName, countryCode, email, balance, setShowUserAdd,
  setPhoneNumber, setEmail, setCountryCode, setLastName, setFirstName, setBalance
}) {
  const [userType, setUserType] = useState('member')
  const [instructorPaymentType, setInstructorPaymentType] = useState('');
  const [instructorPaymentAmount, setInstructorPaymentAmount] = useState('');
  const [status, setStatus] = useState("InActive");
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Ctx = useContext(Context);

  // State for product type and amount
  const [productType, setProductType] = useState('Product Type');
  const [selectedProductAmount, setSelectedProductAmount] = useState('');

  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await API.get(
          'main',
          `/any/products/${InstitutionData.InstitutionId}`
        );
        setProductDetails(productList);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProducts();
  }, [InstitutionData.InstitutionId]);
  const handleProductTypeChange = (e) => {
    const selectedProduct = productDetails.find(product => product.heading === e.target.value);
    setProductType(e.target.value);
    setSelectedProductAmount(selectedProduct ? selectedProduct.amount : '');
  };

  const onCreateUser = async (e) => {
    e.preventDefault();
    setShowUserAdd(false);
    let generatedEmail;
    let fullName = firstName + " " + lastName;
    let fullPhoneNumber = countryCode + phoneNumber;
    if (!(fullName && fullPhoneNumber && status && balance)) {
      toast.warn("Fill all Fields");
      return;
    }
    if (!firstName) {
      toast.warn("Fill first name");
      return;
    } else if (!lastName) {
      toast.warn("Fill last name");
      return;
    } else if (!email) {
      generatedEmail = generateUniqueEmail(firstName);
    } else if (!phoneNumber) {
      toast.warn("Fill Phone Number");
      return;
    } else if (!status) {
      toast.warn("Fill Status");
      return;
    } else if (!balance) {
      toast.warn("Fill Balance");
      return;
    } else if (
      phoneNumber.length > 15 ||
      phoneNumber.length < 10 ||
      isNaN(phoneNumber)
    ) {
      toast.warn("Please enter valid Phone Number");
      return;
    } else if (isNaN(balance)) {
      toast.warn("Please enter valid balance");
      return;
    }
    UtilCtx.setLoader(true);
    console.log(email);

    try {
      const response = await API.post("main", `/admin/create-user`, {
        body: {
          institution: InstitutionData.InstitutionId,
          emailId: email,
          userName: fullName,
          name: fullName,
          phoneNumber: fullPhoneNumber,
          status: status,
          balance: balance,
          userType: "member",
        },
      });

      console.log("User created successfully:", response);
      Ctx.setUserList([
        {
          emailId: email,
          userName: fullName,
          phoneNumber: fullPhoneNumber,
          status: status,
          balance: balance,
          joiningDate: conversion(new Date().toISOString()?.split("T")[0]),
        },
        ...Ctx.userList,
      ]);

      toast.success("User Added");

      // Reset form fields
      setFirstName("");
      setLastName("");
      setCountryCode("+91");
      setEmail("");
      setStatus("Active");
      setPhoneNumber("");
      setBalance("");
      setProductType('');
      setSelectedProductAmount('');

      UtilCtx.setLoader(false);
    } catch (e) {
      console.error("Error creating user:", e);
      toast.error("Error creating user. Please try again later.");
      UtilCtx.setLoader(false);
    }
  };

  return (
    <div>
      <div className=" w-[30vw] bg-white px-1 py-4 rounded-md flex flex-col justify-center items-center gap-4 max800:w-[90vw] relative">

        <span
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowUserAdd(false)}
        >
          <X size={25} />
        </span>

        <div className="w-[80%] flex flex-col gap-4 mt-6">
          <div className="flex gap-1">
            <InputComponent
              width={100}
              label="Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputComponent
              width={100}
              label="Email (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex gap-1">
            <InputComponent
              width={100}
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-center items-center gap-2">
            <div className='flex w-[80%] flex-col'>
              <label className='font-[500] ml-1'>User Status</label>
              <select
                required
                className={` border-[1px] px-[1.5rem] py-[0.7rem] rounded-2 `}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div>
            <div className='flex w-[80%] flex-col'>
              <label className='font-[500] ml-1'>User Type</label>
              <select
                className={`w-full border-[1px] px-[1.5rem] py-[0.7rem] rounded`}
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
              >
                <option value='member'>Member</option>
                <option value='instructor'>Instructor</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conditionally render product type and amount fields */}
        {status === "Active" && (
          <div className='w-[80%]'>
            <div className="w-full flex justify-center items-center gap-2">
              <div className="w-full flex flex-col -mt-3 mb-3">
                <label className='font-[500] ml-1'>Select Product Type</label>
                <select
                  required
                  className={`w-full border-[1px] px-[1.5rem] py-[0.7rem] rounded-2 `}
                  value={productType}
                  onChange={handleProductTypeChange}
                >
                  {productDetails.map((product) => (
                    <option key={product.heading} value={product.heading}>
                      {product.heading}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2 mb-2">
                <InputComponent
                  width={100}
                  label="Amount"
                  value={selectedProductAmount}
                  readOnly
                />
              </div>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className='flex w-full flex-col'>
                <label className='font-[500] ml-1'>Payment Date</label>
                <input type="date" className='py-[0.7rem] rounded' />
              </div>
              <div className="flex flex-col w-full">
                <label className='font-[500] ml-1'>Payment Status</label>
                <select
                  required
                  className={`border-[1px] px-[1.5rem] py-[0.7rem] rounded`}
                  value={productType}
                  onChange={handleProductTypeChange}
                >
                  <option value="paid">Paid</option>
                  <option value="unPaid">UnPaid</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {userType === 'instructor' && (
          <div className="flex flex-col gap-4 w-[80%]">
            <div className="flex flex-row w-full gap-2 max560:flex-col max560:gap-8">
              <div className="flex flex-col justify-center w-full">
                <label className='font-[500] ml-1'>Instructor Payment Type</label>
                <select
                  className={`border-[1px] px-[1.5rem] py-[0.7rem] rounded`}
                  value={instructorPaymentType}
                  onChange={(e) => {
                    setInstructorPaymentType(e.target.value);
                  }}
                >
                  <option value="">Select Payment Type</option>
                  <option value="percent">Percent</option>
                  <option value="flat">Flat</option>
                </select>
              </div>

              <div className="mt-[1.6rem]">
                <InputComponent
                  width={100}
                  type='number'
                  label="Bonus Amount"
                  value={instructorPaymentAmount}
                  onChange={(e) => {
                    setInstructorPaymentAmount(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <button
          className="px-12 py-2 rounded-md text-white font-medium flex flex-row gap-2 justify-center items-center"
          style={{ backgroundColor: InstitutionData.PrimaryColor }}
          onClick={onCreateUser}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateUser;