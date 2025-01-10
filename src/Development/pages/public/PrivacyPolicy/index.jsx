import React, { useContext } from "react";
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import InstitutionContext from "../../../Context/InstitutionContext";

const PrivacyPolicy = () => {
  const institutionData = useContext(InstitutionContext)?.institutionData;

  // Function to convert URLs to hyperlinks
  const convertLinks = (text) => {
    const urlRegex = /(www\.happyprancer\.com)/g;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href="https://happyprancer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center flex-col mb-8">
        <div className="w-[82vw] mt-[1.5rem]">
          <h1 className="nor sans-serif text-[4rem] text-center">
            Privacy Policy
          </h1>
          {institutionData?.PrivacyPolicy.map((item, index) => (
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
                <div className="text-justify mt-8 sm:ml-0 ml-5 mr-5">
                  {item.title === "Contact Us" ? (
                    item.content.split("\n").map((line, i) => (
                      <p key={i} className="mt-2">
                        {convertLinks(line)}
                      </p>
                    ))
                  ) : (
                    <p>{convertLinks(item.content)}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PrivacyPolicy;
