import React, { useContext, useState } from "react";
import InstitutionContext from "../../../Context/InstitutionContext";
import { GrEdit } from "react-icons/gr";
import { Button, Label, Modal, TextInput, FileInput } from "flowbite-react";
import { FaPlus } from "react-icons/fa6";
import Context from "../../../Context/Context";
import { Storage } from "aws-amplify";
import { Auth, API } from "aws-amplify";
import { toast } from "react-toastify";

const Perks = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const { InstitutionId } = InstitutionData;
  const { PrimaryColor } = InstitutionData;
  const [services, setServices] = useState(InstitutionData.Services || []);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceImg: null,
  });

  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";

  const handleModalOpen = (mode, service = null) => {
    setModalMode(mode);
    if (mode === "edit" && service) {
      setFormData({
        title: service.title || "",
        description: service.description || "",
        serviceImg: null,
      });
      setCurrentService(service);
    } else {
      setFormData({
        title: "",
        description: "",
        serviceImg: null,
      });
      setCurrentService(null);
    }
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
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({
        ...prev,
        serviceImg: file,
      }));
    } else {
      alert("File size must be less than 5MB.");
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

  const handleSubmit = async () => {
    try {
      let serviceImgUrl = currentService?.serviceImg;
  
      if (formData.serviceImg) {
        serviceImgUrl = await uploadToS3(formData.serviceImg);
      }
  
      if (!serviceImgUrl && modalMode === "create") {
        alert("Please upload an image.");
        return;
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
        `/admin/update-service-data?type=${modalMode === "create" ? "create" : "update"}`,
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
              service.serialNumber === currentService.serialNumber ? response.service : service
            );
          }
        });
  
        // ✅ Show success alert
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
      toast.error(error.message || "An unknown error occurred. Please try again.", {
        className: "custom-toast",
      });
    }
  };
  
  return (
    <>
      <Modal show={openModal} onClose={handleModalClose} size="md" popup>
        <Modal.Header>
          <div className="text-xl font-medium text-gray-900 dark:text-white">
            {modalMode === "create" ? "Create a New Service" : "Update Service"}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="file-upload-helper-text" value="Upload Image" />
              </div>
              <FileInput
                id="file-upload-helper-text"
                helperText="SVG, PNG, JPG or GIF (Max: 5MB)."
                onChange={handleFileChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the title of this service"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <TextInput
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter the description of this service"
                required
              />
            </div>
            <div className="w-full">
              <Button
                onClick={handleSubmit}
                style={{ backgroundColor: PrimaryColor }}
                className="w-full"
              >
                {modalMode === "create" ? "Create Service" : "Update Service"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className="w-full h-auto bg-[#E6F5F1] py-16 flex flex-col items-center">
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
              className="relative bg-white rounded-lg shadow-lg p-6 h-[470px] flex flex-col items-center"
            >
              {isAdmin && (
                <button
                  onClick={() => handleModalOpen("edit", service)}
                  className="absolute top-4 right-4 hover:scale-110 transition-transform"
                  style={{ color: PrimaryColor }}
                >
                  <GrEdit size={20} />
                </button>
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
