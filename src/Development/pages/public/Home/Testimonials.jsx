import React, { useContext, useEffect, useState } from 'react';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import './Testimonial.css';
import InstitutionContext from '../../../Context/InstitutionContext';
import Context from "../../../Context/Context";
import { MdEdit } from "react-icons/md";
import { Button, Modal, FileInput, Label, TextInput, Spinner } from "flowbite-react";
import { toast } from 'react-toastify';
import { API, Storage } from "aws-amplify";
import { FaPlus, FaTimes } from "react-icons/fa";

const Testimonial = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const testiData = InstitutionData.Testimonial.map((val) => ({
    name: val.name,
    description: val.description,
    img: val.img,
  }));

  const [testimonials, setTestimonials] = useState(testiData);
  const [inView, setInView] = useState(false);
  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";
  const [modalShow, setModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedTestimonialIndex, setSelectedTestimonialIndex] = useState(null); // Track selected testimonial
  const [selectedFile, setSelectedFile] = useState(null);
  const [newSelectedFile, setNewSelectedFile] = useState(null);
  const [newTestName, setNewTestName] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [updateTestName, setUpdateTestName] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01 }
    );

    const element = document.getElementById('testimonial-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const leftClicked = () => {
    setTestimonials((testi) => {
      const tempTesti = [...testi];
      const firstTesti = tempTesti.pop();
      tempTesti.unshift(firstTesti);
      return tempTesti;
    });
  };

  const rightClicked = () => {
    setTestimonials((testi) => {
      const tempTesti = [...testi];
      const lastTesti = tempTesti.shift();
      tempTesti.push(lastTesti);
      return tempTesti;
    });
  };

  const onCloseModal = () => {
    setModalShow(false);
    setUpdateTestName("");  // Clear the name field when closing modal
    setUpdateFeedback("");  // Clear the feedback field when closing modal
    setSelectedFile(null);  // Clear file when closing modal
  };

  const onCloseAddModal = () => {
    setAddModalShow(false);
    setNewTestName(""); // Clear new testimonial name
    setNewFeedback(""); // Clear new testimonial feedback
    setNewSelectedFile(null); // Clear new selected file
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

  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, and PNG files are allowed.");
        event.target.value = ""; // Clear input field
        setNewSelectedFile(null); // Clear stored file
      } else {
        setNewSelectedFile(file); // Store the valid file
      }
    }
  };

  const uploadToS3 = async (file) => {
    try {
      const response = await Storage.put(`Testimonials/${file.name}`, file, {
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

  const centralizeApiCall = async (action, testimonialData) => {
    try {
      setLoading(true); // Start loading
      let updatedTestimonials;

      if (action === 'add') {
        updatedTestimonials = [...testimonials, testimonialData];
      } else if (action === 'update') {
        updatedTestimonials = testimonials.map((test, index) =>
          index === selectedTestimonialIndex ? testimonialData : test
        );
      } else if (action === 'delete') {
        updatedTestimonials = testimonials.filter((_, index) => index !== selectedTestimonialIndex);
      }

      setTestimonials(updatedTestimonials); // Update state first

      await API.put("main", "/admin/update-testimonial-data", {
        body: {
          institutionid: InstitutionData.institutionid,
          Testimonial: updatedTestimonials, // Use updated state for API call
        },
      });

      toast.success(`Testimonial ${action === 'add' ? 'added' : action === 'update' ? 'updated' : 'deleted'} successfully!`);
      setModalShow(false);
      setAddModalShow(false);
      setNewTestName("");
      setNewFeedback("");
      setNewSelectedFile(null);
    } catch (error) {
      console.log(error);
      toast.error(`Error in ${action === 'add' ? 'adding' : action === 'update' ? 'updating' : 'deleting'} the testimonial`);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDeleteTestimonial = () => {
    centralizeApiCall('delete');
  };

  const handleUpdateTestimonial = async () => {
    try {
      let newUrl = null;

      if (selectedFile) {
        newUrl = await uploadToS3(selectedFile);
      }

      const updatedTestimonial = {
        name: updateTestName || testimonials[selectedTestimonialIndex].name,
        description: updateFeedback || testimonials[selectedTestimonialIndex].description,
        img: newUrl || testimonials[selectedTestimonialIndex].img, // Retain old image if no new image is provided
      };

      await centralizeApiCall('update', updatedTestimonial);
    } catch (error) {
      console.log(error);
      toast.error("Error in updating the testimonial");
    }
  };

  const handleAddTestimonial = async () => {
    try {
      if (!newTestName || !newFeedback || !newSelectedFile) {
        toast.error("Please fill in all fields and upload an image.");
        return;
      }

      const newUrl = await uploadToS3(newSelectedFile);
      const newTestimonial = {
        name: newTestName,
        description: newFeedback,
        img: newUrl,
      };

      await centralizeApiCall('add', newTestimonial);
    } catch (error) {
      console.log(error);
      toast.error("Error in adding the testimonial");
    }
  };

  const handleEditClick = (index) => {
    setSelectedTestimonialIndex(index);
    const testimonial = testimonials[index];
    console.log("Editing testimonial:", testimonial); // Debugging log
    setUpdateTestName(testimonial.name);
    setUpdateFeedback(testimonial.description);
    setModalShow(true);
  };

  console.log("Testimonials State:", testimonials); // Debugging log

  return (
    <div id="testimonial-section" className="font-sans min-h-screen">
      <div
        className={`py-[0.2rem] flex flex-col item-center bg-black h-full min-h-screen`}
        style={{
          backgroundImage: inView ? `url(${InstitutionData.TestimonialBg})` : 'none',
          backgroundSize: 'cover',
        }}
      >
        <h1 className="text-white text-4xl text-center font-[500] max800:text-[1.5rem] py-8 max800:py-2">
          TESTIMONIAL
        </h1>
        <div>
          <div>
            <ul className="feedback">
              <div className="absolute w-screen flex justify-center flex-col"></div>
              {testimonials.map((test, i) => (
                <li key={i}>
                  {inView && (
                    <img
                      src={test.img}
                      alt=""
                      className={`ecllip${i + 2}`} // Ensure consistent class naming
                      loading="lazy"
                      style={{ display: (i + 2) > 4 ? 'none' : 'block' }} // Hide images if index is 4 or greater
                    />
                  )}
                </li>
              ))}
              <BsArrowLeftCircle
                color="white"
                size={"2rem"}
                className={`absolute left-16 cursor-pointer max536:left-6 max500:left-2 max406:h-[1.5rem]`}
                onClick={leftClicked}
              />
              <BsArrowRightCircle
                color="white"
                size={"2rem"}
                className={`absolute right-16 cursor-pointer max536:right-6 max500:right-2 max406:h-[1.5rem]`}
                onClick={rightClicked}
              />
            </ul>
          </div>

          {/* Display testimonial content */}
          {testimonials[1] && (
            <>
              <Modal show={modalShow} size="lg" onClose={onCloseModal} popup>
                <Modal.Header className="py-4 px-4">Update Testimonials</Modal.Header>
                <Modal.Body>
                  <div className="space-y-6">
                    <div id="fileUpload" className="max-w-md">
                      <div className="mb-2 block">
                        <Label htmlFor="file" value="Upload Photo" />
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
                        <Label htmlFor="text" value="Name" />
                      </div>
                      <TextInput
                        color={"primary"}
                        id="text"
                        type="text"
                        value={updateTestName}
                        placeholder="Enter Name"
                        onChange={(e) => setUpdateTestName(e.target.value)}
                        required
                        rightIcon={MdEdit}
                      />
                    </div>
                    <div className="max-w-md">
                      <div className="mb-2 block">
                        <Label htmlFor="text" value="Feedback" />
                      </div>
                      <TextInput
                        color={"primary"}
                        id="text"
                        type="text"
                        value={updateFeedback}
                        placeholder="Enter Feedback"
                        onChange={(e) => setUpdateFeedback(e.target.value)}
                        required
                        rightIcon={MdEdit}
                      />
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer className='flex flex-col gap-3'>
                  <Button
                  color='failure'
                    onClick={handleDeleteTestimonial}
                    className="w-full"
                  >
                    Delete
                  </Button>
                  <Button
                    color={"primary"}
                    onClick={handleUpdateTestimonial}
                    className="w-full"
                  >
                    Update
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Add New Testimonial Modal */}
              <Modal show={addModalShow} size="lg" onClose={onCloseAddModal} popup>
                <Modal.Header className="py-4 px-4">Add New Testimonial</Modal.Header>
                <Modal.Body>
                  <div className="space-y-6">
                    <div id="fileUpload" className="max-w-md">
                      <div className="mb-2 block">
                        <Label htmlFor="file" value="Upload Photo" />
                      </div>
                      <FileInput
                        id="fileUpload"
                        accept=".jpg, .jpeg, .png, .img"
                        onChange={handleFileChange2}
                        helperText="Upload a Logo (img, jpg, jpeg, png)"
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
                        value={newTestName}
                        placeholder="Enter Name"
                        onChange={(e) => setNewTestName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="max-w-md">
                      <div className="mb-2 block">
                        <Label htmlFor="text" value="Feedback" />
                      </div>
                      <TextInput
                        color={"primary"}
                        id="text"
                        type="text"
                        value={newFeedback}
                        placeholder="Enter Feedback"
                        onChange={(e) => setNewFeedback(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer className='flex flex-col gap-3'>
                  <Button
                    color={"primary"}
                    onClick={handleAddTestimonial}
                    className="w-full"
                  >
                    <FaPlus size={20} />Add
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Testimonial content */}
              <h1 className="h-[4.5rem] w-[100%] text-3xl font-[500] max800:text-[1.4rem] text-center text-white flex items-center justify-center">
                {testimonials[1].name}
              </h1>
              <div className="flex relative z-2 object-cover justify-center max1050:pl-8 max1050:pr-8">
                <h2
                  className="text-[1rem] z-2 pt-4 w-[50rem] max478:text-[0.75rem] text-center font-sans text-white"
                  style={{
                    letterSpacing: '1.6px',
                  }}
                >
                  <span className="text-[1.4rem]">"</span>
                  {testimonials[1].description}
                  <span className="text-[1.4rem]">"</span>
                </h2>
              </div>
            </>
          )}

          <div className="flex justify-center item-center mt-1">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
                className="h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] max406:h-[1rem]"
                alt=""
              />
            ))}
          </div>

          {isAdmin && (
            <div className="flex justify-center items-center gap-5">
              <Button
                style={{
                  backgroundColor: InstitutionData.PrimaryColor,
                }}
                className="p-0 m-0 mt-3 border-0 hover:border-0"
                onClick={() => setAddModalShow(true)} // Open the add testimonial modal
              >
                <div className="flex gap-2 justify-center items-center">
                  <FaPlus size={20} />Add New
                </div>
              </Button>
              <Button
                style={{
                  backgroundColor: InstitutionData.PrimaryColor,
                }}
                className="p-0 m-0 mt-3 border-0 hover:border-0"
                onClick={() => handleEditClick(1)} // Select the second testimonial (index 1)
              >
                <div className="flex gap-2 justify-center items-center">
                  <MdEdit size={16} />
                  Edit
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
