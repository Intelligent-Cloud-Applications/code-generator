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

  const { institutionData, setInstitutionData } =
    useContext(InstitutionContext);
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

  const handleSave = async (index) => {
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
    setEditingIndex(null); // Close the editing mode
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


  const data = {
    rows: institutionData.FAQ.map((row) => {
      if (row.content.includes("awsaiapp.com")) {
        const contentWithLink = row.content.replace(
          /awsaiapp.com/g,
          <a
            href="https://awsaiapp.com/"
            style="text-decoration: none; color: blue;"
            target="_blank"
            rel="noopener noreferrer"
          >
            awsaiapp.com
          </a>
        );
        return { ...row, content: contentWithLink };
      }
      return row;
    }),
  };

  const styles = {
    bgColor: "#ffffff",
    rowTitleColor: "#000",
    rowContentColor: "#555555",
    arrowColor: "#000",
  };

  const config = {
    animate: true,
    tabFocus: true,
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
      setInstitutionData({ ...institutionData, FAQ: updatedFaqData });
      setFaqData(updatedFaqData);
      toast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
    }
    handleDeleteModalClose();
  };

  const toggleFAQ = (index) => {
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
            <div key={index} className="border-b border-gray-200 py-2">
              {editingIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={faq.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                    className="border p-2 w-full mb-2"
                  />
                  <textarea
                    value={faq.content}
                    onChange={(e) =>
                      handleChange(index, "content", e.target.value)
                    }
                    className="border p-2 w-full"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => handleSave(index)}
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
                <div className="relative flex flex-col md:flex-row items-start justify-between py-3 px-4">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800 pr-8">
                        {faq.title}
                      </h3>
                      <div className="flex items-center absolute right-4">
                        {/* Edit and Delete buttons - visible only when expanded */}
                        {expandedIndex === index && (
                          <div className="flex gap-3 transition-all duration-200">
                            <button
                              onClick={() => handleEdit(index)}
                              className="hover:scale-110 transition-transform focus:outline-none"
                              style={{ color: PrimaryColor }}
                            >
                              <GrEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteModalOpen(index)}
                              className="hover:scale-110 transition-transform text-red-500"
                            >
                              <MdDeleteOutline size={18} />
                            </button>
                          </div>
                        )}
                        {/* Expand/Collapse button with smooth rotation */}
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="ml-4 transition-transform duration-300"
                          style={{ 
                            transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                          }}
                        >
                          <IoIosArrowDown size={20} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                    {/* Content with smooth height transition */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out`}
                      style={{
                        maxHeight: expandedIndex === index ? '500px' : '0',
                        opacity: expandedIndex === index ? 1 : 0,
                        marginTop: expandedIndex === index ? '0.5rem' : '0'
                      }}
                    >
                      <p className="text-base text-gray-600 leading-relaxed">
                        {faq.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Improved Add FAQ Section */}
          <div className="flex flex-col py-3 mt-4 border rounded-lg bg-white shadow-sm px-3">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New FAQ</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="faq-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  id="faq-title"
                  type="text"
                  placeholder="Enter your question here"
                  value={newFaq.title}
                  onChange={(e) =>
                    setNewFaq((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="border p-2 w-full rounded-md shadow-sm focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all"
                />
              </div>
              <div>
                <label htmlFor="faq-content" className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  id="faq-content"
                  placeholder="Enter your answer here"
                  value={newFaq.content}
                  onChange={(e) =>
                    setNewFaq((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows="3"
                  className="border p-2 w-full rounded-md shadow-sm focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all resize-none"
                />
              </div>
              <div className="flex justify-end pt-3">
                <button
                  onClick={handleAddFaq}
                  className="px-4 py-2 text-white rounded-md transition-all hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: PrimaryColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              Are you sure you want to delete this FAQ?
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

      {!isAdmin && <Faq data={data} styles={styles} config={config} />}
    </div>
  );
}