import React, { useContext, useState, useRef } from "react";
import InstitutionContext from "../../../Context/InstitutionContext";
import { GrEdit } from "react-icons/gr";
import { Button, Label, Modal, TextInput, FileInput } from "flowbite-react";
import { FaPlus } from "react-icons/fa6";
import Context from "../../../Context/Context";

const Perks = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const { PrimaryColor } = InstitutionData;
  const [services, setServices] = useState(InstitutionData.Services || []);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceImg: null
  });
  
  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";

  const handleModalOpen = (mode, service = null) => {
    setModalMode(mode);
    if (mode === "edit" && service) {
      setFormData({
        title: service.title || "",
        description: service.description || "",
        serviceImg: service.serviceImg || null
      });
      setCurrentService(service);
    } else {
      setFormData({
        title: "",
        description: "",
        serviceImg: null
      });
    }
    setOpenModal(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === "text" ? "title" : id]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        serviceImg: file
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      if (formData.serviceImg) {
        formDataToSend.append("serviceImg", formData.serviceImg);
      }

      if (modalMode === "edit" && currentService) {
        formDataToSend.append("serviceId", currentService.id); // Assuming each service has an id
      }

      // Using the same API endpoint for both create and update
      const response = await fetch("/admin/update-service-data", {
        method: "PUT",
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error("Failed to save service");
      }

      const savedService = await response.json();

      if (modalMode === "create") {
        setServices(prev => [...prev, savedService]);
      } else {
        setServices(prev =>
          prev.map(service =>
            service.id === currentService.id ? savedService : service
          )
        );
      }

      setOpenModal(false);
      setFormData({
        title: "",
        description: "",
        serviceImg: null
      });
      setCurrentService(null);
    } catch (error) {
      console.error("Error saving service:", error);
      // Handle error (show error message to user)
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {modalMode === "create" ? "Create a New Service" : "Update This Service"}
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="file-upload-helper-text" value="Upload file" />
              </div>
              <FileInput
                id="file-upload-helper-text"
                helperText="SVG, PNG, JPG or GIF."
                onChange={handleFileChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput
                id="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the title of this service"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <TextInput
                id="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter the Description of this service"
              />
            </div>

            <div className="w-full">
              <Button
                onClick={handleSubmit}
                style={{ backgroundColor: PrimaryColor }}
              >
                {modalMode === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className="w-full h-auto bg-[#E6F5F1] py-16 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider`}
            style={{ color: PrimaryColor }}
          >
            Features
          </h1>
          <p className="text-gray-700 mt-2 text-lg">Our Features & Services.</p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {services?.map((service, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden text-center flex flex-col items-center p-6 h-[470px]"
            >
              {isAdmin && (
                <button
                  onClick={() => handleModalOpen("edit", service)}
                  className={`absolute top-4 right-4 text-xl font-medium py-2 px-6`}
                  style={{ color: PrimaryColor }}
                >
                  <GrEdit />
                </button>
              )}

              <img
                className="w-60 h-60 mb-6"
                src={service.serviceImg}
                alt={service.title}
              />
              <h2
                className={`font-semibold text-lg mb-2`}
                style={{ color: PrimaryColor }}
              >
                {service.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {service.description ||
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, reiciendis quaerat! Ipsa maxime numquam iusto obcaecati."}
              </p>
            </div>
          ))}
          <div className="w-full flex justify-center mt-8 relative">
            {isAdmin && (
              <button
                onClick={() => handleModalOpen("create")}
                className={`text-white font-semibold px-6 py-3 rounded-lg h-[50px] absolute top-1/2 transform -translate-y-1/2`}
                style={{ backgroundColor: PrimaryColor }}
              >
                <FaPlus />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Perks;