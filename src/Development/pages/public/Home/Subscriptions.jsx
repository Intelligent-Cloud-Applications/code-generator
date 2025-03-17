import { Card } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import HappyprancerPaypalHybrid from "../Subscription/HappyprancerPaypalHybrid";
import HappyprancerPaypalMonthly from "../Subscription/HappyprancerPaypalMonthly";
import institutionData from "../../../constants";
import {API} from "aws-amplify";
import {toast} from "react-toastify";

const getLocationFromIP = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) throw new Error("Failed to fetch location");
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};

const Subscription = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const institutionProductId = useContext(InstitutionContext).institutionData?.productId;
  const { util, isAuth, productList, userData: UserCtx } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const Navigate = useNavigate();
  const [bgInView, setBgInView] = useState(false);

  // Initialize and handle user location
  useEffect(() => {
    const initializeLocation = async () => {
      // Try to get location from context first
      if (UserCtx?.location?.countryCode) {
        setUserLocation(UserCtx.location.countryCode);
        localStorage.setItem("userLocation", UserCtx.location.countryCode);
        return;
      }

      // Try to get from localStorage
      const storedLocation = localStorage.getItem("userLocation");
      if (storedLocation) {
        setUserLocation(storedLocation);
        return;
      }

      // If no location found, try IP geolocation
      const ipLocation = await getLocationFromIP();
      if (ipLocation) {
        setUserLocation(ipLocation);
        localStorage.setItem("userLocation", ipLocation);
      } else {
        // Default to US if all methods fail
        setUserLocation("US");
        localStorage.setItem("userLocation", "US");
      }
    };

    initializeLocation();
  }, [UserCtx?.location?.countryCode]);

  // Filter products based on location
  useEffect(() => {
    if (!userLocation || !productList?.length) return;

    const filteredProducts = productList
      .filter((item) => item.productId !== "1000048") // Remove dev subscription
      .filter((item) => {
        if (userLocation === "IN") {
          return item.currency === "INR";
        }
        return item.currency !== "INR";
      });

    setProducts(filteredProducts);
  }, [userLocation, productList]);

  // Handle background intersection observer
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
      { threshold: 0.01 }
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
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.REACT_APP_STAGE === "DEV"
      ? institutionData.BETA_DOMAIN
      : institutionData.PROD_DOMAIN;

  const handleSubscribeClick = (cognitoId, productId) => {
    // Only proceed if user isn't already subscribed to any plan
    if (hasAnySubscription()) return;

    const url =
      process.env.REACT_APP_STAGE === "PROD"
        ? `https://payment.happyprancer.com/${institutionData.InstitutionId}/${productId}/${encodeURIComponent(UserCtx.cognitoId)}`
        : `https://betapayment.happyprancer.com/${institutionData.InstitutionId}/${productId}/${encodeURIComponent(UserCtx.cognitoId)}`;

    window.location.href = url;
  };

  // Check if user has any subscription
  const hasAnySubscription = () => {
    return (
      UserCtx?.productId &&
      UserCtx?.paymentId &&
      UserCtx?.renewDate &&
      Date.now() < UserCtx.renewDate
    );
  };

  // Check if user is subscribed to specific product
  const isSubscribedTo = (productId) => {
    return (
      UserCtx?.productId === productId &&
      UserCtx?.paymentId &&
      UserCtx?.renewDate &&
      Date.now() < UserCtx.renewDate
    );
  };

  const renderSubscribeButton = (item) => {
    const userHasSubscription = hasAnySubscription();
    const primaryColor = InstitutionData.PrimaryColor || "#4F46E5";
    return (
      <button
        type="button"
        className={`mt-4 relative inline-flex w-full justify-center rounded-lg ${
          userHasSubscription ? "opacity-60 cursor-not-allowed" : ""
        } bg-lightPrimaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900`}
        onClick={() => !userHasSubscription && handleSubscribeClick(UserCtx.cognitoId, item.productId)}
        style={{ backgroundColor: primaryColor }}
        disabled={userHasSubscription}
      >
        {userHasSubscription && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm bg-black/20">
            <div className="relative flex items-center justify-center p-1.5 rounded-full" style={{ backgroundColor: `${primaryColor}40` }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white drop-shadow-md"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        )}
        Subscribe
      </button>
    );
  };

  const handleSubscriptionCancel = async () => {
    util.setLoader(true);
    try {
      const response = await API.post(
        'main',
        `/user/cancel-subscription/${institutionData.institution}`,
        {}
      );
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error('Could not cancel subscription.');
    } finally {
      util.setLoader(false);
    }
  }

  const renderSubscribedButton = () => {
    const primaryColor = InstitutionData.PrimaryColor;

    return (
      <button
        type="button"
        className={`bg-white text-black border-2 mt-4 relative inline-flex w-full justify-center rounded-lg cursor-not-allowed px-5 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900`}
        // style={{ backgroundColor: primaryColor }}
        style={{ borderColor: primaryColor }}
        onClick={handleSubscriptionCancel}
      >
        {/*Already Subscribed*/}
        Cancel Subscription
      </button>
    );
  };

  const renderSignupButton = (productId) => {
    const lightPrimaryColor = InstitutionData.LightPrimaryColor || "#6366F1";

    return (
      <button
        type="button"
        onClick={() => Navigate(`/signup?productId=${productId}`)}
        className="mt-4 inline-flex w-full justify-center rounded-lg bg-lightPrimaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900"
        style={{ backgroundColor: lightPrimaryColor }}
      >
        Sign up
      </button>
    );
  };

  const paymentHandler = (item) => {
    if (!isAuth) return renderSignupButton(item.productId);

    if (isSubscribedTo(item.productId)) {
      return renderSubscribedButton();
    }

    if (item.currency === "USD") {
      if (hasAnySubscription()) {
        return renderSubscribeButton(item);
      } else {
        // Only use PayPal components if the user doesn't have a subscription
        // and the item doesn't have a planId (which would indicate it's managed in the database)
        if (!item.planId) {
          if (item.subscriptionType === "Monthly")
            return <HappyprancerPaypalMonthly />;
          if (item.subscriptionType === "Hybrid")
            return <HappyprancerPaypalHybrid />;
        }
        // For products with planId or other USD products, show the regular subscribe button
        return renderSubscribeButton(item);
      }
    }

    return renderSubscribeButton(item);
  };

  const renderProductFeatures = (provides, itemIndex) => {
    if (!provides || !Array.isArray(provides)) return null;
    const primaryColor = InstitutionData.PrimaryColor || "#4F46E5";

    return provides.map((provide, j) => (
      <li key={`${itemIndex}-provide-${j}`} className="flex space-x-3">
        <svg
          className="h-5 w-5 shrink-0 text-primaryColor dark:text-primaryColor"
          fill="primaryColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fill: primaryColor }}
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
    ));
  };

  const renderProductCard = (item, index) => {
    const isSubscribed = isSubscribedTo(item.productId);
    const primaryColor = InstitutionData.PrimaryColor || "#4F46E5";

    return (
      <Card
        key={index}
        className={`w-[400px] min-h-[450px] max850:w-[300px] overflow-visible relative`}
      >
        {isSubscribed && (
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <span
              className="text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              Current Plan
            </span>
          </div>
        )}
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
          {renderProductFeatures(item.provides, index)}
        </ul>
        {institutionProductId === "1000007" && paymentHandler(item)}
      </Card>
    );
  };

  return (
    <div
      id="subscription-section"
      className="text-[1.5rem] flex flex-col items-center justify-center gap-[5rem]"
      style={{
        backgroundImage:
          bgInView && InstitutionData.SubscriptionBg
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
            color:
              bgInView && InstitutionData.SubscriptionBg ? "white" : "black",
            fontWeight: "bold",
          }}
        >
          Membership Subscription
        </h1>
        <h3
          className="text-[1rem] mt-2 max850:text-[.7rem] font-[600]"
          style={{
            color:
              bgInView && InstitutionData.SubscriptionBg ? "white" : "black",
          }}
        >
          See the pricing details below
        </h3>
      </div>

      <div className="flex flex-row gap-8 justify-center flex-wrap max850:!flex-col max-w-[90vw]">
        {products.map((item, index) => renderProductCard(item, index))}
      </div>
    </div>
  );
};
export default Subscription;
