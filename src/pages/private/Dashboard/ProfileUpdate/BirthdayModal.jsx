import React, { useState, useEffect, useContext, useRef } from "react";
import { Modal } from "flowbite-react"; // Import Flowbite Modal
import BirthdayCard from "./BirthdayCard"; // Your BirthdayCard component
import Context from "../../../../Context/Context";

const BirthdayModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const UserCtx = useContext(Context).userData;
  let dob = UserCtx.dob;
  let age = useRef(0);

  const claculateAge = (dob) => {
    let today = new Date();
    let birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const dateOfBirthChangeFormat=(date)=> {
    let dob = date.split("-");
    dob.shift();
    dob = dob.join("-");
    return dob;
  }
  age = claculateAge(dob);
  dob = dateOfBirthChangeFormat(dob);
  useEffect(() => {
    // Compare the date of birth with the current date
    
    let today = new Date().toLocaleDateString().split("/");
    today.pop();
    today.map((date, index) => {
      if (date.length === 1) {
        today[index] = "0" + date;
      }
    });
    today = today.join("-");
    if (dob === today) {
      setOpenModal(true);
    }
  }, [dob]);

  return (
    <>
      {/* Flowbite Modal */}
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="xl"
        position="center"
      >
        <Modal.Header>🎉Wishing You Birthday 🎂</Modal.Header>
        <Modal.Body>
          {/* Display the BirthdayCard in the modal */}
          <BirthdayCard userName={UserCtx.userName} age={age}/>
        </Modal.Body>
        {/* <Modal.Footer>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setOpenModal(false)}
          >
            Close
          </button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default BirthdayModal;
