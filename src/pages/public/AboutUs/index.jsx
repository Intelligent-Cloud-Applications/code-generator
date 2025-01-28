// pages/AboutUs/AboutUs.jsx
import React, { useContext, useEffect, useState } from "react";
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import Context from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import InstitutionContext from "../../../Context/InstitutionContext";
import TextEditor from "../../../common/DataDisplay/TextEditor";
import "./AboutUs.css";
import { API } from "aws-amplify";
import {toast} from "react-toastify";

const AboutUs = () => {
  const institutionData = useContext(InstitutionContext)?.institutionData;
  const { productId } = useContext(InstitutionContext).institutionData;
  console.log("productId: "+ productId);
  const UserCtx = useContext(Context).userData;
  const navigate = useNavigate();
  const { isAuth } = useContext(Context);
  const [editing, setEditing] = useState(false);
  const util = useContext(Context).util;


  const [aboutUsContent, setAboutUsContent] = useState(
    institutionData?.AboutUs || ""
  );
  const [savedContent, setSavedContent] = useState(
    institutionData?.AboutUs || ""
  );

  console.log(aboutUsContent)

  const setPadding = () => {
    const tags = document.querySelectorAll("span");
    tags.forEach((tag) => {
      if (tag.style.backgroundColor) {
        tag.style.paddingTop = "4px";
        tag.style.paddingBottom = "4px";
        tag.style.paddingLeft = "7px";
        tag.style.paddingRight = "7px";
      }
    });
  };

  useEffect(() => {
    setPadding();

    const observer = new MutationObserver((mutations) => {  
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          setPadding();
        }
      });
    });

    return () => {
      setPadding();
    };
  }, [aboutUsContent]);

useEffect(() => {
  if (!institutionData?.AboutUs) return;
  let data = "";
  if (Array.isArray(institutionData.AboutUs)){
    data = Array.isArray(institutionData.AboutUs)
      ? institutionData.AboutUs.map((item) => {
          if (item.title || item.content) {
            return `<h2>${item.title||null}</h2><p>${item.content || null}</p>`;
          }
          return "";
        }).join("")
      : "";
  }
  else{
    data = institutionData.AboutUs;
  }

  setAboutUsContent(data);
  setSavedContent(data);
}, [institutionData.AboutUs]);

  const handleButtonClick = () => {
    if (isAuth) {
      navigate("/dashboard");
    } else {
      navigate("/SignUp");
    }
  };

  const handleSave = async () => {
    setSavedContent(aboutUsContent);
    try {
      util.setLoader(true);
      await API.put("main", "/admin/update-static-data", {
        body: {
          institutionid: institutionData.InstitutionId,
          field: "AboutUs",
          value: aboutUsContent,
        },
      });
      toast.success("About Us content updated successfully");
      setEditing(false);
    } catch (e) {
      util.setLoader(false);
      console.log(e.message);
      toast.error("Failed to update About Us content");
    }finally{
      util.setLoader(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center">
        <div
          className="w-[82vw] mt-[2rem]"
          style={{
            "--primary-color": institutionData?.PrimaryColor || "#4A90E2",
            "--primary-text-color": "#333",
          }}
        >
          <div className="flex justify-center items-center">
            <h1
              className="text-[3rem] max600:text-[2rem] font-bold text-center text-white rounded-lg px-4 py-2 monserrat-bold"
              style={{ backgroundColor: institutionData?.PrimaryColor }}
            >
              About Us
            </h1>
          </div>

          {
            // Edit Button
            isAuth && UserCtx.userType === "admin" && (
              <div className="edit-button-container">
                <button
                  className="edit-button text-white"
                  style={{
                    backgroundColor: institutionData?.LightPrimaryColor,
                  }}
                  onClick={() => setEditing((prev) => !prev)}
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>
            )
          }

          {UserCtx.userType === "admin" && editing && (
            <TextEditor
              value={aboutUsContent}
              onChange={setAboutUsContent}
              onSave={handleSave}
              editorClassName="h-[90dvh] max600:h-[50rem] text-gray-800 leading-relaxed text-[1.2rem] w-full about-us-content"
              saveButtonStyle={{
                backgroundColor: institutionData?.LightPrimaryColor,
              }}
            />
          )}

          {editing === false && (
            // Display Saved Content
            <div
              className="about-us-content mt-5 text-gray-800 leading-relaxed text-[1.2rem]"
              dangerouslySetInnerHTML={{
                __html: savedContent || "<p>No content available.</p>",
              }}
            />
          )}
        </div>

        {/* Call-to-Action Button */}
        {productId === "1000007" && (
        <div className="flex justify-center mt-[20px]">
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
        )}
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
