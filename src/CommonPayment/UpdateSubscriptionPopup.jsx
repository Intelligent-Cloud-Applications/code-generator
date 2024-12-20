import React, { useContext, useState, useEffect } from 'react';
import InstitutionContext from '../Context/InstitutionContext';
import Select from 'react-select';
import Popup from 'reactjs-popup';
import colors from '../color.json';

const UpdateSubscriptionPopup = ({
  isEditPopupOpen,
  onClose,
  handleSubmit,
  handleInputChange,
  handleProvideChange,
  handleAddProvide,
  handleRemoveProvide,
  formData,
  institution,
  providesContainerRef,
  handleMoveUp,
  handleMoveDown, handleDeleteSubscription
}) => {
  const color = colors[institution];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClassTypes, setSelectedClassTypes] = useState([]);
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const classTypeOptions = InstitutionData.ClassTypes.map((classType) => ({
    value: classType,
    label: classType,
  }));



  useEffect(() => {
    if (formData.classType) {
      const selectedOptions = formData.classType.map((type) => ({
        value: type,
        label: type,
      }));
      setSelectedClassTypes(selectedOptions);
    }
  }, [formData.classType]);

  // Handle class type change
  const handleClassTypeChange = (selectedOptions) => {
    setSelectedClassTypes(selectedOptions); // Update selected options state
    const selectedValues = selectedOptions.map((option) => option.value); // Extract values
    handleInputChange({
      target: { name: 'classType', value: selectedValues }, // Update formData
    });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      {isEditPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Popup open={isEditPopupOpen} closeOnDocumentClick onClose={onClose}>
            <div className="popup-container">
              <div
                className="popup-content bg-white rounded-lg shadow-md mt-8 "
                onClick={(e) => e.stopPropagation()}

              >
                <div
                  className="popup-header flex justify-between items-center rounded-t-lg p-4"
                  style={{ background: color.primary }}
                >
                  <h2 className="popup-title text-lg font-bold text-white">
                    Update Subscription
                  </h2>
                </div>
                <button
                  className="close-button absolute top-4 right-0 m-8 w-8 h-8 font-bold text-[20px] flex items-center justify-center rounded-full text-white"
                  style={{ background: color.primary }}
                  onClick={onClose}
                >
                  &times;
                </button>
                <div className="popup-body p-8 md:w-[350px]">
                  <form onSubmit={(e) => {
                    handleSubmit(e);
                  }}>
                    <div className="mb-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Heading
                      </label>
                      <input
                        type="text"
                        name="heading"
                        value={formData.heading}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    {/* Multi-Select Class Type Dropdown */}
                    <div className="flex flex-col mb-2">
                      <label className="font-[500] ml-1">Class Types</label>
                      <Select
                        isMulti
                        options={classTypeOptions} // Use transformed options
                        value={selectedClassTypes} // Controlled component
                        onChange={handleClassTypeChange}
                        placeholder="Select Class Type(s)"
                        className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-1 relative">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Duration
                      </label>
                      <select
                        name="durationText"
                        value={formData.durationText}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onClick={handleDropdownToggle} // Toggle dropdown state on click
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 mt-8 pointer-events-none">
                        <svg
                          className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} // Rotate SVG based on dropdown state
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          {/* <path
                            fillRule="evenodd"
                            d="M5.292 7.292a1 1 0 011.416 0L10 10.586l3.292-3.294a1 1 0 111.416 1.416l-4 4a1 1 0 01-1.416 0l-4-4a1 1 0 010-1.416z"
                            clipRule="evenodd"
                          /> */}
                        </svg>
                      </span>
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Provides
                      </label>
                      <div className="max-h-10 overflow-y-auto" ref={providesContainerRef}>
                        {formData.provides.map((provide, index) => (
                          <div key={index} className="flex mb-2 items-center">
                            <span className="mr-2 text-gray-700 text-sm font-bold">
                              {index + 1}.
                            </span>
                            <input
                              type="text"
                              value={provide}
                              onChange={(e) =>
                                handleProvideChange(index, e.target.value)
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <button
                              type="button"
                              className="ml-2 text-red-500 font-bold"
                              onClick={() => handleRemoveProvide(index)}
                            >
                              &times;
                            </button>
                            <div className="flex">
                              <button
                                type="button"
                                className="ml-2 text-gray-500 font-bold text-lg"
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                              >
                                &#8593;
                              </button>
                              <button
                                type="button"
                                className="ml-2 text-gray-500 font-bold text-lg"
                                onClick={() => handleMoveDown(index)}
                                disabled={index === formData.provides.length - 1}
                              >
                                &#8595;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {formData.provides.length < 3 && (
                        <div className="flex items-center justify-center mt-1">
                          <button
                            type="button"
                            onClick={handleAddProvide}
                            className="text-white font-bold py-2 text-[14px] px-[1rem] rounded focus:outline-none focus:shadow-outline"
                            style={{ background: color.primary }}
                          >
                            Add Provide
                          </button>
                        </div>
                      )}
                      {formData.provides.length > 2 && (<div className='h-6'></div>)}
                    </div>
                    <div className="flex items-center justify-center mt-4 gap-1">
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline text-[14px] w-full"

                        onClick={handleDeleteSubscription}

                        style={{ background: color.primary }}
                      >
                        Delete Product
                      </button>
                      <button
                        type="submit"

                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline text-[14px] w-full"
                        style={{
                          background: color.primary,
                        }}
                      >
                        Update Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Popup>  </div>
      )}
    </>
  );
};

export default UpdateSubscriptionPopup;
