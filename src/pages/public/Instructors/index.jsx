import React, { useContext, useEffect, useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import { API, Storage } from "aws-amplify";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import "./Instructor.css";
import Country from "../../../components_old/Country";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  Modal,
  FileInput,
  Label,
  TextInput,
  Select as FlowbiteSelect,
} from "flowbite-react";
import { FaUserEdit, FaPhoneAlt, FaGlobe } from "react-icons/fa";
import {
  HiMail,
  HiUser,
  HiPencilAlt,
  HiTrash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import {
  MdVerified,
  MdEdit,
  MdPayment,
  MdOutlinePayments,
} from "react-icons/md";
// import { GrYoga } from "react-icons/gr";

const Instructor = () => {
  const [instructorList, setInstructorList] = useState([]);
  const UserCtx = useContext(Context);
  const Loader = useContext(Context).util;
  const [loaderInitialized, setLoaderInitialized] = useState(false);
  const isAdmin = UserCtx.userData.userType === "admin";

  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [instructorPaymentType, setInstructorPaymentType] = useState("");
  const [instructorPaymentAmount, setInstructorPaymentAmount] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const { institutionData } = useContext(InstitutionContext); // Access InstitutionData
  const [selectedClassTypes, setSelectedClassTypes] = useState([]); // Track selected class types

  // Prepare class type options
  const classTypeOptions = institutionData.ClassTypes.map((classType) => ({
    value: classType,
    label: classType,
  }));

  const handleClassTypeChange = (selectedOptions, instructorId) => {
    setSelectedClassTypes((prev) => ({
      ...prev,
      [instructorId]: selectedOptions || [], // Update class types for the specific instructor
    }));
  };
  
  useEffect(() => {
    const fetchInstructorList = async () => {
      try {
        if (!loaderInitialized) {
          Loader.setLoader(true);
          setLoaderInitialized(true);
        }
        const response = await API.get(
          "main",
          `/any/instructor-list/${institutionData.InstitutionId}`
        );
        const filteredInstructors = response.filter(
          (instructor) => instructor.instructorId !== "id-for-canceled-class"
        );
        const sortedInstructors = filteredInstructors.sort((a, b) => {
          if (
            a.position === "Master Instructor" &&
            b.position !== "Master Instructor"
          )
            return -1;
          if (
            a.position !== "Master Instructor" &&
            b.position === "Master Instructor"
          )
            return 1;
          return 0;
        });
        localStorage.setItem(
          `instructorList_${institutionData.InstitutionId}`,
          JSON.stringify({
            data: sortedInstructors,
            timestamp: Date.now(),
          })
        );
      
        setInstructorList(sortedInstructors);
        console.log("hello1",sortedInstructor);
       
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        Loader.setLoader(false);
      }
    };
    console.log("hello",selectedClassTypes)

    const cachedInstructorList = localStorage.getItem(
      `instructorList_${institutionData.InstitutionId}`
    );
    if (cachedInstructorList) {
      const { data, timestamp } = JSON.parse(cachedInstructorList);
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        setInstructorList(data);
      } else {
        fetchInstructorList();
      }
    } else {
      fetchInstructorList();
    }
  }, [Loader, loaderInitialized, institutionData.InstitutionId]);

  const getFirstWord = (str) => {
    return str.split(" ")[0];
  };

  useEffect(() => {
    if (Array.isArray(instructorList) && instructorList.length > 0) {
      const mappedClassTypes = instructorList.reduce((acc, instructor) => {
        acc[instructor.instructorId] = Array.isArray(instructor.classType)
          ? instructor.classType.map((type) => ({
              value: type,
              label: type,
            }))
          : [];
        return acc;
      }, {});
      setSelectedClassTypes(mappedClassTypes);
      
    }
  }, [instructorList]);
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);

    if (isUpdating) {
      const url = imageURL?.split(
        `https://institution-utils.s3.amazonaws.com/public/`
      )[1];
      const key = decodeURI(url);
      await Storage.remove(key, {
        bucket: "institution-utils",
        region: "us-east-1",
      });
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warn("Please upload an image of less than 10MB size.", {
        className: "custom-toast",
      });
      return;
    }

    const folderPath = `institution-utils/${institutionData.InstitutionId}/images/Instructor`;

    setLoaderInitialized(true);
    try {
      console.log("Uploading file...", file.name, file.type);
      await Storage.put(`${folderPath}/${file.name}`, file, {
        contentType: file.type,
        bucket: "institution-utils",
        region: "us-east-1",
        ACL: "public-read",
      });
      console.log("File uploaded successfully.");
      const url = `https://institution-utils.s3.amazonaws.com/public/${folderPath}/${file.name}`;
      const imgUrl = encodeURI(url);
      setImageURL(imgUrl);
      console.log("API Call Successful");
    } catch (e) {
      console.error("Error uploading file:", e);
      toast.error("Error uploading file. Please try again.", {
        className: "custom-toast",
      });
    } finally {
      setLoaderInitialized(false);
    }
  };

  async function handleAddInstructor() {
    setLoaderInitialized(true);
    if (!name || !phone) {
      toast.error("Name and Phone are required.", {
        className: "custom-toast",
      });
      setLoaderInitialized(false);
      return;
    }
    console.log(`+${countryCode}${phone}`);
    console.log(imageURL);
    const instructorClassTypes = selectedClassTypes[instructorId]?.map((type) => type.value) || [];
    try {
      const data = {
        institution: institutionData.InstitutionId,
        name: name,
        userName: name,
        phoneNumber: `+${countryCode}${phone}`,
        position: position,
        image: imageURL,
        emailId: email,
        instructorPaymentType: instructorPaymentType
          ? instructorPaymentType
          : "",
        instructorPaymentAmount: instructorPaymentAmount
          ? instructorPaymentAmount
          : "",
        classType:  instructorClassTypes,
      };
      const response = await API.post("main", `/admin/create-user`, {
        body: data,
      });

      const createdCognitoId = response.user.cognitoId;

      await API.put("main", "/admin/member-to-instructor", {
        body: { ...data, cognitoId: createdCognitoId },
      });

      console.log(response);
      localStorage.removeItem(
        `instructorList_${institutionData.InstitutionId}`
      );
      setLoaderInitialized(false);
      toast.success("Instructor added successfully.", {
        className: "custom-toast",
      });
      fileInputRef.current.value = "";
      setName("");
      setPosition("");
      setEmail("");
    } catch (e) {
      console.log(e);
    }
  }

  async function handleUpdateInstructor() {
    try {
      setLoaderInitialized(true);
      console.log(imageURL);
      const instructorClassTypes = selectedClassTypes[instructorId]?.map((type) => type.value) || [];
      const response = await API.put(
        "main",
        `/admin/put-instructor/${institutionData.InstitutionId}/${instructorId}`,
        {
          body: {
            name: name,
            position: position,
            image: imageURL,
            phoneNumber: phone ? `${countryCode}${phone}` : phone,
            instructorPaymentType: instructorPaymentType,
            instructorPaymentAmount: instructorPaymentAmount,
            emailId: email,
            classType:  instructorClassTypes,
          },
        }
      );
      console.log(response);
      localStorage.removeItem(
        `instructorList_${institutionData.InstitutionId}`
      );
      setLoaderInitialized(false);
      toast.success("Instructor updated successfully.", {
        className: "custom-toast",
      });
      setLoaderInitialized(false);
      onCloseModal();
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteInstructor() {
    setLoaderInitialized(true);
    setAlert(false);
    try {
      const url = imageURL?.split(
        `https://institution-utils.s3.amazonaws.com/public/`
      )[1];
      const key = decodeURI(url);

      imageURL &&
        (await Storage.remove(key, {
          bucket: "institution-utils",
          region: "us-east-1",
        }));
      const response = await API.del(
        "main",
        `/admin/delete-instructor/${institutionData.InstitutionId}`,
        {
          body: {
            instructorId: instructorId,
          },
        }
      );
      console.log(response);
      setInstructorId("");
      setImageURL("");
      toast.success("Instructor deleted successfully.", {
        className: "custom-toast",
      });
      localStorage.removeItem(
        `instructorList_${institutionData.InstitutionId}`
      );
      setLoaderInitialized(false);
    } catch (e) {
      console.log(e);
    }
  }

  function onCloseModal() {
    setModalShow(false);
    setIsUpdating(false);
    // fileInputRef.current.value = "";
    setName("");
    setPosition("");
    setEmail("");
    setImageURL("");
    setPhone("");
    setCountryCode("91");
    setInstructorPaymentType("");
    setInstructorPaymentAmount("");
  }

  return (
    <>
      <NavBar />

      {/* Modal for delete confirmation */}
      <Modal show={alert} size="lg" onClose={() => setAlert(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Instructor?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteInstructor}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setAlert(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for adding or updateing instructor */}
      <Modal show={modalShow} size="lg" onClose={onCloseModal} popup>
        <Modal.Header className="py-4 px-4">
          {isUpdating ? "Update Instructor" : "Add Instructor"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <div id="fileUpload" className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload file" />
              </div>
              <FileInput
                ref={fileInputRef}
                onChange={handleFileChange}
                value={fileInputRef.current?.value}
                helperText={
                  isUpdating
                    ? "Leave empty to keep the same"
                    : "A profile picture is required for the instructor."
                }
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="text" value="Name" />
              </div>
              <TextInput
                color={"primary"}
                id="text"
                type="text"
                icon={HiUser}
                value={name}
                placeholder="Enter Name"
                onChange={(e) => setName(e.target.value)}
                required
                rightIcon={isUpdating ? MdEdit : null}
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="text" value="Position" />
              </div>
              <TextInput
                color={"primary"}
                id="text"
                type="text"
                icon={MdVerified}
                value={position}
                placeholder="Enter Position"
                onChange={(e) => setPosition(e.target.value)}
                required
                rightIcon={isUpdating ? MdEdit : null}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Class Types</label>
              <Select
                isMulti
                options={classTypeOptions}
                value={selectedClassTypes[instructorId] || []}// Use the state variable directly
                onChange={(selectedOptions) => handleClassTypeChange(selectedOptions, instructorId)}
                placeholder="Select Class Types"
              />

            </div>
            {!isUpdating && (
              <div className="flex flex-row gap-2">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="text" value="Country Code" />
                  </div>
                  <FlowbiteSelect
                    color={"primary"}
                    icon={FaGlobe}
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value.toString());
                    }}
                  >
                    <Country />
                  </FlowbiteSelect>
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="text" value="Phone" />
                  </div>
                  <TextInput
                    color={"primary"}
                    id="text"
                    type="text"
                    icon={FaPhoneAlt}
                    value={phone}
                    placeholder="Enter Phone"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    rightIcon={isUpdating ? MdEdit : null}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-row gap-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="text" value="Payment Type" />
                </div>
                <FlowbiteSelect
                  color={"primary"}
                  icon={MdPayment}
                  value={instructorPaymentType}
                  onChange={(e) => setInstructorPaymentType(e.target.value)}
                >
                  <option value="">Select Payment Type</option>
                  <option value="percent">Percent</option>
                  <option value="flat">Flat</option>
                </FlowbiteSelect>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="text" value="Payment Amount" />
                </div>
                <TextInput
                  color={"primary"}
                  id="text"
                  type="text"
                  icon={MdOutlinePayments}
                  value={instructorPaymentAmount}
                  placeholder="Enter Payment Amount"
                  onChange={(e) => setInstructorPaymentAmount(e.target.value)}
                  required
                  rightIcon={isUpdating ? MdEdit : null}
                />
              </div>
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="email4" value="Email" />
              </div>
              <TextInput
                color={"primary"}
                id="email4"
                type="email"
                icon={HiMail}
                value={email}
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
                rightIcon={isUpdating ? MdEdit : null}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={"primary"}
            onClick={() => {
              setModalShow(false);
              isUpdating ? handleUpdateInstructor() : handleAddInstructor();
            }}
          >
            {isUpdating ? "Update" : "Add"}
          </Button>
          <Button color={"secondary"} onClick={onCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div
        className={`flex flex-col items-center background-container pt-6 relative ${isAdmin && "max1050:pt-16"
          }`}
        style={{
          backgroundImage: `url(${institutionData.InstructorBg})`,
        }}
      >
        {isAdmin && (
          <div className="absolute top-[1rem] right-[1.5rem] z-20">
            <Button color={"primary"} onClick={() => setModalShow(true)}>
              <div className="flex gap-2 justify-center items-center">
                <FaUserEdit size={18} />
                Add
              </div>
            </Button>
          </div>
        )}
        <div
          className={`grid grid-cols-1 gap-6 justify-center ${instructorList.length >= 3
            ? "md:grid-cols-3"
            : instructorList.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-1"
            } bg`}
        >
          {instructorList.map(
            (instructor, i) =>
              instructor.name !== "cancelled" && (
                <div className={`inst-card relative`} key={i}>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex flex-row gap-1.5">
                      <div
                        className={` bg-gray-400 bg-opacity-40 text-white cursor-pointer border-1 border-white p-2 rounded hover:scale-10`}
                        onClick={() => {
                          setModalShow(true);
                          setIsUpdating(true);
                          setName(instructor.name);
                          setPosition(instructor.position);
                          setEmail(instructor.emailId);
                          setImageURL(instructor.image);
                          setInstructorId(instructor.instructorId);
                          setPhone(instructor.phoneNumber);
                          setCountryCode(instructor.phoneNumber?.slice(1, 3));
                          setInstructorPaymentType(
                            instructor.instructorPaymentType
                          );
                          setInstructorPaymentAmount(
                            instructor.instructorPaymentAmount
                          );
                        }}
                      >
                        <HiPencilAlt />
                      </div>
                      <div
                        className={`bg-gray-400 bg-opacity-40 text-white cursor-pointer border-1 border-white p-2 rounded`}
                        onClick={() => {
                          setAlert(true);
                          setInstructorId(instructor.instructorId);
                          setImageURL(instructor.image);
                        }}
                      >
                        <HiTrash />
                      </div>
                    </div>
                  )}
                
                  <Card
                    className={`Box`}
                    onClick={() =>
                      navigate(`/hybrid/?institution=${instructor.institution}&referral=${instructor.referral_code || getFirstWord(instructor.name)}
                        `)
                    }
                    style={{
                      backgroundImage: `url(${instructor.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "29rem",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div className={`overlay`}></div>
                    <div
                      className={`instructor-card-text flex flex-col items-center`}
                    >
                      <h4 className={`text-[1.3rem] font-semibold`}>
                        {instructor.name}
                      </h4>
                      <h6>{instructor.position}</h6>
                    </div>
                  </Card>
                </div>
              )
          )}

        </div>
      </div>

      <Footer />

    </>
  );
};

export default Instructor;