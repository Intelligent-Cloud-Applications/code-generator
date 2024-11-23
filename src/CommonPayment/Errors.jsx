import { toast } from 'react-toastify';

const displayError = (errorCode) => {
  let errorMessage = "An unexpected error occurred. Please try again later.";

  if (errorCode.includes('User data not found for institutionId')) {
    errorMessage = "We couldn't find your account information. Please ensure you are logged in and try again.";
  } else if (errorCode.includes('Error fetching plan')) {
    errorMessage = "There was an issue retrieving the plan details for your selected product. Please try again later.";
  } else if (errorCode.includes('Subscription already active for productId')) {
    errorMessage = "You already have an active subscription for this product.";
  } else if (errorCode.includes('Error during payment handler')) {
    errorMessage = "There was an issue processing your payment. Please try again later or contact support.";
  } else if (errorCode.includes('Referral code not found or invalid')) {
    errorMessage = "The referral code you entered is invalid. Please check the code and try again.";
  } else if (errorCode.includes('Error accessing the database')) {
    errorMessage = "There was an issue accessing our database. Please try again later.";
  } else if (errorCode.includes('Error creating invoice')) {
    errorMessage = "There was an issue generating your invoice. Please try again later.";
  }
  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
  });
};

export default displayError;
