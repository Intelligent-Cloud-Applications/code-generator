import React, { useState } from "react";

const AboutInstructor = ({ aboutText }) => {
  return (
    <p className="text-gray-700 text-base md:text-lg italic break-words md:pr-5 lg:pr-6">
        {`"${aboutText}"`}
    </p>
  );
};

export default AboutInstructor;
