import React, { useState, useContext } from "react";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import { API } from "aws-amplify";
import { toast } from "react-toastify";
import "./FAQ.css";
import Faq from "react-faq-component";
import { GrEdit } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai"; // Importing Plus Icon

export default function FAQ() {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const UserCtx = useContext(Context);
  const isAdmin = UserCtx.userData.userType === "admin";

  const { institutionData, setInstitutionData } =
    useContext(InstitutionContext);
  const [editingIndex, setEditingIndex] = useState(null);
  const [faqData, setFaqData] = useState(institutionData?.FAQ || []);
  const [newFaq, setNewFaq] = useState({ title: "", content: "" }); // State for adding new FAQ
  const { PrimaryColor } = InstitutionData;

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

  const handleDelete = async (index) => {
    const updatedFaqData = faqData.filter((_, i) => i !== index);
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

  return (
    <div className="home-faq flex flex-col items-center justify-center gap-20 max800:py-[10rem]">
      <div className="flex flex-col max800:px-[5rem]">
        <h2 className="text-5xl font-bold">FAQs</h2>
      </div>

      {isAdmin && (
        <div className="w-[75vw] flex flex-col">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b py-4">
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
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-4">
                  <div className="w-full md:w-auto">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {faq.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{faq.content}</p>
                  </div>

                  {/* Edit Button - Top Right */}
                  <button
                    onClick={() => handleEdit(index)}
                    className="absolute top-1 right-4 hover:scale-110 transition-transform focus:outline-none"
                    style={{ color: PrimaryColor }}
                  >
                    <GrEdit size={20} />
                  </button>

                  {/* Delete Button - Bottom Right */}
                  <button
                    onClick={() => handleDelete(index)}
                    className="absolute bottom-1 right-4 hover:scale-110 transition-transform text-red-500"
                  >
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add FAQ Section */}
          <div className="flex flex-col border-t py-4 mt-6">
            <h3 className="text-xl font-semibold mb-4">Add New FAQ</h3>
            <input
              type="text"
              placeholder="Title"
              value={newFaq.title}
              onChange={(e) =>
                setNewFaq((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Content"
              value={newFaq.content}
              onChange={(e) =>
                setNewFaq((prev) => ({ ...prev, content: e.target.value }))
              }
              className="border p-2 w-full"
            />
    
            <div className="flex justify-end gap-4">
                    <button
                      onClick={handleAddFaq}
                      className="mt-2 px-4 py-2 text-white rounded"
                      style={{ backgroundColor: PrimaryColor }}
                    >
                      Save
                    </button>
                    {/* <button
                      onClick={handleCancel}
                      className="mt-2 px-4 py-2 text-black rounded bg-gray-200"
                    >
                      Cancel
                    </button> */}
                  </div>

          </div>
        </div>
      )}

      {!isAdmin && <Faq data={data} styles={styles} config={config} />}
    </div>
  );
}
