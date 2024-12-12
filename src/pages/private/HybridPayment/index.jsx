import React, { useContext,useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import NavBar from "../../../components/Header";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import HappyprancerPaypalHybrid from "../../public/Subscription/HappyprancerPaypalHybrid";
import ProfileCard from "./ProfileCard";
import SubscriptionCard from "./SubscriptionCard";
import {Overview} from "./Overview";
import Carousel from "./Carousel";
import"./Carousel.css";


import InstructorTestimonial from "./InstructorTestimonial";




export const HybridPayment = () => {

  const { institutionData: InstitutionData } = useContext(InstitutionContext);
  const { isAuth, productList, userData: UserCtx } = useContext(Context);
  const Navigate = useNavigate();

  const hybridProduct = productList.find(
    (item) => item.subscriptionType === "Hybrid"
  );

  const paymentHandler = (item) => {
    if (isAuth) {
      if (
        UserCtx?.status === "Active" &&
        UserCtx?.productIds?.some((productId) => productId === item.productId)
      ) {
        return (
          <p
            className="text-[1rem] w-[15rem] px-12 py-2 rounded-2xl border-[0.2rem] h-[3rem] flex justify-center items-center"
            style={{
              color: InstitutionData.LightPrimaryColor,
              borderColor: InstitutionData.LightPrimaryColor,
            }}
          >
            Subscribed
          </p>
        );
      } else {
        if (item.currency === "USD" && item.subscriptionType === "Hybrid") {
          return <HappyprancerPaypalHybrid />;
        }
      }
    } else {
      return (
        <button
          onClick={() => {
            Navigate("/signup");
          }}
          className="w-[15rem] px-12 py-2 rounded-2xl hover:text-lightPrimaryColor hover:bg- hover:border-lightPrimaryColor hover:border-[0.3rem] h-[3rem] flex justify-center items-center mt-auto mb-10 text-white"
          style={{
            backgroundColor: InstitutionData.LightPrimaryColor,
          }}
        >
          Sign Up
        </button>
      );
    }
  };

  const handleFreeTrial = async () => {
    if(isAuth){
      console.log(UserCtx);
    }else{
      // Get the current url and append the trial query params


      Navigate("/signup?trial=true&trialPeriod=Monthly");
    }
  };

  return (
    <>
      {/* <NavBar />
      <div className="relative flex place-items-center sm:h-full text-white lg:w-3/4 md:w-full sm:w-full "
        style={{
          backgroundColor: InstitutionData.LightPrimaryColor
        }}
      >
        
        <div className="flex flex-col  lg:flex-row justify-start p-8">
          <div className='class-details flex-grow lg:block'>
            <h1 className="text-4xl font-sans text-left mt-20 text-white font-medium lg:mt-[5rem] ml-3 sm:ml-10 ">HYBRID CLASS</h1>
         
            <h2 className="font-light ml-3 sm:ml-10
           mb-4 max-w-2xl">
              Hybrid Monthly Dance Classes
            </h2>
            
            <p className="max-w-2xl ml-3 sm:ml-10 text-justify mb-8">
            A unique dance program offering both in-person and online classes, perfect for dancers seeking flexibility and a comprehensive learning experience.
             <br />
          
            <p className=' font-bold '>In-Person Classes:</p>
        
            <li> Held every Sunday at our Farmington Hills studio, these sessions provide hands-on instruction and immediate feedback from our experienced instructors.
            </li>
            <br />
            <p className=' font-bold '>Online Classes:</p>
            <li>With 60 live Zoom sessions available each month, you can join classes from anywhere. These sessions cover a variety of dance styles and levels, ensuring there's something for everyone.
            </li>
            <br />
            <p className=' font-bold '>Why:</p>
            <li>Enjoy the benefits of face-to-face instruction combined with the convenience of online classes.</li>
            <li>Get personalized attention during in-person sessions.</li>
            <li>Practice anytime with our extensive online schedule</li>
            <li>Ideal for busy individuals looking to balance dance with other commitments.</li>
            <br />
            <p className=' font-bold '>When:</p>
            
            <li>In-Person Classes: Every Sunday at 4:30 PM
            </li>
            <li>Online Classes: 60 live sessions available throughout the month via Zoom, allowing you to fit classes into your schedule at your convenience.
            </li>
            <br />
            
            <p className=' font-bold '>Where:</p>
            <li>In-Person: Ambassador of Dance, 24293 Indoplex Cir, Farmington Hills, MI 48335</li>
            <li>Online: Happyprancer via Zoom</li>

            </p>
          
        

          </div>
        </div>
        
        {hybridProduct && (
          <li
            key={hybridProduct.productId}
            className="mt-4 sm:mt-0 subscription-card w-72  sm:w-full  lg:w-[32.8%] 2xl:w-[32%] lg:px-8 rounded-[2rem] z-10 flex flex-col items-center gap-4 shadowSubscribe bg-white border-[0.1rem] absolute lg:relative  top-[99.9%] lg:top-[60%]  left-1/2 transform -translate-x-1/2 lg:transform-none lg:top-[6%] lg:left-[17%] lg:h-[74%] "
            style={{
              borderColor: InstitutionData.LightPrimaryColor,
            }}
          >
            <p className="text-[1.6rem] mt-4 font-bold text-center text-black">{hybridProduct.heading}</p>
            <ul className="text-[1rem] pl-0 flex flex-col items-center ">
              {hybridProduct.provides.map((provide, j) => (
                <li key={`${hybridProduct.productId}-provide-${j}`} className="text-center text-black">
                  <p>{provide}</p>
                </li>
              ))}
            </ul>
            <div className="flex-grow"></div>
            <h1 className="w-[100%] text-center text-[2.3rem] font-bold mt-[-3rem]">
              {(hybridProduct.currency === 'INR' ? '₹ ' : '$ ') +
                parseInt(hybridProduct.amount) / 100 +
                '/' +
                hybridProduct.durationText}
            </h1>
            <div className="z-1 flex justify-center items-center ">
              {paymentHandler(hybridProduct)}
            </div>
          </li>
        )}
      </div>
      <div className='mt-[32rem] md:mt-[30rem] sm:mt-[28rem] lg:mt-0'>
      <Footer  />
      </div> */}

      <NavBar />
      <Carousel />
        <ProfileCard />
        
      <div className="w-screen flex flex-col justify-center items-center p-2">
        <InstructorTestimonial />
      </div>
      <div className=" mx-auto p-4 flex flex-col">
        <Overview />
        <div className="my-4"></div>
        <SubscriptionCard />
      </div>
      <Footer />
    </>
  );
};






