import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs'
import './Testimonial.css'
import InstitutionContext from '../../../Context/InstitutionContext';
import Context from "../../../Context/Context";
import { MdEdit } from "react-icons/md";
import { Button, Modal, FileInput, Label, TextInput } from "flowbite-react";
// import { FaPlus, FaTimes } from "react-icons/fa";


const Testimonial = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData
  const testiData = InstitutionData.Testimonial.map((val) => ({
    name: val.name,
    description: val.description,
    src: val.img
  }))

  const [testimonials, setTestimonials] = useState(testiData)
  const [inView, setInView] = useState(false);
  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";
  const [modalShow, setModalShow] = useState(false);
  // const [addTestimonial, setAddTestimonial] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newTestName, setNewTestName] = useState("");
  const [newFeedback, setNewFeedback] = useState("");


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.01 } // Adjust threshold as needed
    )

    // Observe the element
    const element = document.getElementById('testimonial-section')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const leftClicked = () => {
    setTestimonials((testi) => {
      const tempTesti = [...testi]
      const firstTesti = tempTesti.pop()
      tempTesti.unshift(firstTesti)
      return tempTesti
    })
  }

  const rightClicked = () => {
    setTestimonials((testi) => {
      const tempTesti = [...testi]
      const lastTesti = tempTesti.shift()
      tempTesti.push(lastTesti)
      return tempTesti
    })
  }

  const onCloseModal = () => {
    setModalShow(false);
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

  // const handleCancel = () => {
  //   setAddTestimonial(false);
  //   setNewTestName("");
  //   setNewFeedback("");
  // };

  return (
    <div
      id="testimonial-section"
      className={`font-sans min-h-screen`}
    >
      <div
        className={`py-[0.2rem] flex flex-col item-center bg-black h-full min-h-screen`}
        style={{
          backgroundImage: inView
            ? `url(${InstitutionData.TestimonialBg})`
            : 'none',
          backgroundSize: 'cover'
        }}
      >
        <h1
          className={`text-white text-4xl text-center font-[500] max800:text-[1.5rem] py-8 max800:py-2`}
        >
          TESTIMONIAL
        </h1>
        <div className={``}>
          <div className={``}>
            <ul className={`feedback`}>
              <div
                className={`absolute w-screen flex justify-center flex-col`}
              ></div>
              {testimonials.map((test, i) => (
                <li key={i}>
                  {inView && (
                    <img
                      src={test.src}
                      alt=""
                      className={`ecllip${i + 2}`}
                      loading="lazy" // Lazy load images
                    />
                  )}
                </li>
              ))}
              <BsArrowLeftCircle
                color="white"
                size={'2rem'}
                className={`absolute left-16 cursor-pointer max536:left-6 max500:left-2 max406:h-[1.5rem]`}
                onClick={leftClicked}
              />
              <BsArrowRightCircle
                color="white"
                size={'2rem'}
                className={`absolute right-16 cursor-pointer max536:right-6 max500:right-2 max406:h-[1.5rem]`}
                onClick={rightClicked}
              />
            </ul>
          </div>
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
                        value={testimonials[1].name}
                        placeholder="Enter Name"
                        onChange={(e) => setNewTestName(e.target.value)}
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
                        value={testimonials[1].description}
                        placeholder="Enter Feedback"
                        onChange={(e) => setNewFeedback(e.target.value)}
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
              <h1
                className={`h-[4.5rem] w-[100%] text-3xl font-[500] max800:text-[1.4rem] text-center text-white flex items-center justify-center`}
              >
                {testimonials[1].name}
              </h1>
              <div
                className={`flex relative z-2 object-cover justify-center max1050:pl-8 max1050:pr-8`}
              >
                <h2
                  className={`text-[1rem] z-2 pt-4 w-[50rem] max478:text-[0.75rem] text-center font-sans text-white`}
                  style={{
                    letterSpacing: '1.6px'
                  }}
                >
                  {testimonials[1].description[0] === '"' &&
                    (testimonials[1].description = testimonials[1].description.slice(0, testimonials[1].description.length - 1))}
                  <span className={`text-[1.4rem]`}>"</span>
                  {testimonials[1].description}
                  <span className={`text-[1.4rem]`}>"</span>
                </h2>
              </div>
            </>
          )}
          <div className={`flex justify-center item-center mt-1`}>
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
                className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] max406:h-[1rem]`}
                alt=""
              />
            ))}
          </div>
          {isAdmin && (
            <div className='flex justify-center items-center'>
              <Button
                style={{
                  backgroundColor: InstitutionData.PrimaryColor
                }}
                className="p-0 m-0 mt-3 border-0 hover:border-0"
                onClick={() => setModalShow(true)}
                afterClick="boder-0"
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
  )
}

export default Testimonial
