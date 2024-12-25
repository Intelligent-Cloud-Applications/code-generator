import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { X } from "lucide-react";
import Country from "../../../../components_old/Country";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Context from "../../../../Context/Context";
import { toast } from "react-toastify";
import InputComponent from "../../../../common/InputComponent";
import { API } from "aws-amplify";

function CreateUser({
  phoneNumber,
  name,
  email,
  status,
  cognitoId,
  setStatus,
  balance,
  setShowUserAdd,
  setPhoneNumber,
  createButton,
  setCreateButton,
  setIsModalOpen,
  setEmail,
  countryCode,
  setCountryCode,
  setName,
  setBalance,
  productType,
  setProductType,
  selectedProductAmount,
  setSelectedProductAmount,
}) {
  const [userType, setUserType] = useState("member");
  const [instructorPaymentType, setInstructorPaymentType] = useState("");
  const [instructorPaymentAmount, setInstructorPaymentAmount] = useState("");
  const [trialPeriod, setTrialPeriod] = useState("");
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Ctx = useContext(Context);
  const { getUserList } = useContext(Context);
  const UtilCtx = useContext(Context).util;
  const [selectedClassTypes, setSelectedClassTypes] = useState([]);

  const classTypeOptions = InstitutionData.ClassTypes.map((classType) => ({
    value: classType,
    label: classType,
  }));

  const handleClassTypeChange = (selectedOptions) => {
    setSelectedClassTypes(selectedOptions || []);
  };

  // State for product type and amount

  const [productDetails, setProductDetails] = useState([]);

  const conversion = (localTime) => {
    return new Date(localTime).getTime();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await API.get(
          "main",
          `/any/products/${InstitutionData.InstitutionId}`
        );
        setProductDetails(productList);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProducts();
  }, [InstitutionData.InstitutionId]);
  const handleProductTypeChange = (e) => {
    const selectedProduct = productDetails.find(
      (product) => product.heading === e.target.value
    );
    setProductType(e.target.value);
    setSelectedProductAmount(selectedProduct ? selectedProduct.amount : "");
  };

  console.log(countryCode);

  const onCreateUser = async (e) => {
    e.preventDefault();
    UtilCtx.setLoader(true);
    const formattedPhoneNumber = createButton ? `${countryCode}${phoneNumber}` : phoneNumber;

    const data = {
      institution: InstitutionData.InstitutionId, // Add institution to the body
      cognitoId, // required for both create and update
      emailId: email,
      userName:name,
      name: name,
      phoneNumber: formattedPhoneNumber,
      status,
      productType,
      amount: selectedProductAmount,
      userType,
      instructorPaymentType: userType === "instructor" ? instructorPaymentType : "",
      instructorPaymentAmount: userType === "instructor" ? instructorPaymentAmount : "",
      trialPeriod: status === "Trial" ? trialPeriod : "",
      classType: userType === "instructor" ? selectedClassTypes.map((type) => type.value) : [], // Add classType for instructor
    };

    try {
      if (createButton) {
        // Creating a new user
        const response = await API.post("main", `/admin/create-user`, { body: data });
        const createdCognitoId = response.user.cognitoId;

        if (userType === "instructor") {
          // Member to instructor API
          await API.put("main", "/admin/member-to-instructor", { body: data });
        }

        toast.success("User Created Successfully");
      } else {
        // Updating an existing user
        await API.put("main", `/admin/update-user/${InstitutionData.InstitutionId}`, { body: data });
        toast.success("User Updated Successfully");
      }

      getUserList();

      // Reset form fields after success
      setName("");
      setCountryCode("+91");
      setEmail("");
      setStatus("InActive");
      setPhoneNumber("");
      setBalance("");
      setProductType("");
      setSelectedProductAmount("");

    } catch (error) {
      console.error("Error creating/updating user:", error);
      toast.error("Error processing request. Please try again later.");
    } finally {
      setShowUserAdd(false);
      setIsModalOpen(false);
      UtilCtx.setLoader(false);
    }
  };


  return (
    <div>
      <div className=" w-[35rem] bg-white px-1 py-4 rounded-md flex flex-col justify-center items-center gap-4 max800:w-[90vw] relative">
        <span
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => {
            setShowUserAdd(false);
            setIsModalOpen(false);
            setCreateButton(false);
          }}
        >
          <X size={25} />
        </span>

        <div className="w-[80%] flex flex-col gap-4 mt-6">
          <div className="flex gap-1 max850:flex-col max850:space-y-4">
            <InputComponent
              width={100}
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputComponent
              width={100}
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex gap-1">
            <select
              value={countryCode}
              name="countryCode"
              className={`border-[1px] px-[1.5rem] py-2 rounded-2 w-1/2 border-gray-300`}
              onChange={(e) => {
                setCountryCode(e.target.value.toString())
              }}
              style={{ maxHeight: '100px' }}
            >
              {<Country />}
            </select>
            <InputComponent
              width={100}
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-row-reverse justify-center items-center gap-2">
            {userType === 'member' && (
              <div className='flex w-[80%] flex-col'>
                <label className='font-[500] ml-1'>User Status</label>
                <select
                  required
                  className={` border-[1px] px-[1.5rem] py-[0.7rem] rounded-2 focus:ring-transparent`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                </select>
              </div>
            )}
            <div className={`flex flex-col ${userType !== 'member' ? 'w-full' : 'w-[80%]'}`}>
              <label className='font-[500] ml-1'>User Type</label>
              <select
                className={`w-full border-[1px] px-[1.5rem] py-[0.7rem] rounded`}
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
              >
                <option value="Trial">Trial</option>
                <option value="member">Member</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conditionally render trial period dropdown */}
        {status === "Trial" && (
          <div className="w-full flex flex-row justify-center items-center gap-2">
            <div className="flex w-full flex-col px-14">
              <label className="font-[500] ml-1">Trial Period</label>
              <select
                required
                className="border-[1px] px-4 py-[0.7rem] rounded w-full"
                value={trialPeriod}
                onChange={(e) => setTrialPeriod(e.target.value)}
              >
                <option value="">Select Trial Period</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-yearly">Half-yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
        )}

        {/* Conditionally render product type and amount fields */}
        {status === "Active" && userType !== "instructor" && (
          <div className="w-[80%]">
            <div className="w-full flex justify-center items-center gap-2">
              <div className="w-full flex flex-col -mt-3 mb-3">
                <label className="font-[500] ml-1">Select Product Type</label>
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
              <div className="flex w-full flex-col">
                <label className="font-[500] ml-1">Payment Date</label>
                <input type="date" className="py-[0.7rem] rounded" />
              </div>
              <div className="flex flex-col w-full">
                <label className="font-[500] ml-1">Payment Status</label>
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

        {/* Conditionally render instructor-specific fields */}
        {userType === "instructor" && (
          <div className="flex flex-col gap-4 w-[80%]">
            <div className="flex flex-row w-full gap-2 max560:flex-col max560:gap-8">
              <div className="flex flex-col justify-center w-full">
                <label className="font-[500] ml-1">Instructor Payment Type</label>
                <select
                  className="border-[1px] px-[1.5rem] py-[0.7rem] rounded"
                  value={instructorPaymentType}
                  onChange={(e) => setInstructorPaymentType(e.target.value)}
                >
                  <option value="">Select Payment Type</option>
                  <option value="percent">Percent</option>
                  <option value="flat">Flat</option>
                </select>
              </div>
              <div className="mt-[1.6rem]">
                <InputComponent
                  width={100}
                  type="number"
                  label="Bonus Amount"
                  value={instructorPaymentAmount}
                  onChange={(e) => setInstructorPaymentAmount(e.target.value)}
                />
              </div>
            </div>
            {/* Multi-select for class types */}
            <div className="flex flex-col">
              <label className="font-[500] ml-1">Select Class Types</label>
              <Select
                isMulti
                options={classTypeOptions}
                value={selectedClassTypes}
                onChange={handleClassTypeChange}
                placeholder="Select Class Type(s)"
                className="mt-1"
              />
            </div>
          </div>
        )}


        <button
          className="px-12 py-2 rounded-md text-white font-medium flex flex-row gap-2 justify-center items-center max850:w-[82%]"
          style={{ backgroundColor: InstitutionData.PrimaryColor }}
          onClick={onCreateUser}
        >
          {createButton ? "Create" : "Update"}
        </button>
      </div>
    </div>
  );
}

export default CreateUser;
