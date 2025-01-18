import React, { useState } from "react";

const AboutInstructor = ({ aboutText }) => {
  return (
    <span className="text-gray-700 text-base md:text-lg italic break-words overflow-hidden whitespace-pre-line text-justify will-change-contents leading-tight sm:leading-snug md:leading-normal tracking-normal">
      "{aboutText}"
    </span>
  );
};

export default AboutInstructor;
