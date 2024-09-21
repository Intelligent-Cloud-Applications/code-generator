import React, { useContext } from "react";
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import Context from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import InstitutionContext from "../../../Context/InstitutionContext";

const AboutUs = () => {
  const institutionData = useContext(InstitutionContext)?.institutionData;
  const navigate = useNavigate();
  const { isAuth } = useContext(Context);

  const handleButtonClick = () => {
    if (isAuth) {
      // If user is already authenticated, redirect to dashboard
      navigate("/dashboard");
    } else {
      // If user is not authenticated, redirect to signup
      navigate("/SignUp");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center">
        <div className="w-[82vw] mt-[2rem]">
          <div className="flex justify-center items-center">
            <h1
              className="text-[3rem] max600:text-[2rem] font-bold text-center text-white rounded-lg px-4 py-2 monserrat-bold"
              style={{ backgroundColor: institutionData.PrimaryColor }}
            >
              About Us
            </h1>
          </div>
          {institutionData?.AboutUs.map((item, index) => (
            <div key={index} className="w-full sm:ml-0 ml-5">
              {index === 0 ? (
                <h1 className="text-center text-[4rem] font-bebas-neue">
                  {item.title}
                </h1>
              ) : (
                <h4 className="text-[1.2rem] max450:text-[1rem] text-left mt-8 font-bold w-full">
                  {item.title}
                </h4>
              )}
              {item.content && (
                <p className="text-justify mt-8 sm:ml-0 ml-5 mr-5">
                  {item.content}
                </p>
              )}
              {item.additionalContent1 && (
                <p className="text-justify mt-2">{item.additionalContent1}</p>
              )}
              {item.additionalContent2 && (
                <p className="text-justify mt-2">{item.additionalContent2}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-5">
          <button
            className="w-[15rem] text-white px-12 py-2 rounded-[8px] mb-4 h-[3rem] text-[1.2rem] tracking-[0.8px]"
            style={{
              backgroundColor: institutionData?.LightPrimaryColor,
            }}
            onClick={handleButtonClick}
          >
            {isAuth ? "Dashboard" : "Sign Up Now"}
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
