import { Card } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import HappyprancerPaypalHybrid from "../Subscription/HappyprancerPaypalHybrid";
import HappyprancerPaypalMonthly from "../Subscription/HappyprancerPaypalMonthly";
import web from "../../../utils/data.json";
import RazorpayPayment from "../Subscription/RazorpayPayment";

const Subscription = () => {
  const { institutionData: InstitutionData } = useContext(InstitutionContext);
  const { isAuth, productList, userData: UserCtx } = useContext(Context);
  const [products, setProducts] = useState([]);
  const Navigate = useNavigate();

  const [bgInView, setBgInView] = useState(false);

useEffect(() => {
  if (UserCtx?.location?.countryCode) {
    localStorage.setItem("userLocation", `${UserCtx.location.countryCode}`);
  } else {
    console.warn("UserCtx.location.countryCode is undefined");
  }
}, [UserCtx?.location?.countryCode]);

useEffect(() => {
  // Only update the products when country code changes and avoid including 'products' in the dependency array
  const storedLocation = localStorage.getItem("userLocation");

  if (storedLocation === "IN") {
    setProducts(productList.filter((item) => item.currency === "INR"));
  } else {
    setProducts(productList.filter((item) => item.currency !== "INR"));
  }
}, [UserCtx?.location?.countryCode, productList]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBgInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01 } // Adjust threshold as needed
    );

    const element = document.getElementById("subscription-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const domain =
    process.env.REACT_APP_STAGE === "DEV"
      ? process.env.REACT_APP_DOMAIN_BETA
      : process.env.REACT_APP_DOMAIN_PROD;

  const paymentHandler = (item) => {
    if (isAuth) {
      if (
        UserCtx?.status === "Active" &&
        UserCtx?.productIds?.some((productId) => productId === item.productId)
      ) {
        return (
          <button
            type="button"
            className="mt-4 inline-flex w-full justify-center rounded-lg bg-white border-lightPrimaryColor border-2 px-5 py-2.5 text-center text-sm font-medium text-lightPrimaryColor hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900"
          >
            Subscribed
          </button>
        );
      } else {
        if (item.currency === "USD" && item.subscriptionType === "Monthly") {
          return <HappyprancerPaypalMonthly />;
        } else if (
          item.currency === "USD" &&
          item.subscriptionType === "Hybrid"
        ) {
          return <HappyprancerPaypalHybrid />;
        } else {
          return (
            <button
              type="button"
              className="mt-4 first-letter:inline-flex w-full justify-center rounded-lg bg-lightPrimaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900"
              onClick={() => {
                window.open(
                  `${domain}/allpayment/${web.InstitutionId}/${UserCtx.cognitoId}/${UserCtx.emailId}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              Subscribe
            </button>
          );
        }
      }
    } else {
      return (
        <button
          type="button"
          onClick={() => {
            Navigate("/signup");
          }}
          className="inline-flex w-full justify-center rounded-lg bg-lightPrimaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900"
        >
          Sign up
        </button>
      );
    }
  };

  return (
    <div
      id="subscription-section"
      className={`text-[1.5rem] flex flex-col items-center justify-center gap-[5rem] `}
      style={{
        backgroundImage: bgInView
          ? `url(${InstitutionData.SubscriptionBg})`
          : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundColor: bgInView ? "transparent" : "black",
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <div className="text-center sans-serif mt-4">
        <h1
          className="text-[3rem] max850:text-[1.5rem] font-[700] max800:px-3"
          style={{
            color: "black",
            fontWeight: "bold",
          }}
        >
          Membership Subscription
        </h1>
        <h3
          className="text-[1rem] mt-2 max850:text-[.7rem] font-[600]"
          style={{
            color: "black",
          }}
        >
          See the pricing details below
        </h3>
      </div>

      <div className="flex flex-row gap-8 justify-center flex-wrap max850:!flex-col max-w-[90vw]">
        {products.map((item, i) => (
          <Card key={i} className="w-[400px] min-h-[450px] max850:w-[300px]">
            <h5 className="text-2xl min-h-20 font-medium flex items-center text-gray-500 dark:text-gray-400">
              {item.heading}
            </h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">
                {item.currency === "INR" ? "₹ " : "$ "}
              </span>
              <span className="text-5xl font-extrabold tracking-tight">
                {parseInt(item.amount) / 100}
              </span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                /{item.durationText}
              </span>
            </div>
            <ul className="my-7 space-y-5 min-h-[12rem]">
              {item.provides.map((provide, j) => (
                <li key={`${i}-provide-${j}`} className="flex space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-primaryColor dark:text-primaryColor"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    {provide}
                  </span>
                </li>
              ))}
            </ul>
            {/* <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-lightPrimaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900"
            >
              Choose plan
            </button> */}
            {paymentHandler(item)}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
