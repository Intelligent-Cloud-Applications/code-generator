import apiPaths from "../../../utils/api-paths";
import { API } from "aws-amplify";
import { useContext, useEffect, useState } from "react";
import Context from "../../../Context/Context";
import "./SubscriptionCard.css";

const SubscriptionCard = () => {
  const { productList, userdata: UserCtx } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [locationData, setLocationData] = useState({});

useEffect(() => {
  const fetchLocationData = async () => {
    try {
      const data = await API.get("main", apiPaths?.getUserLocation);
      setLocationData(data);
    } catch (e) {
      console.log(e);
    }
  };

  fetchLocationData();
}, []); // Run only once on mount

// Filter products based on location data and productList updates
useEffect(() => {
  const filterProducts = () => {
    let data = [];
    if (locationData?.countryCode === "IN") {
      data = productList.filter((item) => item.currency === "INR");
    } else {
      data = productList.filter((item) => item.currency !== "INR");
    }
    setProducts(data);
  };

  if (locationData && productList.length > 0) {
    filterProducts();
  }
}, [locationData, productList]);



  return (
    <>
      <div className="mb-7 ">
        <h1 className="text-3xl font-bold text-center mt-8 text-[3rem] mb-4 text-lightPrimaryColor">
          Subscription
        </h1>
        <p className="text-[1rem] mt-2 text-center font-[600]">
          Say goodbye to interruptions and enjoy uninterrupted music streaming.
          With our ad-free platform, you’ll have access to millions of songs
        </p>
      </div>
      <div className="flex flex-row gap-8 justify-center items-center flex-wrap max850:!flex-col max-w-[90vw]">
        {products.map((item, i) => (
          <div
            key={i}
            className=" card-color w-[300px] max850:w-[300px]  text-white rounded-lg shadow-lg px-2 "
          >
            <div className="flex flex-col justify-between items-center h-full p-4">
              {/* Card Heading */}
              <h5 className="text-xl font-sans font-medium text-center w-full bg-white text-black rounded-full mt-2 py-2">
                {item.heading}
              </h5>

              {/* Divider */}
              <div className="border border-gray-500 w-3/4 mx-auto mt-2"></div>

              {/* Pricing Section */}
              <div className="flex items-baseline text-white mt-4">
                <span className="text-3xl font-semibold">
                  {item.currency === "INR" ? "₹ " : "$ "}
                </span>
                <span className="text-5xl font-extrabold tracking-tight">
                  {parseInt(item.amount) / 100}
                </span>
                <span className="ml-1 text-xl font-normal text-white">
                  /{item.durationText}
                </span>
              </div>

              {/* Divider */}
              <div className="border border-gray-500 w-3/4 mx-auto mt-2"></div>

              {/* Description List */}
              <ul className="my-7 space-y-5 text-center min-h-[12rem]">
                <li className="text-lg font-normal text-white">
                  You will get One T-Shirt ₹ 2,100 Joining fees ₹ 600 monthly
                </li>
              </ul>
              <div className="border border-gray-500 w-3/4 mx-auto mt-2"></div>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-lg bg-black px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900 mb-2"
              >
                Choose plan
              </button>
            </div>
          </div>
        ))}
      </div>

    </>
  );
};

export default SubscriptionCard;