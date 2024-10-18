import React, { useState, useEffect, useContext, useRef } from "react";
import { Modal } from "flowbite-react"; // Import Flowbite Modal
import BirthdayCard from "./BirthdayCard"; // Your BirthdayCard component
import Context from "../../../../Context/Context";

const BirthdayModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const UserCtx = useContext(Context).userData;
  let dob = UserCtx?.dob;

  const dateOfBirthChangeFormat = (date) => {
    let dob = date.split("-");
    dob.shift();
    dob = dob.join("-");
    return dob;
  };
  dob = dateOfBirthChangeFormat(dob);

  useEffect(() => {
    // Compare the date of birth with the current date
    let today = new Date().toLocaleDateString().split("/");
    today.pop();
    today =  today.map((date, index) => {
      if (date.length === 1) {
        return "0" + date;
      }
      return date;
    });
    today = today.join("-");

    // Check if the modal has been shown before
    const modalShown = localStorage.getItem("birthdayModalShown");
    const modalShownDate = localStorage.getItem("birthdayModalShownDate");

    // If the stored date is different from today, remove the key
    if (modalShownDate && modalShownDate !== today) {
      localStorage.removeItem("birthdayModalShown");
      localStorage.removeItem("birthdayModalShownDate");
    }

    if (dob === today && !modalShown) {
      setOpenModal(true);
      localStorage.setItem("birthdayModalShown", "true");
      localStorage.setItem("birthdayModalShownDate", today);
    }
  }, [UserCtx?.dob]);

  if (!dob) return null;

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
          <BirthdayCard userName={UserCtx.userName}/>
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
