import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import './Footer.css'
import { useContext } from 'react'
import InstitutionContext from '../../Context/InstitutionContext'
import Context from "../../Context/Context"
import { Button, Modal, FileInput, Label, TextInput } from "flowbite-react";
import { MdEdit } from "react-icons/md";
import { FaPlus, FaTimes } from "react-icons/fa";
import { API, Storage } from "aws-amplify";
import { toast } from 'react-toastify';

const Footer = (props) => {
  const InstitutionData = useContext(InstitutionContext).institutionData
  const Navigate = useNavigate();
  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";
  const [modalShow, setModalShow] = useState(false);
  const [facebookLink, setFacebookLink] = useState(InstitutionData.Facebook);
  const [instagramLink, setInstagramLink] = useState(InstitutionData.Instagram);
  const [addSection, setAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [items, setItems] = useState([{
    item: "",
    link: ""
  }]); // Stores item inputs
  const [selectedFile, setSelectedFile] = useState(null);
  // Add new item input
  const handleAddItem = () => {
    setItems([...items, {
      item: "",
      link: ""
    }]);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Remove all inputs
  const handleCancel = () => {
    setAddSection(false);
    setNewSectionTitle("");
    setItems([""]);
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [props.initialContent]);

  const onCloseModal = () => {
    setModalShow(false);
  };

  const onCloseModal2 = () => {
    setAddSection(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, and PNG files are allowed.");
        event.target.value = ""; // Clear input field
        setSelectedFile(null); // Clear stored file
      } else {
        setSelectedFile(file); // Store the valid file
      }
    }
  };

  const uploadToS3 = async (file) => {
    try {
      const response = await Storage.put(`Logo/${file.name}`, file, {
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

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);

    // If no items left, reset the whole section
    if (newItems.length === 0) {
      handleCancel();
    }
  };

  const handleUpdateFooter = async () => {
    try {
      let newUrl;
      let AdditionalColumn = {}; // Initialize as empty object

      if (selectedFile) {
        newUrl = await uploadToS3(selectedFile);
      } else {
        newUrl = InstitutionData.logoUrl;
      }
      // Create AdditionalColumn object only if there's a title
      if (newSectionTitle.trim() !== "") {
        AdditionalColumn = {
          title: newSectionTitle, // Title from state
          items: items, // Items array from state
        };
      }
      console.log("the aditional column", AdditionalColumn);
      const response = await API.put("main", "/admin/update-footer-data", {
        body: {
          institutionid: InstitutionData.institutionid, // Fixed typo (institutionData)
          Facebook: facebookLink,
          Instagram: instagramLink,
          logoUrl: newUrl,
          AdditionalColumn: AdditionalColumn, // Send structured object
        },
      });
      console.log(response);
      toast.success("Footer updated successfully!");
      // setItems();
      // setNewSectionTitle();
    } catch (error) {
      console.log(error);
      toast.error("Error in Updating the Data"); // Show error message
    }
  };

  console.log("the data in footer", InstitutionData);

  return (
    <div>
      <Modal show={modalShow} size="lg" onClose={onCloseModal} popup>
        <Modal.Header className="py-4 px-4">Update Footer Section</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div id="fileUpload" className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload Logo" />
              </div>
              <FileInput
                id="fileUpload"
                accept=".jpg, .jpeg, .png, .img"
                onChange={handleFileChange}
                helperText="Upload a Logo (img, jpg, jpeg, png)"
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="text" value="Facebook Link" />
              </div>
              <TextInput
                color={"primary"}
                id="text"
                type="text"
                value={facebookLink}
                placeholder="Enter Facebook Link"
                onChange={(e) => setFacebookLink(e.target.value)}
                required
                rightIcon={MdEdit}
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="text" value="Instagram Link" />
              </div>
              <TextInput
                color={"primary"}
                id="text"
                type="text"
                value={instagramLink}
                placeholder="Enter Instagram Link"
                onChange={(e) => setInstagramLink(e.target.value)}
                required
                rightIcon={MdEdit}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={"primary"}
            onClick={() => {
              setModalShow(false);
              handleUpdateFooter();
            }}
            className='w-full'
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={addSection} onClose={onCloseModal2} popup>
        <Modal.Header className="py-4 px-4">Update Footer Section</Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="sectionTitle" value="Title" />
            </div>
            <TextInput
              color={"primary"}
              id="sectionTitle"
              type="text"
              placeholder="Enter title of new column"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              required
            />
          </div>
          {items.map((entry, index) => (
            <div key={index} className="relative mb-2">
              <button
                onClick={() => handleRemoveItem(index)}
                className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
              >
                <FaTimes size={10} />
              </button>
              <div className="mb-2 block">
                <Label htmlFor={`item-${index}`} value={`Item ${index + 1}`} />
              </div>
              <div className='flex flex-row justify-between gap-3'>
                <TextInput
                  color="primary"
                  id={`item-${index}`}
                  type="text"
                  placeholder="Enter item"
                  value={entry.item} // Corrected
                  onChange={(e) => handleChange(index, "item", e.target.value)}
                  required
                  className="w-[50%]"
                />
                {/* Link Input */}
                <TextInput
                  color="primary"
                  id={`link-${index}`} // Unique ID
                  type="text"
                  placeholder="Enter Link"
                  value={entry.link} // Corrected
                  onChange={(e) => handleChange(index, "link", e.target.value)}
                  required
                  className="w-[50%]"
                />
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleAddItem}
              className="bg-gray-300 text-black text-sm flex flex-row items-center justify-center p-0 m-0 hover:bg-gray-400 group"
            >
              <FaPlus className="mr-1 group-hover:text-white" />
              <span className="group-hover:text-white">Add Item</span>
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={"primary"}
            onClick={() => {
              setAddSection(false);
              handleUpdateFooter();
            }}
            className='w-full'
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={`bg-black`}>
        {isAdmin && (
          <Button
            style={{
              backgroundColor: InstitutionData.PrimaryColor
            }}
            className="absolute left-3 p-0 m-0 mt-3 border-0 hover:border-0"
            onClick={() => setModalShow(true)}
            afterClick="boder-0"
          >
            <div className="flex gap-2 justify-center items-center">
              <MdEdit size={16} />
              Edit
            </div>
          </Button>
        )}
        <div
          className={` footerheight max800:h-[30rem] flex flex-col justify-between sm:flex-row h-[17rem] max600:flex-col max600:justify-center p-12 gap-6 max1358:justify-center w-[100vw] z-[1000]`}
        >
          <div className={`mb-5`}>
            <a
              href="/"
              className={`transition duration-200 flex justify-center`}
            >
              <img
                className={`w-[15rem] h-[10rem] object-contain`}
                src={InstitutionData.logoUrl}
                alt=""
              />
            </a>
          </div>
          {InstitutionData.AdditionalColumn && (
            <ul className={`flex flex-col gap-4 sm:flex-row sm:gap-8 max950:gap-4 text-[1.2rem] text-white flex-wrap max1050:justify-center pl-0`}>
              <li className={`flex flex-col gap-[0.7rem] items-center text-center`}>
                <h2 className={`text-[1.2rem] mb-[0]`}>{InstitutionData.AdditionalColumn.title}</h2>
                <hr className={`w-[100%] text-white mb-[0] `} />
                {InstitutionData.AdditionalColumn.items.map((item, idx) => (
                  <p className={`text-[1.2rem] mb-[0]`} key={idx}>{item}</p>
                ))}
              </li>
            </ul>
          )}
          <div className='flex flex-row gap-5'>
            {isAdmin && (
              <div className="flex items-center justify-center rounded-lg shadow-lg">
                <button
                  onClick={() => setAddSection(true)}
                  className="text-white font-semibold p-2 rounded-full hover:scale-110 transition-transform right-10"
                  style={{ backgroundColor: InstitutionData.LightPrimaryColor }}
                >
                  <FaPlus size={24} />
                </button>
              </div>
            )}
            <ul
              className={`flex flex-col gap-4 sm:flex-row sm:gap-8 max950:gap-4 text-[1.2rem] text-white flex-wrap max1050:justify-center pl-0`}
            >
              <li
                className={`flex flex-col gap-[0.7rem] items-center text-center`}
              >
                <h2 className={`text-[1.2rem] mb-[0]`}>Useful Links</h2>
                <hr className={`w-[100%] text-white mb-[0] `} />
                <p
                  className={`cursor-pointer mb-[0]`}
                  onClick={() => {
                    Navigate('/query')
                  }}
                >
                  Contact Us
                </p>
                <a
                  className={`cursor-pointer text-white text-decoration-none`}
                  href={InstitutionData?.Footer_Link_1}
                  target="_blank"
                  rel="noreferrer"
                >
                  BWorkz
                </a>
                <a
                  className={`cursor-pointer text-decoration-none text-white`}
                  href={InstitutionData?.Footer_Link_2}
                  target="_blank"
                  rel="noreferrer"
                >
                  Zumba
                </a>
                <a
                  className={`cursor-pointer text-decoration-none text-white`}
                  href="https://awsaiapp.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  AWSAIAPP
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`h-16 flex w-full items-center justify-center px-[2rem] sm:justify-start`}
          style={{
            backgroundColor: InstitutionData.LightPrimaryColor
          }}
        >
          <div
            className={`flex bg-black justify-between items-center w-[7rem] rounded-2xl h-12 p-4`}
          >
            <a
              href={InstitutionData?.Instagram}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/INSTA.png`}
                alt=""
                className={`hover:mr-2 hover:w-10 hover:h-10 w-8 h-8`}
              />
            </a>
            <a
              href={InstitutionData?.Facebook}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/FB.png`}
                alt=""
                className={`hover:mr-2 hover:w-10 hover:h-10 w-8 h-8`}
              />
            </a>
          </div>
        </div>

        <div
          className={`p-[0.5rem] flex justify-center text-white gap-2 font-sans max536:flex-col max536:text-center`}
        >
          <Link
            className={`text-white text-decoration-none`}
            to={'/privacypolicy'}
          >
            Privacy Policy
          </Link>
          <div
            className={`w-1 border-white rounded-md`}
            style={{
              backgroundColor: InstitutionData.LightPrimaryColor
            }}
          ></div>
          <Link className={`text-white text-decoration-none`} to={'/terms'}>
            Terms and Condition
          </Link>
          <div
            className={`w-1 border-white rounded-md`}
            style={{
              backgroundColor: InstitutionData.LightPrimaryColor
            }}
          ></div>
          <Link className={`text-white text-decoration-none`} to={'/refund'}>
            Cancellation/Refund Policy
          </Link>
          <div
            className={`w-1 border-white rounded-md`}
            style={{
              backgroundColor: InstitutionData.LightPrimaryColor
            }}
          ></div>
          <h5 className={`text-[1rem] sans-sarif mb-0 font-[400]`}>
            {' '}
            All rights reserved. © {new Date().getFullYear()} happyprancer.com
          </h5>
        </div>
      </div>
    </div>
  )
}

export default Footer
