import React, { useContext } from "react";
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import InstitutionContext from "../../../Context/InstitutionContext";

const Terms = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  return (
    <>
      <NavBar />
      <div
        className={` text-justify flex flex-col items-center w-full pb-[5rem]`}
      >
        <div
          className={`flex flex-col items-center  mt-[2rem] p-0  w-[90vw] max-w-[80rem]`}
        >
          {InstitutionData.TermsData.map((item, index) => (
            <div key={index}>
              {index === 0 ? (
                <h1 className={`nor sans-serif text-[4rem] text-center`}>{item.title}</h1>
              ) : (
                <h4
                  className={`text-[1.2rem] text-left mt-8 font-bold w-full sm:ml-0 ml-5`}
                >
                  {item.title}
                </h4>
              )}
              {item.content && (
                <p className={`mt-8 sm:ml-0 ml-5 mr-5`}>{item.content}</p>
              )}
              {item.additionalContent1 && (
                <p className={`mt-2`}>{item.additionalContent1}</p>
              )}
              {item.additionalContent2 && (
                <p className={`mt-2`}>{item.additionalContent2}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
