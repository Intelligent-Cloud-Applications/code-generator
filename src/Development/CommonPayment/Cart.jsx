//cart.jsx
import { animated, useSpring } from "@react-spring/web";
import { API } from "aws-amplify";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Context from "../Context/Context";
import CartTable from "./Cart/CartTable";
import displayError from "./Errors";
import ReceiptCard from "./FrontpageComponents/ReceiptCard";

const Cart = ({ institution }) => {
  const { cognitoId, forInstitution } = useParams();
  const { getCartItems, cartState, setCartState, getPaymentHistory, userData } =
    useContext(Context);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [referralCode, setReferralCode] = useState(""); // State to hold the referral code
  const [referralSubmitted, setReferralSubmitted] = useState(false); // State to track if referral code is submitted
  const [referralError, setReferralError] = useState(false); // State to track if referral code is incorrect
  const [referralUsed, setReferralUsed] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountType, setDiscountType] = useState("%");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [prevInstructorAmount, setPrevInstructorAmount] = useState(0);
  const prevAmouunt = useRef();
  const animation = useSpring({
    opacity: isModalOpen ? 1 : 0,
    transform: isModalOpen ? "translateY(0)" : "translateY(-20px)",
    config: { tension: 200, friction: 20 },
  });
  const [searchParams] = useSearchParams();
  const color = {
    primary: searchParams.get('primary') || '#000',
    secondary: searchParams.get('secondary') || '#000'
  };
  const ChildInstitutionId = searchParams.get('institutionId');
  const navigate = useNavigate();
  const handlePaymentFailure = (message, navigate) => {
    navigate("/payment-error", { state: { message } });
  };
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartData = await getCartItems(institution, cognitoId);
        if (cartData) {
          setCartState(cartData);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartState({
          productItems: [],
          quantities: [],
          subtotal: 0,
          currencySymbol: "$",
        });
      }
    };

    if (isInitialFetch) {
      fetchCartItems();
      setIsInitialFetch(false);
    }
  }, [getCartItems, institution, cognitoId, setCartState, isInitialFetch]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await API.get(
          "awsaiapp",
          `/any/userdetailget/${institution}/${cognitoId}`
        );
        console.log("User details:", response);
        setReferralCode(response.referred_code);
        if (response.referralUsed === true) {
          setReferralUsed(true);
        }
        if (response.referred_code) {
          setReferralSubmitted(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [institution, cognitoId]);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) return;

    setCartState((prevState) => {
      const newQuantities = prevState.quantities.map((qty, i) =>
        i === index ? newQuantity : qty
      );
      const subtotal = calculateSubtotal(prevState.productItems, newQuantities);

      return { ...prevState, quantities: newQuantities, subtotal };
    });
  };

  const calculateSubtotal = (items, quantities) => {
    return items.reduce(
      (total, item, index) => total + (item.amount / 100) * quantities[index],
      0
    );
  };

  const removeItem = (index) => {
    setCartState((prevState) => {
      const newProductItems = [...prevState.productItems];
      const newQuantities = [...prevState.quantities];

      newProductItems.splice(index, 1);
      newQuantities.splice(index, 1);

      const subtotal = calculateSubtotal(newProductItems, newQuantities);

      return {
        ...prevState,
        productItems: newProductItems,
        quantities: newQuantities,
        subtotal,
      };
    });
  };

  const updateInstructorAmount = async (institutionId, referralCode) => {
    try {
      const updateInstructorAmount = await API.put(
        "main",
        `/user/update-hybrid-instructor-amount/${institutionId}`,
        {
          body: {
            institution,
            referral: referralCode,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Instructor amount updated:", updateInstructorAmount);
      return updateInstructorAmount?.prevInstructorPaymentAmount;
    } catch (error) {
      console.error("Error updating instructor amount:", error);
    }
  };

  const updateToPreviousAmount = async (
    institutionId,
    referralCode,
    prevAmount
  ) => {
    try {
      const updateInstructorAmount = await API.put(
        "main",
        `/user/update-hybrid-instructor-amount/${institutionId}`,
        {
          body: {
            institution,
            referral: referralCode,
            instructorPaymentAmount: prevAmount,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Instructor amount updated:", updateInstructorAmount);
    } catch (error) {
      console.error("Error updating instructor amount:", error);
    }
  };

  const handleCheckout = async () => {
    setIsLoading1(true);

    const { productItems } = cartState;
    const institutionId = institution;
    const productId = productItems.map((item) => item.productId);
    const planIds = productItems.map((item) => item.planId);

    const uniqueProductIds = new Set(productId);
    if (uniqueProductIds.size !== productId.length) {
      displayError("Subscription already active for productId");
      handlePaymentFailure(
        "Subscription already active for productId",
        navigate
      );
      setIsLoading(false);
      setIsLoading1(false);
      return;
    }

    try {
      if (
        userData.hasOwnProperty("hybridPageUser") &&
        userData.hybridPageUser
      ) {
        const prevamount = await updateInstructorAmount(
          institutionId,
          referralCode
        );
        console.log("Previous instructor amount:", prevamount);
        prevAmouunt.current = prevamount;
        console.log("Previous instructor amount:", prevInstructorAmount);
      }

      const response = await API.put("awsaiapp", `/payment/checkout`, {
        body: {
          institutionId,
          cognitoId,
          productId,
          discountCode: referralCode,
        },
      });

      const totalAmount = response.reduce(
        (acc, current) => acc + current.subscriptionResult.amount,
        0
      );
      const subscriptionIds = response.map(
        (subscription) => subscription.subscriptionResult.paymentId
      );
      const invoiceId = response[0].invoiceId; // Get the invoice ID

      const RAZORPAY_KEY = process.env.REACT_APP_STAGE == 'DEV' 
    ? process.env.REACT_APP_RAZORPAY_TEST_KEY_ID 
    : process.env.REACT_APP_RAZORPAY_KEY_ID;

      const options = {
        key: RAZORPAY_KEY,
        amount: totalAmount,
        currency: response[0].subscriptionResult.currency,
        name: institution.toUpperCase(),
        description: response[0].subscriptionResult.subscriptionType,
        handler: async function (paymentResponse) {
          setIsLoading(true);
          try {
            setStatusMessage("Payment successful");

            // Schedule status message updates with delays
            setTimeout(() => {
              setStatusMessage("Generating receipt");
            }, 1000);

            setTimeout(() => {
              setStatusMessage("Receipt generated");
            }, 5000);

            const verify = async () => {
              try {
                const verifyResponse = await API.put(
                  "awsaiapp",
                  `/payment/webhook`,
                  {
                    body: {
                      institutionId,
                      childInstitution:ChildInstitutionId,
                      cognitoId,
                      subscriptionIds,
                      products: productItems.map((item) => item.heading),
                      razorpay_payment_id: paymentResponse.razorpay_payment_id,
                      amount: totalAmount,
                      referralCode,
                      invoiceId,
                    },
                  }
                );

                console.log("Verification response:", verifyResponse);

                if (verifyResponse.signatureIsValid) {
                  const formattedDate = new Date().toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  const renewalDates = verifyResponse.renewalDates.map((date) =>
                    new Date(date).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  );

                  setReceiptDetails({
                    subscriptionId: subscriptionIds,
                    amount: totalAmount / 100,
                    paymentDate: formattedDate,
                    renewalDate: renewalDates.join(", "),
                    institution: institution,
                    planDetails: productItems
                      .map((item) => `${item.heading}`)
                      .join(", "),
                    email: response[0].subscriptionResult.emailId,
                  });

                  setTimeout(() => {
                    setIsModalOpen(true);
                    setIsLoading(false);
                    getPaymentHistory(institutionId, cognitoId);
                    getCartItems(institutionId, cognitoId);
                  }, 1500);
                  if (
                    userData.hasOwnProperty("hybridPageUser") &&
                    userData.hybridPageUser
                  ) {
                    await updateToPreviousAmount(
                      institutionId,
                      referralCode,
                      prevAmouunt.current
                    );
                  }
                } else {
                  throw new Error("Payment verification failed!");
                }
              } catch (error) {
                console.error("Payment verification error:", error);
                if (
                  userData.hasOwnProperty("hybridPageUser") &&
                  userData.hybridPageUser
                ) {
                  await updateToPreviousAmount(
                    institutionId,
                    referralCode,
                    prevAmouunt.current
                  );
                }
                displayError(error.message);
                setIsLoading(false);
                setIsLoading1(false);
                setTimeout(() => {
                  handlePaymentFailure(
                    "Payment verification failed!",
                    navigate
                  );
                }, 100);
              }
            };
            verify();
          } catch (error) {
            console.error("Error during payment handler:", error);
            displayError("Error during payment handler");
            setIsLoading(false);
            setIsLoading1(false);
            setTimeout(() => {
              handlePaymentFailure("Error during payment process!", navigate);
            }, 1500);
          }
        },
        prefill: {
          email: response[0].subscriptionResult.emailId,
        },
        notes: {
          cognitoId: cognitoId,
          productIds: productId.join(","),
          planIds: planIds.join(","),
        },
        theme: {
          color: "#205b8f",
        },
        modal: {
          ondismiss: async function () {
            try {
              await API.del("awsaiapp", `/cancel/payment`, {
                body: {
                  cognitoId,
                  subscriptionIds,
                },
              });
              toast.info("Your payment has been cancelled successfully.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                },
              });
              setIsLoading(false);
              setIsLoading1(false);
            } catch (error) {
              displayError(error.response.data.error);
            }
            setTimeout(() => {
              handlePaymentFailure("Payment cancelled!", navigate);
            }, 1500);
          },
        },
      };
      if (subscriptionIds.length === 1) {
        options.subscription_id = response[0].subscriptionResult.paymentId;
      }
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        console.log("Payment failed:", response.error);
        displayError("Payment failed. Please try again.");
        setIsLoading(false);
        setIsLoading1(false);
        setTimeout(() => {
          handlePaymentFailure("Payment failed. Please try again.", navigate);
        });
      });
      paymentObject.open();
    } catch (error) {
      console.error("Error in checkout:", error);
      displayError(error.response.data.error);
      setIsLoading(false);
      setIsLoading1(false);
      setTimeout(() => {
        handlePaymentFailure(error.response.data.error, navigate);
      }, 1500);
    }
  };

  if (!cartState) {
    return <div>Loading...</div>;
  }

  const { productItems, currencySymbol } = cartState;

  const handleReferralSubmit = async () => {
    try {
      const response = await API.put(
        "awsaiapp",
        `/discount/${institution}/${referralCode}`,
        {
          body: {
            referralCode,
          },
        }
      );
      if (response.referral.discountType === "percent") {
        setDiscountType("%");
        setDiscountPercentage(response.referral.discountWorth);
        setDiscountAmount(cartState.subtotal * response.referral.discountWorth);
      } else {
        setDiscountType("- ₹");
        setDiscountPercentage(response.referral.discountWorth);
        if (response.referral.discountWorth) {
          setDiscountAmount(response.referral.discountWorth);
        } else {
          setDiscountAmount(0);
        }
      }
      setReferralSubmitted(true);
      console.log(discountAmount);
    } catch (error) {
      console.error("Error applying referral code:", error);
      toast.error("Error applying referral code: " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: "#f8d7da",
          color: "#721c24",
        },
      });
    }
  };
  const handleReferralReset = () => {
    setReferralCode("");
    setReferralSubmitted(false);
    setDiscountPercentage("");
    setDiscountAmount("");
    setReferralError(false);
  };

  return (
    <div className="Poppins mx-auto h-screen w-screen flex flex-col justify-around items-center border-b py-5 inter max767:h-full max767:flex-col max767:justify-center">
      <ToastContainer />
      <div
        className={`w-full max767:mt-[3rem] flex justify-center ${isModalOpen ? "hidden" : ""
          }`}
      >
        <CartTable
          product={productItems}
          removeItem={removeItem}
          updateQuantity={updateQuantity}
          quantities={cartState.quantities}
        />
      </div>

      <div
        className={`w-full Poppins max767:w-[98vw] ${isModalOpen ? "hidden" : ""
          }`}
      >
        <section className="mx-auto px-[1rem] min-w-[35vw]">
          <div className="w-full flex justify-evenly max767:flex-col-reverse">
            <div className="w-[36vw] py-[1.25rem] px-[1rem] max767:w-full">
              <p className="font-bold text-xl mb-[1.25rem]">Cart Total</p>
              <div className="flex justify-between border-b py-[1.25rem]">
                <p>Subtotal</p>
                <p>
                  {cartState.currencySymbol}
                  {cartState.subtotal.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between border-b py-[1.25rem]">
                <p>Discount</p>
                <p>
                  {discountType === "%"
                    ? `${discountPercentage}${discountType}`
                    : `${cartState.currencySymbol}${discountAmount ? discountAmount.toFixed(2) : 0
                    }`}
                </p>
              </div>
              <div className="flex justify-between py-[1.25rem] font-bold text-lg">
                <p>Total</p>
                <p>
                  {cartState.currencySymbol}
                  {(cartState.subtotal - discountAmount).toFixed(2)}
                </p>
              </div>
              <button
                className="w-full px-[1.25rem] py-[0.5rem] text-white font-bold bg-red-500 hover:bg-red-600"
                onClick={handleCheckout}
                style={{ backgroundColor: color.primary }}
              >
                {isLoading1 ? "Loading..." : "Proceed to checkout"}
              </button>
            </div>

            {!referralUsed ? (
              <div className="flex flex-col justify-center items-center px-[1rem] py-[0.75rem]">
                <p
                  className="mb-2 w-full text-left text-[0.76rem]"
                  style={{
                    color: referralSubmitted
                      ? "green"
                      : referralError
                        ? "red"
                        : "gray",
                  }}
                >
                  {referralSubmitted
                    ? "code submitted"
                    : referralError
                      ? "Invalid referral code"
                      : "If you have a Referral or discount code, enter it here"}
                </p>
                <div className="flex justify-center items-center">
                  <input
                    type="text"
                    placeholder="Referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-[18vw] px-[1rem] py-[0.75rem] border outline-none focus:outline-none max767:w-[70vw]"
                    disabled={referralSubmitted} // Disable input if referral code is submitted
                  />
                  {!referralSubmitted && (
                    <button
                      className="w-[8vw] px-[1rem] py-[0.75rem] text-white border border-black bg-black hover:bg-gray-800 max767:w-[20vw]"
                      onClick={handleReferralSubmit}
                      disabled={referralSubmitted} // Disable button if referral code is submitted
                    >
                      Submit
                    </button>
                  )}
                  {referralSubmitted && (
                    <button
                      className="w-[8vw] px-[1rem] py-[0.75rem] text-white border border-black bg-black hover:bg-gray-800  max767:w-[20vw]"
                      onClick={handleReferralReset}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center px-[1rem] py-[0.75rem]">
                <p
                  className="mb-2 w-full text-left text-[0.76rem]"
                  style={{
                    color: referralSubmitted
                      ? "green"
                      : referralError
                        ? "red"
                        : "gray",
                  }}
                >
                  {referralSubmitted
                    ? "code submitted"
                    : referralError
                      ? "Invalid discount code"
                      : "If you have a discount code, enter it here"}
                </p>
                <div className="flex justify-center items-center">
                  <input
                    type="text"
                    placeholder="Discount code"
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-[18vw] px-[1rem] py-[0.75rem] border outline-none focus:outline-none max767:w-[70vw]"
                    disabled={referralSubmitted} // Disable input if referral code is submitted
                  />
                  {!referralSubmitted && (
                    <button
                      className="w-[8vw] px-[1rem] py-[0.75rem] text-white border border-black bg-black hover:bg-gray-800  max767:w-[22vw]"
                      onClick={handleReferralSubmit}
                      disabled={referralSubmitted} // Disable button if referral code is submitted
                    >
                      Submit
                    </button>
                  )}
                  {referralSubmitted && (
                    <button
                      className="w-[8vw] px-[1rem] py-[0.75rem] text-white border border-black bg-black hover:bg-gray-800  max767:w-[20vw]"
                      onClick={handleReferralReset}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {isLoading && !isModalOpen && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-2xl mb-2">{statusMessage}</p>
            <BarLoader
              color="#000000"
              height={6}
              speedMultiplier={1}
              width={400}
            />
          </div>
        </div>
      )}
      {isModalOpen && (
        <animated.div
          style={animation}
          className="absolute m-auto top-[20%] z-[1000]"
        >
          <ReceiptCard
            subscriptionIds={receiptDetails.subscriptionId}
            amount={receiptDetails.amount}
            currencySymbol={currencySymbol}
            renewalDate={receiptDetails.renewalDate}
            paymentDate={receiptDetails.paymentDate}
            institution={receiptDetails.institution}
            planDetails={receiptDetails.planDetails}
            email={receiptDetails.email}
          />
        </animated.div>
      )}
    </div>
  );
};

export default Cart;
