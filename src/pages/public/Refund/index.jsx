import React, { useContext } from "react";
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import "./Refund.css";
import InstitutionContext from "../../../Context/InstitutionContext";
const Terms = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;

  return (
    <>
      <NavBar />
      <div className={`flex flex-col items-center w-full pb-[5rem]`}>
        <div
          className={` text-justify flex flex-col items-center  w-100 h-100 p-0 overflow-x-hidden w-[90vw] max-w-[80rem]`}
        >
          <h4
            className={`text-[1.2rem] max450:text-[1rem] text-left font-bold w-full sm:ml-0 ml-5 `}
          >
            {InstitutionData.src_pages_Refund__Heading_2}
          </h4>
          <p className={`mt-8 sm:ml-0 ml-5 mr-5`}>
            {InstitutionData.src_pages_Refund__Content_2}
          </p>
          {InstitutionData.Refund.map((refund, index) => {
            return (
              <>
                <h4
                  className={`text-[1.2rem] max450:text-[1rem] text-left mt-8 font-bold w-full sm:ml-0 ml-5 `}
                >
                  {refund.heading}
                </h4>
                <>
                  {refund.content.split("\n\n").map((para, index) => (
                    <li>{para}</li>
                  ))}
                </>
              </>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
