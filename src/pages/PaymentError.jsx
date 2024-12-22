import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Context from "../Context/Context";
import { useContext } from "react";
const PaymentError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = location.state || {};
  const { institution, cognitoId, emailId } = useContext(Context).userData;

  console.log(`Incoming Message ${message}`);
  return (
    <div className="payment-error-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
      {message ? (
        <>
          <p className="text-lg text-gray-700 mb-2">{message}</p>
        </>
      ) : (
        <p className="text-md text-gray-600 mb-6">
          If the amount was debited from your account, don’t worry, we will
          refund it within 24 hours. If you have any questions, please contact
          us.
        </p>
      )}

      <div className="payment-error-actions flex space-x-4">
        <button
          className="retry-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() =>
            navigate(`/allpayment/${institution}/${cognitoId}/${emailId}`)
          }
        >
          Retry Payment
        </button>

        <button
          className="contact-button bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={() => navigate("/query")}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default PaymentError;
