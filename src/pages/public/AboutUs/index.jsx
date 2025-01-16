import React, { use, useContext, useState,useEffect } from "react";
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import Context from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import InstitutionContext from "../../../Context/InstitutionContext";
import TextEditor from "../../../common/DataDisplay/staticPageData";
import { MdModeEditOutline } from "react-icons/md";

const AboutUs = () => {
  const institutionData = useContext(InstitutionContext)?.institutionData;
  const navigate = useNavigate();
  const [data, setData] = useState(institutionData.AboutUs);
  const { isAuth, userData: UserCtx } = useContext(Context);
  const [editing, setEditing] = useState(false);

  const handleButtonClick = () => {
    if (isAuth) {
      // If user is already authenticated, redirect to dashboard
      navigate("/dashboard");
    } else {
      // If user is not authenticated, redirect to signup
      navigate("/SignUp");
    }
  };

  const removeTagsIfAny = (content) => {
    return content.replace(/<[^>]*>?/gm, "");
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
          {!editing === true ? (
            data.map((item, index) => (
              <div key={index} className="w-full ml-5 max850:ml-0">
                {index === 0 ? (
                  <h1 className="text-center text-[4rem] font-bebas-neue">
                    {removeTagsIfAny(item.title)}
                  </h1>
                ) : (
                  <h4 className="text-[1.2rem] max450:text-[1rem] text-left mt-8 font-bold w-full">
                    {removeTagsIfAny(item.title)}
                  </h4>
                )}
                {item.content && (
                  <p className="text-justify mt-8 sm:ml-0 ml-5 mr-5">
                    {removeTagsIfAny(item.content)}
                  </p>
                )}
                {item.additionalContent1 && (
                  <p className="text-justify mt-2">
                    {removeTagsIfAny(item.additionalContent1)}
                  </p>
                )}
                {item.additionalContent2 && (
                  <p className="text-justify mt-2">
                    {removeTagsIfAny(item.additionalContent2)}
                  </p>
                )}
              </div>
            ))
          ) : (
            <TextEditor
              data={institutionData.AboutUs}
              setEditing={setEditing}
              setData={setData}
            />
          )}
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
        {editing !== true && (
          <div
            className="fixed bottom-5 right-5 bg-primaryColor p-3 rounded-full cursor-pointer"
            onClick={() => setEditing(!editing)}
          >
            <MdModeEditOutline className="text-white text-xl lg:text-2xl" />
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
