import React, { useContext, useState } from "react";
import LeftBanner from "./LeftBanner";
import PreviousSessions from "./PreviousSessions";
import ProfileUpdate from "./ProfileUpdate";
import UpcomingSessions from "./UpcomingSessions";
import UsersList from "./UsersList";
import DashboardRating from "./DashboardRating";
import Payments from "./Billing";
import Revenue from "./Revenue";
import NavBar from "../../../components/Header";
import Context from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import InstitutionContext from "../../../Context/InstitutionContext";
import Footer from "../../../components/Footer";
import BirthdayModal from "./ProfileUpdate/BirthdayModal";
import Choreography from "./Choreography";
import { Auth } from "aws-amplify";

const DashBoard = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Navigate = useNavigate();
  const [click, setClick] = useState(0);
  const [userCheck, setUserCheck] = useState(0);
  const [loading, setLoading] = useState(false);
  const Ctx = useContext(Context);

  const displayAfterClick = () => {
    switch (click) {
      case 0:
        return <UpcomingSessions />;

      case 1:
        return <PreviousSessions />;

      case 2:
        return <Choreography />;

      case 3:
        return (
          <ProfileUpdate
            setClick={setClick}
            displayAfterClick={displayAfterClick}
          />
        );

      case 4:
        return <UsersList userCheck={userCheck} setUserCheck={setUserCheck} />;

      case 5:
        return (
          <div className="">
            <DashboardRating />
          </div>
        );

      case 6:
        return <Payments />;

      case 7:
        return <Revenue />;

      default:
        return <div></div>;
    }
  };

  const isProfileSection = click === 3;

  return (
    <>
      <NavBar />
      <div className={`flex flex-col items-center w-screen`}>
        {Ctx?.userData &&
          Ctx.userData.hasOwnProperty("dob") &&
          Ctx.userData.dob && <BirthdayModal />}
        <div
          className={`w-full rounded-3xl flex max1050:w-screen max1050:ml-0 max536:rounded-none items-top ml-0 h-full relative`}
        >
          <LeftBanner
            displayAfterClick={(data) => {
              setClick(data);
            }}
          />
          <div
            className={`flex flex-col w-[100%] pb-4 max536:pt-0 justify-start min-h-[90vh] max-h-[90vh] overflow-y-auto`}
          >
            {Ctx.userData.status === "InActive" &&
            Ctx.userData.userType === "member" &&
            !isProfileSection ? (
              <div className={`relative`}>
                <div
                  className={`absolute z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center`}
                >
                  <div
                    className={`flex flex-col items-center justify-center max-w-4xl w-full text-center p-8`}
                  >
                    <div
                      className={`sm:flex-row items-center justify-center gap-4 sm:gap-6`}
                    >
                      <button
                        className={`flex items-center justify-center px-6 py-3 rounded-full text-white font-medium transition-all hover:shadow-lg`}
                        onClick={() => Navigate("/subscription")}
                        style={{
                          backgroundColor: InstitutionData.PrimaryColor,
                        }}
                      >
                        <img
                          src={`https://institution-utils.s3.amazonaws.com/institution-common/images/Dashboard/lock.svg`}
                          alt=""
                          className={`w-5 h-5 mr-2`}
                        />
                        <span>SUBSCRIBE AND UNLOCK</span>
                      </button>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-gray-600">
                        Already have a{" "}
                        <span
                          className="font-bold"
                          style={{ color: InstitutionData.PrimaryColor }}
                        >
                          subscription
                        </span>{" "}
                        with a different email?
                      </span>
                      <button
                        className={`underline hover:text-blue-800 font-medium transition-colors`}
                        onClick={() => {
                          // Redirect the user to the subscription page
                          Navigate("/logout");
                        }}
                        disabled={loading}
                        style={{ color: InstitutionData.PrimaryColor }}
                      >
                        {loading ? "Processing..." : "Switch Account"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`opacity-20`}>{displayAfterClick()}</div>
              </div>
            ) : (
              <div>{displayAfterClick()} </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashBoard;
