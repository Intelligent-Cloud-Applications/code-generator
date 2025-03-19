import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import {
  X,
  Upload,
  User,
  Mail,
  Phone,
  Check,
  CreditCard,
  Calendar,
} from "lucide-react";
import Country from "../../../../components_old/Country";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Context from "../../../../Context/Context";
import { toast } from "react-toastify";
import InputComponent from "../../../../common/InputComponent";
import { API } from "aws-amplify";
import fileUpload from "../../../../common/utils/upload-file.js";
import institutionData from "../../../../constants.js";

function CreateUser({
  phoneNumber,
  amount,
  name,
  imageUrl,
  email,
  status,
  cognitoId,
  setStatus,
  balance,
  setImageUrl,
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
  const [selectedProduct, setSelectedProduct] = useState({});
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [phoneChange, setPhoneChange] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const classTypeOptions = InstitutionData.ClassTypes.map((classType) => ({
    value: classType,
    label: classType,
  }));

  const handleClassTypeChange = (selectedOptions) => {
    setSelectedClassTypes(selectedOptions || []);
    setTouched({ ...touched, classTypes: true });
  };

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
    setSelectedProduct(selectedProduct);
    setTouched({ ...touched, productType: true });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
      if (file.size > maxSize) {
        toast.error(
          "File size exceeds the 5 MB limit. Please upload a smaller file."
        );
      } else {
        setImageUrl(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      toast.warning("No file selected.");
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Basic field validations
    if (!name || name.trim() === "") {
      newErrors.name = "Full name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email || email.trim() === "") {
      newErrors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phoneNumber || phoneNumber.trim() === "") {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(phoneNumber.replace(countryCode, ""))) {
      newErrors.phoneNumber = "Phone number should contain only digits";
    }

    // Status specific validations
    if (status === "Trial" && !trialPeriod) {
      newErrors.trialPeriod = "Trial period is required";
    }

    // User type specific validations
    if (userType === "instructor") {
      if (instructorPaymentType && !instructorPaymentAmount) {
        newErrors.instructorPaymentAmount = "Payment amount is required";
      } else if (
        instructorPaymentType === "percent" &&
        (parseFloat(instructorPaymentAmount) <= 0 ||
          parseFloat(instructorPaymentAmount) > 100)
      ) {
        newErrors.instructorPaymentAmount =
          "Percentage must be between 0 and 100";
      } else if (
        instructorPaymentType === "flat" &&
        parseFloat(instructorPaymentAmount) < 0
      ) {
        newErrors.instructorPaymentAmount = "Amount cannot be negative";
      }

      if (selectedClassTypes.length === 0) {
        newErrors.classTypes = "At least one class type is required";
      }
    }

    // Product validations for active members
    if (status === "Active" && userType === "member" && !productType) {
      newErrors.productType = "Product type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const onCreateUser = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show all validation errors
    const allFields = {
      name: true,
      email: true,
      phoneNumber: true,
      trialPeriod: true,
      instructorPaymentType: true,
      instructorPaymentAmount: true,
      classTypes: true,
      productType: true,
    };
    setTouched(allFields);

    // Validate form
    const isValid = validateForm();

    if (!isValid) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.error("Please fix the errors before submitting");
      return;
    }

    UtilCtx.setLoader(true);
    let apiResponse; // Declare apiResponse here
    const formattedPhoneNumber = createButton
      ? `${countryCode}${phoneNumber}`
      : phoneChange
      ? `${countryCode}${phoneNumber}`
      : phoneNumber;

    let imgUrl = imageUrl
      ? await fileUpload({
          bucket: "institution-utils",
          region: "us-east-1",
          folder: `profile/${email}`,
          file: imageUrl,
        })
      : null;
    const data = {
      institution: InstitutionData.InstitutionId,
      cognitoId,
      emailId: email,
      userName: name,
      name: name,
      imgUrl: imgUrl,
      phoneNumber: formattedPhoneNumber,
      status,
      productType: userType === "member" ? productType : "",
      amount: selectedProductAmount,
      userType,
      instructorPaymentType:
        userType === "instructor" ? instructorPaymentType : "",
      instructorPaymentAmount:
        userType === "instructor" ? instructorPaymentAmount : "",
      trialPeriod: status === "Trial" ? trialPeriod : "",
      classType:
        userType === "instructor"
          ? selectedClassTypes.map((type) => type.value)
          : [],
      product: selectedProduct.heading,
    };
    try {
      if (createButton) {
        apiResponse = await API.post("main", `/admin/create-user`, {
          body: data,
        });
      } else {
        apiResponse = await API.put(
          "main",
          `/admin/update-user/${InstitutionData.InstitutionId}`,
          { body: data }
        );
      }
      data.userType === "instructor" &&
        window.localStorage.removeItem(
          `instructorList_${InstitutionData.InstitutionId}`
        );
      createButton
        ? toast.success("User Created Successfully")
        : toast.success("User Updated Successfully");

      setName("");
      setCountryCode("+91");
      setEmail("");
      setStatus("InActive");
      setPhoneNumber("");
      setBalance("");
      setImageUrl(null);
      setPreviewImage(null);
      setProductType("");
      setSelectedProductAmount("");
      setInstructorPaymentType("");
      setInstructorPaymentAmount("");
      setTrialPeriod("");
      setSelectedClassTypes([]);
      setSelectedProduct({});
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Error creating/updating user:", error);
      const errorMessage = error.response?.data?.message;

      if (
        error.response?.data?.message ===
        "Email already exists in the database."
      ) {
        toast.error("This email is already registered in the system");
      } else if (error.response?.data?.message?.includes("phone number")) {
        toast.error("This phone number is already registered");
      } else if (error.response?.status === 400) {
        toast.error(errorMessage || "Invalid input. Please check all fields");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error(
          errorMessage || "Error processing request. Please try again"
        );
      }
      // No return here, as we want to attempt payment update regardless of user creation/update success
    } finally {
      setShowUserAdd(false);
      setIsModalOpen(false);
      UtilCtx.setLoader(false);
    }

    // Payment Update Logic (Moved outside try...catch for user creation/update)
    if (
      status === "Active" &&
      userType === "member" &&
      paymentDate &&
      selectedProduct?.productId
    ) {
      let cognitoIdForPayment = cognitoId; // Default to existing cognitoId
      if (
        createButton &&
        apiResponse &&
        apiResponse.user &&
        apiResponse.user.cognitoId
      ) {
        cognitoIdForPayment = apiResponse.user.cognitoId; // Use from the response if available and it's a create operation
      }
      const paymentData = {
        cognitoId: cognitoIdForPayment, // Use cognitoId from response after create
        institution: InstitutionData.InstitutionId,
        productType: productType,
        productId: selectedProduct.productId,
        planId: selectedProduct.planId,
        amount: selectedProduct.amount / 100,
        paymentDate: conversion(paymentDate), // Ensure paymentDate is in correct format
        status: status,
        paymentStatus: paymentStatus,
        currency: "INR",
        subscriptionType: selectedProduct.subscriptionType,
      };

      console.log("Payment Data being sent:", paymentData); // Debugging: Log payment data
      try {
        await API.post(
          "main",
          `/admin/user-payment-update/${InstitutionData.InstitutionId}`,
          { body: paymentData }
        );
        toast.success("Payment updated successfully");
      } catch (paymentError) {
        console.error("Error updating payment:", paymentError);
        toast.error("Failed to update payment");
      }
      getUserList();
    } else {
      console.log("Payment update skipped due to conditions not met."); // Debugging
      console.log(
        "Status:",
        status,
        "UserType:",
        userType,
        "paymentDate:",
        paymentDate,
        "selectedProduct?.productId:",
        selectedProduct?.productId
      );
    }
  };

  // Input field styles
  const inputStyle =
    "border-[1px] border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-opacity-50";
  const inputLabelStyle = "font-medium mb-1 text-gray-700";
  const errorStyle = "text-red-500 text-xs mt-1";
  const sectionStyle = "border border-gray-100 rounded-lg p-4 bg-gray-50";

  return (
    <div className="flex justify-center items-center">
      <div
        className="bg-white px-6 py-8 rounded-xl flex flex-col justify-start items-center gap-6 w-full max-w-[800px] mx-auto relative overflow-y-auto max-h-[85vh] shadow-lg"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <div
          className="absolute top-5 right-5 cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => {
            setShowUserAdd(false);
            setIsModalOpen(false);
            setCreateButton(false);
          }}
        >
          <X size={20} />
        </div>

        <div className="w-full flex flex-col items-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: InstitutionData.PrimaryColor }}
          >
            {createButton ? "Create New User" : "Update User"}
          </h2>
          <div
            className="h-1 w-20 rounded-full"
            style={{ backgroundColor: InstitutionData.PrimaryColor }}
          ></div>
        </div>

        <div className="w-full p-0 flex flex-col gap-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div
              className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center mb-2 overflow-hidden"
              style={{ borderColor: InstitutionData.PrimaryColor }}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} color={InstitutionData.PrimaryColor} />
              )}
            </div>
            <label
              className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-md text-sm"
              style={{
                backgroundColor: `${InstitutionData.PrimaryColor}15`,
                color: InstitutionData.PrimaryColor,
              }}
            >
              <Upload size={14} />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <span className="text-xs text-gray-500 mt-1">
              Maximum size: 5MB
            </span>
          </div>

          {/* Basic Info Section */}
          <div className={sectionStyle}>
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3 font-medium">
              Basic Information
            </h3>

            <div className="flex gap-4 mb-4 max850:flex-col">
              <div className="flex-1">
                <label className={inputLabelStyle}>
                  <User size={14} className="inline mr-1" />
                  Full Name*
                </label>
                <input
                  className={`${inputStyle} ${
                    touched.name && errors.name ? "border-red-500" : ""
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Enter full name"
                  required
                />
                {touched.name && errors.name && (
                  <p className={`${errorStyle} error-message`}>{errors.name}</p>
                )}
              </div>
              <div className="flex-1">
                <label className={inputLabelStyle}>
                  <Mail size={14} className="inline mr-1" />
                  Email Address*
                </label>
                <input
                  className={`${inputStyle} ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter email address"
                  type="email"
                  required
                />
                {touched.email && errors.email && (
                  <p className={`${errorStyle} error-message`}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <div className="w-1/3">
                <label className={inputLabelStyle}>Country Code*</label>
                <select
                  value={countryCode}
                  name="countryCode"
                  className={inputStyle}
                  onChange={(e) => setCountryCode(e.target.value.toString())}
                >
                  {<Country />}
                </select>
              </div>
              <div className="w-2/3">
                <label className={inputLabelStyle}>
                  <Phone size={14} className="inline mr-1" />
                  Phone Number*
                </label>
                <input
                  className={`${inputStyle} ${
                    touched.phoneNumber && errors.phoneNumber
                      ? "border-red-500"
                      : ""
                  }`}
                  value={phoneNumber.replace(countryCode, "")}
                  onChange={(e) => {
                    setPhoneChange(true);
                    setPhoneNumber(e.target.value);
                  }}
                  onBlur={() => handleBlur("phoneNumber")}
                  placeholder="Enter phone number"
                  required
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <p className={`${errorStyle} error-message`}>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* User Type Section */}
          <div className={sectionStyle}>
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3 font-medium">
              User Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={inputLabelStyle}>User Type*</label>
                <select
                  className={inputStyle}
                  value={userType}
                  onChange={(e) => {
                    setUserType(e.target.value);
                    // Clear related fields when changing user type
                    if (e.target.value !== "instructor") {
                      setInstructorPaymentType("");
                      setInstructorPaymentAmount("");
                      setSelectedClassTypes([]);
                    }
                  }}
                >
                  <option value="member">Member</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {userType === "member" && (
                <div>
                  <label className={inputLabelStyle}>User Status*</label>
                  <select
                    required
                    className={inputStyle}
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      // Clear trial period if status is not Trial
                      if (e.target.value !== "Trial") {
                        setTrialPeriod("");
                      }
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                    <option value="Trial">Trial</option>
                  </select>
                </div>
              )}
            </div>

            {status === "Trial" && (
              <div className="mb-4">
                <label className={inputLabelStyle}>Trial Period*</label>
                <select
                  required
                  className={`${inputStyle} ${
                    touched.trialPeriod && errors.trialPeriod
                      ? "border-red-500"
                      : ""
                  }`}
                  value={trialPeriod}
                  onChange={(e) => setTrialPeriod(e.target.value)}
                  onBlur={() => handleBlur("trialPeriod")}
                >
                  <option value="">Select Trial Period</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-yearly">Half-yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                {touched.trialPeriod && errors.trialPeriod && (
                  <p className={`${errorStyle} error-message`}>
                    {errors.trialPeriod}
                  </p>
                )}
              </div>
            )}

            {/* Instructor Specific Fields */}
            {userType === "instructor" && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Instructor Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={inputLabelStyle}>Payment Type</label>
                    <select
                      className={inputStyle}
                      value={instructorPaymentType}
                      onChange={(e) => {
                        setInstructorPaymentType(e.target.value);
                        setTouched({ ...touched, instructorPaymentType: true });
                        // Clear amount when changing payment type
                        setInstructorPaymentAmount("");
                      }}
                      onBlur={() => handleBlur("instructorPaymentType")}
                    >
                      <option value="">Select Payment Type</option>
                      <option value="percent">Percentage</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className={inputLabelStyle}>
                      Bonus Amount
                      {instructorPaymentType === "percent" && " (%)"}
                    </label>
                    <input
                      type="number"
                      className={`${inputStyle} ${
                        touched.instructorPaymentAmount &&
                        errors.instructorPaymentAmount
                          ? "border-red-500"
                          : ""
                      }`}
                      value={instructorPaymentAmount}
                      onChange={(e) =>
                        setInstructorPaymentAmount(e.target.value)
                      }
                      onBlur={() => handleBlur("instructorPaymentAmount")}
                      placeholder={
                        instructorPaymentType === "percent"
                          ? "Enter percentage"
                          : "Enter amount"
                      }
                    />
                    {touched.instructorPaymentAmount &&
                      errors.instructorPaymentAmount && (
                        <p className={`${errorStyle} error-message`}>
                          {errors.instructorPaymentAmount}
                        </p>
                      )}
                  </div>
                </div>

                <div className="mb-2">
                  <label className={inputLabelStyle}>Class Types</label>
                  <Select
                    isMulti
                    options={classTypeOptions}
                    value={selectedClassTypes}
                    onChange={handleClassTypeChange}
                    placeholder="Select Class Type(s)"
                    className={`mt-1 ${
                      touched.classTypes && errors.classTypes
                        ? "select-error"
                        : ""
                    }`}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor:
                          touched.classTypes && errors.classTypes
                            ? "#ef4444"
                            : "#e2e8f0",
                        "&:hover": {
                          borderColor:
                            touched.classTypes && errors.classTypes
                              ? "#ef4444"
                              : InstitutionData.PrimaryColor,
                        },
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: `${InstitutionData.PrimaryColor}20`,
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: InstitutionData.PrimaryColor,
                      }),
                    }}
                  />
                  {touched.classTypes && errors.classTypes && (
                    <p className={`${errorStyle} error-message`}>
                      {errors.classTypes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Member Product Selection */}
            {status === "Active" && userType !== "instructor" && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Product & Payment Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className={`${inputLabelStyle} flex items-center gap-1`}
                    >
                      <CreditCard size={14} />
                      Product Type*
                    </label>
                    <select
                      required
                      className={`${inputStyle} ${
                        touched.productType && errors.productType
                          ? "border-red-500"
                          : ""
                      }`}
                      value={productType}
                      onChange={handleProductTypeChange}
                      onBlur={() => handleBlur("productType")}
                    >
                      <option value="">Select Product</option>
                      {productDetails.map((product) => (
                        <option key={product.heading} value={product.heading}>
                          {product.heading}
                        </option>
                      ))}
                    </select>
                    {touched.productType && errors.productType && (
                      <p className={`${errorStyle} error-message`}>
                        {errors.productType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={inputLabelStyle}>Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        ₹
                      </span>
                      <input
                        className={`${inputStyle} pl-6`}
                        value={
                          selectedProductAmount
                            ? (selectedProductAmount / 100).toFixed(2)
                            : ""
                        }
                        readOnly
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label
                      className={`${inputLabelStyle} flex items-center gap-1`}
                    >
                      <Calendar size={14} />
                      Payment Date
                    </label>
                    <input
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      type="date"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      className={`${inputLabelStyle} flex items-center gap-1`}
                    >
                      <Check size={14} />
                      Payment Status
                    </label>
                    <select
                      required
                      className={inputStyle}
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="paid">Paid</option>
                      <option value="unPaid">Unpaid</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-2">
            <button
              className="px-8 py-3 rounded-lg text-white font-medium flex flex-row gap-2 justify-center items-center w-full sm:w-[250px] transition-all hover:shadow-lg"
              style={{
                backgroundColor: InstitutionData.PrimaryColor,
                boxShadow: `0 4px 6px ${InstitutionData.PrimaryColor}30`,
              }}
              onClick={onCreateUser}
            >
              {createButton ? "Create User" : "Update User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;
