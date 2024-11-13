import { API } from "aws-amplify";
import { useContext, useEffect, useState } from "react";
import Context from "../../../Context/Context";
import apiPaths from "../../../utils/api-paths";
import "./SubscriptionCard.css";
import { useNavigate } from "react-router-dom";

const SubscriptionCard = () => {
  const { isAuth,productList, userdata: UserCtx } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [locationData, setLocationData] = useState({});
  const [hoveredButton, setHoveredButton] = useState(null); // Track the hovered button index
  const navigate = useNavigate();

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

  const handleChoosePlan = () => {
    if(isAuth){
      navigate("/subscription")
    }
    else{
      navigate("/auth");
    }
  };

  return (
    <>
      <svg
        className="absolute -left-[32rem] opacity-70 z-0 hidden md:block"
        xmlns="http://www.w3.org/2000/svg"
        width="963"
        height="1581"
        viewBox="0 0 963 1581"
        fill="none"
      >
        <g filter="url(#filter0_f_34_247)">
          <path
            d="M-260.203 764.711C-362.796 603.674 -292.701 389.035 -114.837 319.589L149.941 216.207C328.459 146.505 529.681 234.717 599.383 413.235L747.048 791.429C816.75 969.947 728.538 1171.17 550.02 1240.87L221.984 1368.95C69.07 1428.66 -102.806 1349.15 -156.306 1193.95L-158.109 1188.72C-164.258 1170.89 -172.472 1153.83 -182.585 1137.9L-197.093 1115.05C-224.326 1072.17 -232.231 1019.79 -218.869 970.774C-215.216 957.372 -213.122 943.594 -212.627 929.712L-212.342 921.725C-210.543 871.215 -224.12 821.349 -251.276 778.723L-260.203 764.711Z"
            fill="url(#paint0_angular_34_247)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_34_247"
            x="-499.778"
            y="0.348495"
            width="1462.68"
            height="1580.49"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="96"
              result="effect1_foregroundBlur_34_247"
            />
          </filter>
          <radialGradient
            id="paint0_angular_34_247"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(207.459 784.186) rotate(16.8193) scale(691.439 508.599)"
          >
            <stop offset="0.146" stop-color="white" stop-opacity="0" />
            <stop offset="0.506955" stop-color="#225C59" />
            <stop offset="1" stop-color="white" stop-opacity="0.53" />
          </radialGradient>
        </defs>
      </svg>
      <div className="mb-7">
        <h1 className="hybrid-heading text-3xl font-bold text-center mt-8 text-[3rem] mb-4 text-lightPrimaryColor">
          Subscription
        </h1>
        <p className="text-[1rem] mt-2 px-4 w-2/3 mx-auto text-center font-[600]">
          Unlock exclusive benefits and stay connected—subscribe now to join us
          on this exciting journey!
        </p>
      </div>
      <div className="flex flex-row gap-8 justify-center items-center flex-wrap max850:!flex-col max-w-[90vw] mx-auto">
        {products.map(
          (item, i) =>
            //  This will render the card only if the index is 1
            i === 1 && (
              <div
                key={i}
                className="min-h-[528px] card-color w-[300px] max850:w-[300px] text-white rounded-lg shadow-lg px-2"
              >
                <div className="flex flex-col justify-between items-center h-full p-4">
                  {/* Card Heading */}
                  <h5 className="min-h-[80px] text-xl font-sans font-medium text-center w-full bg-white text-black rounded-full mt-2 py-2">
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
                      <div>$20 for Registration and $20 for Monthly.</div>
                      <div>Instructors:Certified Zumba & BWORKZ</div>
                      <div>
                        Plan: 40+ Monthly Online andin-person Dance Fitness
                        Classes
                      </div>
                    </li>
                  </ul>
                  <div className="border border-gray-500 w-3/4 mx-auto mb-2"></div>

                  <button
                    onClick={handleChoosePlan}
                    type="button"
                    onMouseEnter={() => setHoveredButton(i)}
                    onMouseLeave={() => setHoveredButton(null)}
                    className={`w-full justify-center rounded-lg transition-colors duration-500 ${
                      hoveredButton === i
                        ? "bg-white text-primaryColor"
                        : "bg-black text-white"
                    } px-5 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lighestPrimaryColor dark:focus:ring-cyan-900 mb-2`}
                  >
                    Choose plan
                  </button>
                </div>
              </div>
            )
        )}
      </div>
    </>
  );
};

export default SubscriptionCard;
