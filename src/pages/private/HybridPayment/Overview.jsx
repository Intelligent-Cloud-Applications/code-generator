import PropTypes from "prop-types";
import { useContext } from "react";
import discount from "./discount.svg"
import React from "react";
import InstitutionContext from "../../../Context/InstitutionContext";
import "./SubscriptionCard.css";

export const Overview = ({
  className,
  insertYourImage = "insert-your-image-here.png",
  img = "image.png",
}) => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  // console.log(InstitutionData)
  return (
    <>
      <div className="absolute -right-9 z-0 opacity-70 hidden lg:block">
        <div
          className="blur-[96px] rounded-full"
          style={{
            width: "450px",
            height: "1581px",
            background: `radial-gradient(
        circle at 70% 50%,
        rgba(255, 255, 255, 0) 15%,
        rgba(34, 92, 89, 1) 50%,
        rgba(255, 255, 255, 0.53) 100%
      )`,
          }}
        ></div>
      </div>
      <div className="absolute -left-[32rem] opacity-70 z-0 hidden md:block">
        <div
          className="blur-[96px] rounded-full"
          style={{
            width: "963px",
            height: "1581px",
            background: `radial-gradient(
        circle at 20% 50%,
        rgba(255, 255, 255, 0) 15%,
        rgba(34, 92, 89, 1) 50%,
        rgba(255, 255, 255, 0.53) 100%
      )`,
          }}
        ></div>
      </div>
      <div className="mb-7">
        <h1
          className="text-3xl font-bold text-center mt-8 text-[3rem] mb-4 "
          style={{
            color: InstitutionData.PrimaryColor,
          }}
        >
          Overview
        </h1>
        <p className="text-[1rem] mt-2 px-4 w-2/3 mx-auto text-center font-[600]">
          Get a comprehensive look at our journey, values, and vision—your guide
          to what makes us unique.
        </p>
      </div>

      <div className="flex flex-wrap justify-evenly items-center space-y-8 md:space-y-0 md:space-x-4 z-10">
        {/* First Card */}
        <div className="w-[305px] sm:w-[312px] h-[289px] group">
          <div className="relative w-full sm:w-[306px] h-[234px] top-[42px] left-0 sm:left-1.5 transition-transform duration-300 ease-in-out transform group-hover:border-blue-400">
            {/* Black background layer with z-index to ensure it appears on hover */}
            <div className="absolute top-2.5 left-0 w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out border-black group-hover:bg-black group-hover:origin-bottom-right group-hover:rotate-12 z-10" />

            {/* Foreground layer */}
            <div
              className={`absolute top-0 left-1 border-[#651fff] w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out group-hover:border-blue-400 z-20`}
              style={{ backgroundColor: InstitutionData.PrimaryColor }}
            />

            {/* Text Content */}
            <div className="absolute top-[121px] left-[60px] font-semibold text-white text-2xl text-center leading-normal z-30">
              Master Instructors
            </div>
            <p className="absolute w-[85%] top-40 left-1/2 transform -translate-x-1/2 font-normal text-white text-sm sm:text-base text-center leading-6 z-30">
              We Have 15+ Professionally Trained Instructors
            </p>

            {/* Large Number */}
            <div className="absolute w-full top-[35px] left-1/2 transform -translate-x-1/2 text-white text-[60px] sm:text-[93px] font-normal text-center leading-none z-30">
              15+
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className={`w-[305px] sm:w-[316px] h-[302px] ${className} group`}>
          <div className="relative w-full sm:w-[305px] h-[234px] top-[55px] left-0 sm:left-[11px] transition-transform duration-300 ease-in-out transform group-hover:border-blue-600">
            <div className="absolute top-2.5 left-0 border-black w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out group-hover:bg-black group-hover:origin-bottom-right group-hover:rotate-12" />
            <div
              className="absolute top-0 left-[4%] sm:left-[19px] border-[#00e5ff] w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out group-hover:border-blue-400"
              style={{ backgroundColor: InstitutionData.PrimaryColor }}
            />

            <div className="absolute top-[121px] left-[80px] font-semibold text-white text-2xl text-center leading-normal">
              Active Members
            </div>
            <p className="absolute w-[85%] mx-auto top-40 left-8 font-normal text-white text-sm sm:text-base text-center leading-6">
              We currently have 230+ Pro Active Members
            </p>

            <div className="absolute flex items-start justify-center space-x-[-1.5rem] top-[34px] left-1/2 transform -translate-x-1/2 w-full">
              <img
                className="w-12 h-12 sm:w-[75.04px] sm:h-[75.04px] object-cover rounded-full"
                alt="Insert your image"
                src={
                  "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?q=80&w=1941&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
              />
              <img
                className="w-12 h-12 sm:w-[75.04px] sm:h-[75.04px] object-cover rounded-full"
                alt="Insert your image"
                src={
                  "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfDF8MHx8fDA%3D"
                }
              />
              <div
                className="w-12 h-12 sm:w-[77.04px] sm:h-[75.04px] rounded-full border-2 border-white flex items-center justify-center "
                style={{ backgroundColor: InstitutionData.PrimaryColor }}
              >
                <div className="text-white text-sm sm:text-lg font-bold">
                  230+
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Card */}
        <div className="w-[305px] sm:w-[312px] h-[289px] group">
          <div className="relative w-full sm:w-[306px] h-[234px] top-[55px] transition-transform duration-300 ease-in-out transform group-hover:border-blue-400">
            <div className="absolute top-2.5 left-0 border-[#000] w-full h-56 rounded-[19px] border border-solid group-hover:border-[#128fdd] transition-all duration-300 ease-in-out group-hover:bg-black group-hover:origin-bottom-right group-hover:rotate-12" />
            <div
              className="absolute top-0 left-1 border-[#128fdd] w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out group-hover:border-[#128fdd]"
              style={{ backgroundColor: InstitutionData.PrimaryColor }}
            />

            <div className="absolute top-[121px] left-1/2 transform -translate-x-1/2 text-center font-semibold text-white text-xl sm:text-2xl leading-normal">
              Genuine Price
            </div>
            <p className="absolute w-[85%] top-40 left-1/2 transform -translate-x-1/2 font-normal text-white text-sm sm:text-base text-center leading-6">
              We offer Best Quality Service At Reasonable Price
            </p>

            <img
              className="absolute w-[78px] h-[78px] top-[33px] left-[124px] transition-transform duration-300 ease-in-out transform group-hover:scale-110"
              alt="Discount store"
              src={discount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Overview.propTypes = {
  insertYourImage: PropTypes.string,
  img: PropTypes.string,
};