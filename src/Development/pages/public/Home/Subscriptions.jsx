import { Card } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import HappyprancerPaypalHybrid from "../Subscription/HappyprancerPaypalHybrid";
import HappyprancerPaypalMonthly from "../Subscription/HappyprancerPaypalMonthly";
import institutionData from "../../../constants";

const getLocationFromIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Failed to fetch location');
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};

const Subscription = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const { productId } = useContext(InstitutionContext).institutionData;
  const { isAuth, productList, userData: UserCtx } = useContext(Context);
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
        setUserLocation('US');
        localStorage.setItem("userLocation", 'US');
      }
    };

    initializeLocation();
  }, [UserCtx?.location?.countryCode]);

  // Filter products based on location
  useEffect(() => {
    if (!userLocation || !productList?.length) return;

    const filteredProducts = productList
      .filter(item => item.productId !== "1000048") // Remove dev subscription
      .filter(item => {
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

  const domain = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.REACT_APP_STAGE === "DEV"
      ? institutionData.BETA_DOMAIN
      : institutionData.PROD_DOMAIN;

  const handleSubscribeClick = (cognitoId, emailId) => {
    const primaryColor = encodeURIComponent(InstitutionData.PrimaryColor.replace('#', ''));
    const secondaryColor = encodeURIComponent(InstitutionData.SecondaryColor.replace('#', ''));
    // const url = `${domain}/allpayment/${institutionData.InstitutionId}/${cognitoId}/${emailId}?primary=${primaryColor}&secondary=${secondaryColor}`;
    const url = process.env.REACT_APP_STAGE === 'PROD' ?
      `https://payment.happyprancer.com/${institutionData.InstitutionId}/${productId}/${UserCtx.cognitoId}/${domain.split('://')[1]}` :
      `https://betapayment.happyprancer.com/${institutionData.InstitutionId}/${productId}/${UserCtx.cognitoId}/${domain.split('://')[1]}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const renderSubscribeButton = (item) => {
    return (
      <button
        type="button"
        className="mt-4 first-letter:inline-flex w-full justify-center rounded-lg bg-lightPrimaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900"
        onClick={() => handleSubscribeClick(UserCtx.cognitoId, UserCtx.emailId)}
        style={{ backgroundColor: InstitutionData.PrimaryColor }}
      >
        Subscribe
      </button>
    );
  };

  const renderSubscribedButton = () => {
    return (
      <button
        type="button"
        className="mt-4 inline-flex w-full justify-center rounded-lg bg-white border-lightPrimaryColor border-2 px-5 py-2.5 text-center text-sm font-medium text-lightPrimaryColor hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900"
      >
        Subscribed
      </button>
    );
  };

  const renderSignupButton = () => {
    return (
      <button
        type="button"
        onClick={() => Navigate("/signup")}
        className="mt-4 inline-flex w-full justify-center rounded-lg bg-lightPrimaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryColor focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900"
        style={{ backgroundColor: InstitutionData.LightPrimaryColor }}
      >
        Sign up
      </button>
    );
  };

  const paymentHandler = (item) => {
    if (!isAuth) return renderSignupButton();

    if (UserCtx?.status === "Active" && UserCtx?.productIds?.some(id => id === item.productId)) {
      return renderSubscribedButton();
    }

    if (item.currency === "USD") {
      if (item.subscriptionType === "Monthly") return <HappyprancerPaypalMonthly />;
      if (item.subscriptionType === "Hybrid") return <HappyprancerPaypalHybrid />;
    }

    return renderSubscribeButton(item);
  };

  const renderProductFeatures = (provides, itemIndex) => {
    if (!provides || !Array.isArray(provides)) return null;

    return provides.map((provide, j) => (
      <li key={`${itemIndex}-provide-${j}`} className="flex space-x-3">
        <svg
          className="h-5 w-5 shrink-0 text-primaryColor dark:text-primaryColor"
          fill="primaryColor"
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
    ));
  };

  const renderProductCard = (item, index) => {
    return (
      <Card key={index} className="w-[400px] min-h-[450px] max850:w-[300px]">
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
        {productId === "1000007" && paymentHandler(item)}
      </Card>
    );
  };

  return (
    <div
      id="subscription-section"
      className="text-[1.5rem] flex flex-col items-center justify-center gap-[5rem]"
      style={{
        backgroundImage: bgInView && InstitutionData.SubscriptionBg ? `url(${InstitutionData.SubscriptionBg})` : "none",
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
            color: bgInView && InstitutionData.SubscriptionBg ? "white" : "black",
            fontWeight: "bold",
          }}
        >
          Membership Subscription
        </h1>
        <h3
          className="text-[1rem] mt-2 max850:text-[.7rem] font-[600]"
          style={{
            color: bgInView && InstitutionData.SubscriptionBg ? "white" : "black",
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