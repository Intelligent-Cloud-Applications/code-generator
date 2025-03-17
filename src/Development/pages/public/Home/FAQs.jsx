import React, { useState, useContext } from "react";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import { API } from "aws-amplify";
import { toast } from "react-toastify";
import "./FAQ.css";
import Faq from "react-faq-component";
import { GrEdit } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { Modal, Button } from "flowbite-react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function FAQ() {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";

  const { institutionData, setInstitutionData } = useContext(InstitutionContext);
  const [editingIndex, setEditingIndex] = useState(null);
  const [faqData, setFaqData] = useState(institutionData?.FAQ || []);
  const [newFaq, setNewFaq] = useState({ title: "", content: "" });
  const { PrimaryColor } = InstitutionData;

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleChange = (index, field, value) => {
    const updatedFaq = [...faqData];
    updatedFaq[index][field] = value;
    setFaqData(updatedFaq);
  };

  const handleSave = async () => {
    try {
      await API.put("main", "/admin/update-static-data", {
        body: {
          institutionid: institutionData.InstitutionId,
          field: "FAQ",
          value: faqData,
        },
      });
      setInstitutionData({ ...institutionData, FAQ: faqData });
      toast.success("FAQ updated successfully");
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleAddFaq = async () => {
    if (!newFaq.title.trim() || !newFaq.content.trim()) {
      toast.error("Title and content cannot be empty!");
      return;
    }

    const updatedFaqData = [...faqData, newFaq];
    try {
      await API.put("main", "/admin/update-static-data", {
        body: {
          institutionid: institutionData.InstitutionId,
          field: "FAQ",
          value: updatedFaqData,
        },
      });
      setInstitutionData({ ...institutionData, FAQ: updatedFaqData });
      setFaqData(updatedFaqData);
      setNewFaq({ title: "", content: "" });
      toast.success("New FAQ added successfully");
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error("Failed to add FAQ");
    }
  };

  const handleDeleteModalOpen = (index) => {
    setDeleteIndex(index);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteIndex(null);
    setOpenDeleteModal(false);
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;

    const updatedFaqData = faqData.filter((_, i) => i !== deleteIndex);

    try {
      await API.put("main", "/admin/update-static-data", {
        body: {
          institutionid: institutionData.InstitutionId,
          field: "FAQ",
          value: updatedFaqData,
        },
      });

      setFaqData(updatedFaqData);
      setInstitutionData((prev) => ({ ...prev, FAQ: updatedFaqData }));

      toast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
    }

    handleDeleteModalClose();
  };

  // Toggle expand/collapse
  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="home-faq flex flex-col items-center justify-center gap-20 max800:py-[10rem]">
      <div className="flex flex-col max800:px-[5rem]">
        <h2 className="text-5xl font-bold">FAQs</h2>
      </div>

      {isAdmin && (
        <div className="w-[75vw] flex flex-col">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item border-b p-4">
              {editingIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={faq.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    className="border p-2 w-full mb-2"
                  />
                  <textarea
                    value={faq.content}
                    onChange={(e) => handleChange(index, "content", e.target.value)}
                    className="border p-2 w-full"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={handleSave}
                      className="mt-2 px-4 py-2 text-white rounded"
                      style={{ backgroundColor: PrimaryColor }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="mt-2 px-4 py-2 text-black rounded bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{faq.title}</h3>
                    <button
                      onClick={() => handleToggleExpand(index)}
                      className="text-gray-600"
                    >
                      {expandedIndex === index ? (
                        <IoIosArrowUp size={20} />
                      ) : (
                        <IoIosArrowDown size={20} />
                      )}
                    </button>
                  </div>
                  {expandedIndex === index && (
                    <p className="text-gray-600 mt-2">{faq.content}</p>
                  )}
                  <div className="faq-icons flex gap-4 mt-2">
                    <button onClick={() => handleEdit(index)}>
                      <GrEdit size={20} style={{ color: PrimaryColor }} />
                    </button>
                    <button onClick={() => handleDeleteModalOpen(index)}>
                      <MdDeleteOutline size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isAdmin && (
        <Faq
          data={{ rows: faqData }}
          styles={{
            bgColor: "#ffffff",
            rowTitleColor: "#000",
            rowContentColor: "#555555",
            arrowColor: "#000",
          }}
          config={{ animate: true, tabFocus: true }}
        />
      )}

      {/* Delete Modal */}
      <Modal show={openDeleteModal} onClose={handleDeleteModalClose}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this FAQ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete} color="failure">
            Delete
          </Button>
          <Button onClick={handleDeleteModalClose} color="gray">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
