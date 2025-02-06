import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from 'aws-amplify';

const Cafepayment = () => {
  const { orderId, institution } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [institutionData, setInstitutionData] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
       
        const orderResponse = await API.get('cafe', `/any/get-order/${institution}`, {
          queryStringParameters: { orderId },
        });
        const currentOrder = orderResponse.orders?.find((o) => o.orderId === orderId);
        if (!currentOrder) {
          throw new Error('Order not found in response');
        }
        setOrder(currentOrder);
        

        const institutionResponse = await API.get('cafe', `/any/cafe-detail/${institution}`);
        setInstitutionData(institutionResponse);

       
        const paymentResponse = await API.get('awsaiapp', `/Cafe/order/create/${institution}/${orderId}`);
        setOrderDetails(paymentResponse.razorpayOrder);

        setLoading(false);
      } catch (e) {
        console.error('Error fetching data:', e);
        setError('Failed to fetch necessary details. Please try again.');
        setLoading(false);
      }
    };

    fetchAllData();
  }, [orderId, institution]);
  useEffect(() => {
    if (orderDetails && institutionData) {
      handlePayment();
    }
  }, [orderDetails, institutionData]);
  const handlePayment = async () => {
    if (!orderDetails || !institutionData) {
      setError('Payment details are missing. Please try again.');
      return;
    }
    setLoading(true);
    const options = {
      key:  process.env.REACT_APP_STAGE === 'DEV'?process.env.REACT_APP_RAZORPAY_TEST_KEY_ID 
      : process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: institutionData?.name?.toUpperCase() || institution.toUpperCase(),
      description: `Payment for Order ID: ${orderId}`,
      order_id: orderDetails.id,
      handler: async (response) => {
        try {
          const verificationResponse = await API.get(
            'awsaiapp',
            `/Cafe/order/verify/${institution}/${orderId}`,
            {
              queryStringParameters: {
                paymentStatus: 'success',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            }
          );
          await API.post('cafe', '/any/lambda-calling', {
            body: {
              orderId: orderId,
              institution: institution,
              userType: 'chef',
            },
          });
          await API.post('cafe', '/any/lambda-calling', {
            body: {
              orderId: orderId,
              institution: institution,
              userType: 'admin',
            },
          });
          alert(verificationResponse.message);
           const isProd = process.env.REACT_APP_STAG === 'PROD'; 
      const baseDomain = institutionData.domainLink 
        ? institutionData.domainLink.endsWith('/') 
          ? `${institutionData.domainLink}product`
          : `${institutionData.domainLink}/product`
        : isProd 
          ? `${institutionData.institution}.awsaiapp.com/product`
          : `beta${institutionData.institution}.awsaiapp.com/product`;
          const url = `${baseDomain}?tableName=${order.tableName}`;
         
          window.location.href = url; 
          setLoading(false);
        } catch (err) {
          console.error('Payment verification failed:', err);
          setError('Payment verification failed. Please contact support.');
          setLoading(false);
        }
      },
      prefill: {
        name: '',
        email: '',
      },
      theme: {
        color: institutionData?.PrimaryColor || '#4CAF50',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment popup closed.');
         const isProd = process.env.REACT_APP_STAG === 'PROD'; 
      const baseDomain = institutionData.domainLink 
        ? institutionData.domainLink.endsWith('/') 
          ? `${institutionData.domainLink}product`
          : `${institutionData.domainLink}/product`
        : isProd 
          ? `${institutionData.institution}.awsaiapp.com/product`
          : `beta${institutionData.institution}.awsaiapp.com/product`;
          const url = `${baseDomain}?tableName=${order.tableName}`;
          window.location.href = url;
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

 
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r ">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 mb-2"></div>
          <p className="text-sm text-blue-800">Loading Payment Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Oops!</h2>
          <p className="text-sm text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: institutionData?.SecondaryColor || '#e0f7fa' }}
    >
      <nav className="bg-white/80 backdrop-blur-sm shadow-md p-2">
        <div className="container mx-auto flex justify-between items-center">
          {institutionData?.logoUrl ? (
            <img
              src={institutionData.logoUrl}
              alt="Institution Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shadow-md"
              style={{ backgroundColor: institutionData?.PrimaryColor || '#81C784' }}
            >
              {institution.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
          style={{ border: `3px solid ${institutionData?.PrimaryColor || '#81C784'}` }}
        >
          <div className="p-4 space-y-4">
            <h2
              className="text-xl font-bold text-center pb-2 border-b"
              style={{ color: institutionData?.PrimaryColor || '#4CAF50' }}
            >
              Payment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold text-gray-900">{orderId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Institution:</span>
                <span className="font-semibold uppercase text-gray-900">{institution}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Amount:</span>
                <span
                  className="text-xl font-bold"
                  style={{ color: institutionData?.PrimaryColor || '#4CAF50' }}
                >
                  ₹{orderDetails.amount / 100}
                </span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className="w-full py-3 rounded-lg text-base font-bold"
              style={{
                backgroundColor: institutionData?.PrimaryColor || '#81C784',
                color: '#fff',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cafepayment;
