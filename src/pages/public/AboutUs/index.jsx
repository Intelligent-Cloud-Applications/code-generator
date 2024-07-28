// Packages
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Contexts
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";

// Components
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import { PrimaryButton } from "../../../common/Inputs";

// Code
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
    <div>
      <NavBar />
      <div className="flex flex-col items-center justify-center">
        <div className="w-[82vw] mt-4">
          <h1 className="nor sans-serif text-[4rem] text-centerr">
            About Us
          </h1>
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
        <div className="flex justify-center mt-5 w-[10rem] mb-4">
          <PrimaryButton
            classes="w-[15rem] h-[3rem]"
            onClick={handleButtonClick}
          >
            {isAuth ? "Dashboard" : "Sign Up Now"}
          </PrimaryButton>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
