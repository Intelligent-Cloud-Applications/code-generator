import React, { useContext, useState, useEffect } from "react";
import InstitutionContext from "../../../Context/InstitutionContext";
import { GrEdit } from "react-icons/gr";
import {
  Button,
  Label,
  Modal,
  TextInput,
  FileInput,
  Textarea,
} from "flowbite-react";
import { FaPlus } from "react-icons/fa6";
import Context from "../../../Context/Context";
import { Storage } from "aws-amplify";
import { Auth, API } from "aws-amplify";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";


const Perks = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const { InstitutionId } = InstitutionData;
  const { PrimaryColor, LightestPrimaryColor } = InstitutionData;
  const [services, setServices] = useState(InstitutionData.Services || []);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceImg: null,
  });
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 250;
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    description: "",
    serviceImg: "",
  });

  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";

  // Set initial character count when opening the modal
  useEffect(() => {
    if (formData.description) {
      setCharCount(formData.description.length);
    } else {
      setCharCount(0);
    }
  }, [formData.description, openModal]);

  // Required field indicator component
  const RequiredIndicator = () => (
    <span className="text-red-500 ml-1">*</span>
  );

  const handleModalOpen = (mode, service = null) => {
    setModalMode(mode);
    if (mode === "edit" && service) {
      setFormData({
        title: service.title || "",
        description: service.description || "",
        serviceImg: null,
      });
      setCurrentService(service);
      setCharCount(service.description ? service.description.length : 0);
    } else {
      setFormData({
        title: "",
        description: "",
        serviceImg: null,
      });
      setCurrentService(null);
      setCharCount(0);
    }
    // Reset validation errors when opening modal
    setValidationErrors({
      title: "",
      description: "",
      serviceImg: "",
    });
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setFormData({
      title: "",
      description: "",
      serviceImg: null,
    });
    setCurrentService(null);
    setCharCount(0);
    // Reset validation errors
    setValidationErrors({
      title: "",
      description: "",
      serviceImg: "",
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    if (id === "description") {
      // Only update if we're under the character limit or if we're deleting characters
      if (value.length <= MAX_CHARS) {
        setFormData((prev) => ({
          ...prev,
          [id]: value,
        }));
        setCharCount(value.length);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[id]) {
      setValidationErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({
        ...prev,
        serviceImg: file,
      }));
      // Clear validation error for serviceImg when file is selected
      setValidationErrors(prev => ({
        ...prev,
        serviceImg: ""
      }));
    } else if (file) {
      setValidationErrors(prev => ({
        ...prev,
        serviceImg: "File size must be less than 5MB."
      }));
    }
  };

  const uploadToS3 = async (file) => {
    try {
      const response = await Storage.put(`services/${file.name}`, file, {
        contentType: file.type,
        ACL: "public-read",
      });
      const url = await Storage.get(response.key);
      return url.split("?")[0]; // Remove query parameters from the URL
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      description: "",
      serviceImg: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Please enter a title for the service.";
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Please enter a description for the service.";
      isValid = false;
    } else if (formData.description.length > MAX_CHARS) {
      newErrors.description = `Description cannot exceed ${MAX_CHARS} characters.`;
      isValid = false;
    }
    
    if (!formData.serviceImg && modalMode === "create" && !currentService?.serviceImg) {
      newErrors.serviceImg = "Please upload an image for the service.";
      isValid = false;
    }
    
    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      // Validate the form
      if (!validateForm()) {
        return;
      }

      let serviceImgUrl = currentService?.serviceImg;

      if (formData.serviceImg) {
        serviceImgUrl = await uploadToS3(formData.serviceImg);
      }

      let serviceData = {
        title: formData.title,
        description: formData.description,
        serviceImg: serviceImgUrl,
      };

      if (modalMode === "edit") {
        serviceData.serialNumber = currentService.serialNumber;
      }

      const response = await API.put(
        "main",
        `/admin/update-service-data?type=${
          modalMode === "create" ? "create" : "update"
        }`,
        {
          body: { service: serviceData, institutionid: InstitutionId },
        }
      );

      console.log("Full API Response:", response);

      if (response && response.service) {
        setServices((prev) => {
          if (modalMode === "create") {
            return [...prev, response.service];
          } else {
            return prev.map((service) =>
              service.serialNumber === currentService.serialNumber
                ? response.service
                : service
            );
          }
        });

        toast.success(
          modalMode === "create"
            ? "Service created successfully!"
            : "Service updated successfully!",
          { className: "custom-toast" }
        );

        handleModalClose();
      } else {
        console.error("API error response:", response);
        throw new Error(response.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Detailed error:", error);
      toast.error(
        error.message || "An unknown error occurred. Please try again.",
        {
          className: "custom-toast",
        }
      );
    }
  };

  const handleDeleteModalOpen = (service) => {
    setCurrentService(service);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setCurrentService(null);
  };

  const handleDelete = async () => {
    try {
      const response = await API.put(
        "main",
        "/admin/update-service-data?type=delete",
        {
          body: { 
            institutionid: InstitutionId,
            serialNumber: currentService.serialNumber 
          },
        }
      );

      if (response) {
        setServices((prev) => 
          prev.filter((service) => service.serialNumber !== currentService.serialNumber)
        );

        toast.success("Service deleted successfully!", {
          className: "custom-toast"
        });

        handleDeleteModalClose();
      } else {
        throw new Error(response.error || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(error.message || "An error occurred while deleting the service", {
        className: "custom-toast"
      });
    }
  };

  return (
    <>
      <Modal show={openModal} onClose={handleModalClose} size="md" popup>
        <Modal.Header>
          {/* <div className="text-xl font-medium text-gray-900 dark:text-white">
            {modalMode === "create" ? "Create a New Service" : "Update Service"}
          </div> */}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="file-upload-helper-text" value={
                  <>
                    Upload Image
                    {(modalMode === "create" || !currentService?.serviceImg) && <RequiredIndicator />}
                  </>
                } />
              </div>
              <FileInput
                id="file-upload-helper-text"
                helperText="SVG, PNG, JPG or GIF (Max: 5MB)."
                onChange={handleFileChange}
              />
              {validationErrors.serviceImg && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.serviceImg}
                </p>
              )}
              {modalMode === "edit" && currentService?.serviceImg && !formData.serviceImg && (
                <p className="mt-2 text-sm text-gray-500">
                  Current image will be kept if no new image is uploaded.
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value={
                  <>
                    Title
                    <RequiredIndicator />
                  </>
                } />
              </div>
              <TextInput
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the title of this service"
                required
                color={validationErrors.title ? "failure" : undefined}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.title}
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value={
                  <>
                    Description
                    <RequiredIndicator />
                  </>
                } />
              </div>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter the description of this service (max 250 characters)"
                required
                color={validationErrors.description ? "failure" : undefined}
              />
              <div className="flex justify-end mt-1">
                <span 
                  className={`text-sm ${
                    charCount > MAX_CHARS ? 'text-red-500 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {charCount}/{MAX_CHARS} characters
                </span>
              </div>
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.description}
                </p>
              )}
              {charCount > MAX_CHARS && !validationErrors.description && (
                <p className="text-red-500 text-sm mt-1">
                  Description exceeds maximum character limit.
                </p>
              )}
            </div>
            <div className="w-full">
              <Button
                onClick={handleSubmit}
                style={{ backgroundColor: PrimaryColor }}
                className="w-full"
                disabled={charCount > MAX_CHARS}
              >
                {modalMode === "create" ? "Create Service" : "Update Service"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={openDeleteModal}
        onClose={handleDeleteModalClose}
        size="sm"
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this service?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={handleDeleteModalClose}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div
        className={`w-full h-auto py-16 flex flex-col items-center`}
        style={{ backgroundColor: LightestPrimaryColor }}
      >
        <div className="text-center mb-12">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider"
            style={{ color: PrimaryColor }}
          >
            Features
          </h1>
          <p className="text-gray-700 mt-2 text-lg">Our Features & Services.</p>
        </div>
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {services.map((service, index) => (
            <div
              key={service.serialNumber || index}
              className="relative bg-white rounded-lg shadow-lg p-6 h-[470px] flex flex-col items-center overflow-hidden"
            >
              {isAdmin && (
                <>
                <button
                  onClick={() => handleModalOpen("edit", service)}
                  className="absolute top-4 right-4 hover:scale-110 transition-transform"
                  style={{ color: PrimaryColor }}
                >
                  <GrEdit size={20} />
                </button>
                <button
                    onClick={() => handleDeleteModalOpen(service)}
                    className="absolute top-4 left-4 hover:scale-110 transition-transform text-red-500"
                  >
                    <MdDeleteOutline  size={20} />
                  </button>
                </>
              )}
              <img
                className="w-60 h-60 mb-6 object-cover rounded-lg"
                src={service.serviceImg}
                alt={service.title}
              />
              <h2
                className="font-semibold text-lg mb-2 text-center"
                style={{ color: PrimaryColor }}
              >
                {service.title}
              </h2>
              <p className="text-gray-600 text-sm text-center">
                {service.description}
              </p>
            </div>
          ))}
          {isAdmin && (
            <div className="flex items-center justify-center bg-white rounded-lg shadow-lg p-6 h-[470px]">
              <button
                onClick={() => handleModalOpen("create")}
                className="text-white font-semibold p-4 rounded-full hover:scale-110 transition-transform"
                style={{ backgroundColor: PrimaryColor }}
              >
                <FaPlus size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Perks;