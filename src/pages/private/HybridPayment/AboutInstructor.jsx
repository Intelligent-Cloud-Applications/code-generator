import React, { useState } from "react";

const AboutInstructor = ({ aboutText }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300; // Maximum number of characters to show before truncating

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  console.log(aboutText)

  return (
    <p className="text-gray-700 text-base md:text-lg italic break-words overflow-hidden">
      {isExpanded || aboutText?.length <= maxLength
        ? `"${aboutText}"`
        : `"${aboutText?.slice(0, maxLength)}..."`}
      {aboutText?.length > maxLength && (
        <button
          onClick={toggleExpanded}
          className="text-blue-500 ml-2 underline focus:outline-none"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </p>
  );
};

export default AboutInstructor;
