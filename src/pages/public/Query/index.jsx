import React from "react";
import { useState } from "react";
import Footer from "../../../components/Footer";
import NavBar from "../../../components/Header";
import { API } from "aws-amplify";

import { useContext } from "react";
import Context from "../../../Context/Context";
import "./index.css";
import { Button2 } from "../../../common/Inputs";
import InstitutionContext from "../../../Context/InstitutionContext";
import { toast } from "react-toastify";

export default function Query() {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const UtilCtx = useContext(Context).util;
  const UserCtx = useContext(Context).userData;
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phoneNumber = e.target.phoneNumber.value;
    const message = e.target.message.value;

    UtilCtx.setLoader(true);

    console.log(name, email, phoneNumber, message);

    if(!name || !email || !phoneNumber || !message){
      UtilCtx.setLoader(false);
      return toast.error("All fields are required");
    }

    try {
      const apiName = "main";
      const path = `/any/create-query/${InstitutionData.institutionid}`;
      const myInit = {
        body: {
          fullName: name,
          emailId: email,
          phoneNumber: phoneNumber,
          message: message,
          userType: UserCtx.userType || "member",
          adminEmail: InstitutionData.Query_EmailId,
          isPaymentRedirect:
            window.location.href.split("/")[3] === "query" ? false : true,
        },
      };

      await API.put(apiName, path, myInit);

      UtilCtx.setLoader(false);
      toast.success(
        "Your message has been sent. We will get back to you as soon as possible."
      );
      // setName("");
      // setEmail("");
      // setPhoneNumber("");
      // setMessage("");
    } catch (e) {
      toast.error(e.message);
      UtilCtx.setLoader(false);
    }
  };

  return (
    <>
      {window.location.href.split('/')[3] === 'query' && <NavBar />}
      <div className={`flex flex-col gap-16 py-10 items-center Background`}>
        <div className={`flex flex-col items-center `}>
          <h2
            className={`text-[3rem] sans-sarif max500:text-[1.6rem] text-[white]`}
          >
            Have Questions?
          </h2>
          <p className={`text-[white] sans-sarif`}>
            we are always here for a good cup of coffee
          </p>
        </div>
        <div className={`mb-10`}>
          <div
            className={`bg-white flex  px-5 shadow-2xl gap-8 max500:w-[80vw]`}
          >
            <div
              className={`m-2 p-10 max850:hidden w-[18rem] h-[30rem] flex flex-col gap-[1rem]`}
              style={{
                backgroundColor: InstitutionData.PrimaryColor,
              }}
            >
              <span
                className={`font-bold sans-sarif text-[1.6rem] w-full text-white leading-7`}
              >
                Contact Information{" "}
              </span>
              <div className={`text-[0.9rem] sans-sarif text-white`}>
                {" "}
                [] Already a Customer or need help ?{" "}
              </div>
              <div className={`flex text-white text-[0.8rem] flex-col`}>
                <span
                  className={`sans-sarif font-bold text-[1.4rem] mt-[2rem]`}
                >
                  Contact Support
                </span>
                <span>Email - {InstitutionData.Query_EmailId}</span>
                <span>Mobile - {InstitutionData.Query_PhoneNumber}</span>
                <span>{InstitutionData.Query_Address}</span>
                <a href="happyprancer.com" className={`font-bold `}>
                  {InstitutionData.Query_WebLink}
                </a>
              </div>
            </div>
            <div
              className={`border-[#9d9d9d78] border-[1px] bg-black my-8 max850:hidden`}
            ></div>
            <div
              className={`sans-sarif flex flex-col items-center gap-10 py-4`}
            >
              <h3 className="max500:mr-14">FILL IT UP!</h3>
              <form onSubmit={onSubmit} className={`flex flex-col gap-8 items-center`}>
                <ul
                  className={`w-[25rem] flex flex-col items-center gap-6 max500:w-[70vw]`}
                >
                  <li
                    className={`flex gap-4 items-center justify-between w-[23rem] max500:flex-col max500:gap-1 max500:items-start max500:w-[90%] max500:mr-20`}
                  >
                    <label for="name" className='font-bold'>Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      pattern="[A-Za-z]+"
                      title="Name can only have characters"
                      className={`rounded-md py-[0.4rem] px-2 max500:w-[100%] bg-[#d9d9d980]`}
                      // value={name}
                      // onChange={(e) => {
                      //   setName(e.target.value);
                      // }}
                      required
                    />
                  </li>
                  <li
                    className={`flex gap-4 items-center justify-between w-[23rem] max500:flex-col max500:gap-1 max500:items-start max500:w-[90%] max500:mr-20`}
                  >
                    <label className='font-bold'>Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`rounded-md py-[0.4rem] px-2 max500:w-[100%] bg-[#d9d9d980]`}
                      // value={email}
                      // onChange={(e) => {
                      //   setEmail(e.target.value);
                      // }}
                      required
                    />
                  </li>
                  <li
                    className={`flex gap-4 items-center justify-between w-[23rem] max500:flex-col max500:gap-1 max500:items-start max500:w-[90%] max500:mr-20`}
                  >
                    <label className='font-bold'>Phone Number</label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      className={`rounded-md py-[0.4rem] px-2 max500:w-[100%] bg-[#d9d9d980]`}
                      // value={phoneNumber}
                      // onChange={(e) => {
                      //   setPhoneNumber(e.target.value);
                      // }}
                      pattern="[0-9]{9,10}"
                      title="Phone number can only be 9 or 10 numbers."
                      required
                    />
                  </li>
                  <li
                    className={`flex gap-4 items-center justify-between w-[23rem] max500:flex-col max500:gap-1 max500:items-start max500:w-[90%] max500:mr-20`}
                  >
                    <label for="message" className='font-bold'>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className={`rounded-md py-[0.4rem] px-2 h-[8rem] max500:w-[100%] bg-[#d9d9d980]`}
                      // value={message}
                      // onChange={(e) => {
                      //   setMessage(e.target.value);
                      // }}
                      required
                    />
                  </li>
                </ul>
                <Button2
                  data={"Submit"}
                  // fn={onSubmit}
                  w="8rem"
                  className="max500:mr-14"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
