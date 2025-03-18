import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { X } from "lucide-react";
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

  const classTypeOptions = InstitutionData.ClassTypes.map((classType) => ({
    value: classType,
    label: classType,
  }));

  const handleClassTypeChange = (selectedOptions) => {
    setSelectedClassTypes(selectedOptions || []);
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
  };

  const onCreateUser = async (e) => {
    e.preventDefault();
    UtilCtx.setLoader(true);
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
      createButton
        ? await API.post("main", `/admin/create-user`, { body: data })
        : await API.put(
            "main",
            `/admin/update-user/${institutionData.InstitutionId}`,
            { body: data }
          );
      data.userType === "instructor" &&
        window.localStorage.removeItem(
          `instructorList_${InstitutionData.InstitutionId}`
        );
      createButton
        ? toast.success("User Created Successfully")
        : toast.success("User Updated Successfully");
      getUserList();

      setName("");
      setCountryCode("+91");
      setEmail("");
      setStatus("InActive");
      setPhoneNumber("");
      setBalance("");
      setImageUrl(null);
      setProductType("");
      setSelectedProductAmount("");
      setInstructorPaymentType("");
      setInstructorPaymentAmount("");
      setTrialPeriod("");
      setSelectedClassTypes([]);
      setSelectedProduct({});
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
    } finally {
      setShowUserAdd(false);
      setIsModalOpen(false);
      UtilCtx.setLoader(false);
    }
  };

  return (
    <div>
      <div
        className="bg-white px-4 py-4 rounded-lg flex flex-col justify-start items-center gap-4 w-full max-w-[800px] mx-auto relative overflow-y-auto max-h-[85vh] sm:px-6 sm:py-8"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
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

        <div className="w-[80%] p-0 flex flex-col gap-4 mt-6">
          <InputComponent
            width={100}
            label="Upload Image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
                if (file.size > maxSize) {
                  alert(
                    "File size exceeds the 5 MB limit. Please upload a smaller file."
                  );
                } else {
                  setImageUrl(file);
                }
              } else {
                alert("No file selected.");
              }
            }}
            className="p-0"
          />

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

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 sm:gap-6 w-full">
            <select
              value={countryCode}
              name="countryCode"
              className="border-[1px] px-4 py-2 rounded-lg w-full border-gray-300"
              onChange={(e) => setCountryCode(e.target.value.toString())}
              style={{ maxHeight: "100px" }}
            >
              {<Country />}
            </select>
            <InputComponent
              width={100}
              label="Phone Number"
              value={phoneNumber.replace(countryCode, "")}
              onChange={(e) => {
                setPhoneChange(true);
                setPhoneNumber(e.target.value);
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {userType === "member" && (
              <div className="flex flex-col w-full">
                <label className="font-medium mb-1">User Status</label>
                <select
                  required
                  className="border-[1px] px-4 py-2 rounded-lg w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                  <option value="Trial">Trial</option>
                </select>
              </div>
            )}
            <div className="flex flex-col w-full">
              <label className="font-medium mb-1">User Type</label>
              <select
                className="border-[1px] px-4 py-2 rounded-lg w-full"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="member">Member</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {status === "Trial" && (
            <div className="w-full">
              <div className="flex flex-col w-full px-4 sm:px-0">
                <label className="font-medium mb-1">Trial Period</label>
                <select
                  required
                  className="border-[1px] px-4 py-2 rounded-lg w-full"
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

          {status === "Active" && userType !== "instructor" && (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                <div className="flex flex-col w-full">
                  <label className="font-medium mb-1">
                    Select Product Type
                  </label>
                  <select
                    required
                    className="border-[1px] px-4 py-2 rounded-lg w-full"
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
                <div className="mt-4 mb-2 w-full">
                  <InputComponent
                    width="full"
                    label="Amount"
                    value={selectedProductAmount / 100}
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full mt-4">
                <div className="flex flex-col w-full">
                  <label className="font-medium mb-1">Payment Date</label>
                  <input
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    type="date"
                    className="border-[1px] px-4 py-2 rounded-lg w-full"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-medium mb-1">Payment Status</label>
                  <select
                    required
                    className="border-[1px] px-4 py-2 rounded-lg w-full"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="paid">Paid</option>
                    <option value="unPaid">UnPaid</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {userType === "instructor" && (
            <div className="flex flex-col gap-6 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                <div className="flex flex-col w-full">
                  <label className="font-medium mb-1">
                    Instructor Payment Type
                  </label>
                  <select
                    className="border-[1px] px-4 py-2 rounded-lg w-full"
                    value={instructorPaymentType}
                    onChange={(e) => setInstructorPaymentType(e.target.value)}
                  >
                    <option value="">Select Payment Type</option>
                    <option value="percent">Percent</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
                <div className="flex flex-col w-full">
                  <InputComponent
                    width="full"
                    type="number"
                    label="Bonus Amount"
                    value={instructorPaymentAmount}
                    onChange={(e) => setInstructorPaymentAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label className="font-medium mb-1">Select Class Types</label>
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
            className="px-6 py-3 rounded-lg text-white font-medium flex flex-row gap-2 justify-center items-center w-full sm:w-[200px] mx-auto"
            style={{ backgroundColor: InstitutionData.PrimaryColor }}
            onClick={onCreateUser}
          >
            {createButton ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;
