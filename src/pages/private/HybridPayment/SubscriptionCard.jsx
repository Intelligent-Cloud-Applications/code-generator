import { API } from "aws-amplify";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InstitutionContext from "../../../Context/InstitutionContext";
import Context from "../../../Context/Context";
import apiPaths from "../../../utils/api-paths";
import web from "../../../utils/data.json";
import "./SubscriptionCard.css";

const SubscriptionCard = () => {
  const { isAuth, productList, userData: UserCtx } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [locationData, setLocationData] = useState({});
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };
  const queryParams = getQueryParams(location.search);
  const referral = queryParams.get("referral");
  const institution = queryParams.get("institution");

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
  // console.log(UserCtx);
  const handleChoosePlan = () => {
    if (isAuth) {
      navigate(
        `/allpayment/${web?.InstitutionId}/${UserCtx?.cognitoId}/${UserCtx?.emailId}`
      );
    } else {
      toast.error("You have no accounts yet. Please sign up to continue.");
      navigate(
        `/signup?referral=${referral}&institution=${institution}&hybrid=true`
      );
    }
  };

  return (
    <>
      <div className="mb-7">
        <h1
          className="hybrid-heading text-3xl font-bold text-center mt-8 text-[3rem] mb-4"
          style={{ color: InstitutionData.PrimaryColor }}
        >
          Subscription
        </h1>
        <p className="text-[1rem] mt-2 px-4 w-2/3 mx-auto text-center font-[600]">
          Unlock exclusive benefits and stay connected—subscribe now to join us
          on this exciting journey!
        </p>
      </div>
      <div className="flex flex-row gap-8 justify-center items-center flex-wrap max850:!flex-col max-w-[90vw] mx-auto z-10">
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
                    {item.currency === "INR" ? (
                      <li className="text-lg font-normal text-white">
                        <div>₹1000 for Monthly.</div>
                        <div>Instructors:Certified Zumba & BWORKZ</div>
                        <div>
                          Plan: 40+ Monthly Online andin-person Dance Fitness
                          Classes
                        </div>
                      </li>
                    ) : (
                      <li className="text-lg font-normal text-white">
                        <div>$12 for Monthly.</div>
                        <div>Instructors:Certified Zumba & BWORKZ</div>
                        <div>
                          Plan: 40+ Monthly Online andin-person Dance Fitness
                          Classes
                        </div>
                      </li>
                    )}
                  </ul>
                  <div className="border border-gray-500 w-3/4 mx-auto mb-2"></div>

                  <button
                    onClick={handleChoosePlan}
                    className={`choose-plan w-full justify-center rounded-lg transition-colors duration-500 hover:bg-white  bg-slate-900 text-slate-100 px-5 py-2.5 text-center text-sm font-medium mb-2`}
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
