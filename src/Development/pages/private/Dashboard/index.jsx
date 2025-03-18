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

const DashBoard = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const Navigate = useNavigate();
  const [click, setClick] = useState(0);
  const [userCheck, setUserCheck] = useState(0);
  const Ctx = useContext(Context);
  const unpaidUser = {
    text: "Embrace a world of possibilities. Unlock exclusive features. Subscribe now and elevate your experience with our extraordinary offerings.",
  };

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
      <div className={`flex flex-col items-center w-screen `}>
        {
          Ctx?.userData && Ctx.userData.hasOwnProperty("dob") && Ctx.userData.dob && (<BirthdayModal />)
        }
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
                  className={`absolute z-10 top-[30%] right-[15%] max1050:w-[92%] flex justify-between rounded-[0.51rem]`}
                >
                  <div className={`w-[100%]`}>
                    <div
                      className={`locked-screen relative flex items-center justify-center text-center mt-[3.5rem]`}
                    >
                      <div className={`unlock-button`}>
                        <h2
                          className={`w-[fit-content] text-[1.5rem] max500:text-[1.2rem] ml-[5rem]`}
                        >
                          {unpaidUser.text}
                          <br />
                          If this is unexpected, you may have created a new account. Try switching to a different account.
                        </h2>
                        <div className='flex flex-col items-center'>
                          <button
                            className={`Subscribe-button ml-[8rem] w-[8rem] h-[3rem] m-[2rem] rounded-[1.5rem] text-white`}
                            onClick={() => {
                              // Redirect the user to the subscription page
                              Navigate("/subscription");
                            }}
                            style={{
                              backgroundColor: InstitutionData.PrimaryColor,
                            }}
                          >
                            <img
                              src={`https://institution-utils.s3.amazonaws.com/institution-common/images/Dashboard/lock.svg`} // Provide the source for the lock image
                              alt=""
                              className={`top-7 right-10 w-[32px] translate-x-[-2%] absolute fa-4x mb-4`}
                              onClick={() => {
                                // Redirect the user to the subscription page
                                Navigate("/subscription");
                              }}
                            />

                            {/*<span className={`Latch`}>*/}
                            {/*  <span className={`Lock`}></span>*/}
                            {/*</span>*/}
                            <div className={`UnlockText`}>UNLOCK</div>
                          </button>
                          <button
                            className={`Subscribe-button ml-[8rem] w-[14rem] h-[3rem] m-[2rem] rounded-[1.5rem] text-white`}
                            onClick={() => {
                              // Redirect the user to the subscription page
                              Navigate("/logout");
                            }}
                            style={{
                              backgroundColor: InstitutionData.PrimaryColor,
                            }}
                          >
                            {/*<img*/}
                            {/*  src={`https://institution-utils.s3.amazonaws.com/institution-common/images/Dashboard/lock.svg`} // Provide the source for the lock image*/}
                            {/*  alt=""*/}
                            {/*  className={`top-7 right-10 w-[32px] translate-x-[-2%] absolute fa-4x mb-4`}*/}
                            {/*  onClick={() => {*/}
                            {/*    // Redirect the user to the subscription page*/}
                            {/*    Navigate("/subscription");*/}
                            {/*  }}*/}
                            {/*/>*/}

                            {/*<span className={`Latch`}>*/}
                            {/*  <span className={`Lock`}></span>*/}
                            {/*</span>*/}
                            <div className={`UnlockText`}>SWITCH ACCOUNT</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`opacity-[20%]`}>{displayAfterClick()}</div>
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
