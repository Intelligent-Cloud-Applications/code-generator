import React, { useContext, useState, useRef } from "react";
import InstitutionContext from "../../../Context/InstitutionContext";
import Service from "../../../utils/images/Dance.png";
import { GrEdit } from "react-icons/gr";
import { Button, Label, Modal, TextInput, FileInput } from "flowbite-react";
import { FaPlus } from "react-icons/fa6";
import Context from "../../../Context/Context";

const Perks = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const { PrimaryColor } = InstitutionData;
  const [services] = useState(InstitutionData.Services || []);
  const [openModal, setOpenModal] = useState(false);

  // const emailInputRef = useRef(null); // Ensure Flowbite supports ref forwarding
  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";

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
              Update this Service
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="file-upload-helper-text" value="Upload file" />
              </div>
              <FileInput
                id="file-upload-helper-text"
                helperText="SVG, PNG, JPG or GIF."
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="text" value="Title" />
              </div>
              <TextInput
                id="text"
                type="text"
                // value={PrimaryColor}
                placeholder="Enter the title of this service"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="text" value="Description" />
              </div>
              <TextInput
                id="text"
                type="text"
                placeholder="Enter the Description of this service"
              />
            </div>

            <div className="w-full">
              <Button
              style={{ backgroundColor: PrimaryColor }}>Submit</Button>
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
            >{isAdmin && (
              <button
                onClick={() => setOpenModal(true)}
                className={`absolute top-4 right-4 text-xl font-medium py-2 px-6`}
                style={{ color: PrimaryColor }}
              >
                <GrEdit />
              </button>
            )}

              <img
                className="w-60 h-60 mb-6"
                src={Service}
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
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, reiciendis quaerat! Ipsa maxime numquam iusto obcaecati.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, reiciendis quaerat! Ipsa maxime numquam iusto obcaecati."}
              </p>
            </div>
          ))}
        {/* Create new Service Section */}
        <div className="w-full flex justify-center mt-8 relative">
        {isAdmin && (
          <button
            onClick={() => setOpenModal(true)}
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
