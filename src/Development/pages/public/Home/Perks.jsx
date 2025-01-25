import React, { useContext, useEffect, useState } from "react";
import InstitutionContext from "../../../Context/InstitutionContext";
import Service from "../../../utils/images/Dance.png";
import { GrEdit } from "react-icons/gr";

const Perks = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const { PrimaryColor } = useContext(InstitutionContext).institutionData;
  const [services] = useState(InstitutionData.Services || []);

  return (
    <div className="w-full h-auto bg-[#E6F5F1] py-16 flex flex-col items-center">
      <div className="text-center mb-12">
        <h1
          className={`text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider`}
          style={{ color: PrimaryColor }}
        >
          Features
        </h1>
        <p className="text-gray-700 mt-2 text-lg">Our Features & Services.</p>
      </div>

      {/* Cards Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {services?.map((service, index) => (
          <div
            key={index}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden text-center flex flex-col items-center p-6 h-[470px]"
          >
            <button
              className={`absolute top-4 right-4 text-xl font-medium py-2 px-6`}
              style={{ color: PrimaryColor }}
            >
              <GrEdit />
            </button>

            <img className="w-60 h-60 mb-6" src={Service} alt={service.title} />
            <h2
              className={`font-semibold text-lg mb-2`}
              style={{ color: PrimaryColor }}
            >
              {service.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {service.description ||
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, reiciendis quaerat! Ipsa maxime numquam iusto obcaecati.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, reiciendis quaerat! Ipsa maxime numquam iusto obcaecati."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Perks;
