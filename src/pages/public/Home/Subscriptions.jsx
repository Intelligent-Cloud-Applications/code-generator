import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Context from '../../../Context/Context';
import HappyprancerPaypalMonthly from '../Subscription/HappyprancerPaypalMonthly';
import HappyprancerPaypalHybrid from '../Subscription/HappyprancerPaypalHybrid';
import InstitutionContext from '../../../Context/InstitutionContext';
import RazorpayPayment from '../Subscription/RazorpayPayment';

const Subscription = () => {
  const { institutionData: InstitutionData } = useContext(InstitutionContext);
  const { isAuth, productList, userData: UserCtx } = useContext(Context);
  const Navigate = useNavigate();

  const text = {
    Heading: 'Monthly Membership Subscription',
    SubHeading: 'See the pricing details below',
  };

  const [bgInView, setBgInView] = useState(false);

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
      { threshold: 0.01} // Adjust threshold as needed
    );

    const element = document.getElementById('subscription-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const paymentHandler = (item) => {
    if (isAuth) {
      if (UserCtx?.status === 'Active' && UserCtx?.productIds?.some((productId) => productId === item.productId)) {
        return (
          <p
            className={`text-[1rem] w-[15rem] px-12 py-2 rounded-2xl border-[0.2rem] h-[3rem] flex justify-center items-center`}
            style={{
              color: InstitutionData.LightPrimaryColor,
              borderColor: InstitutionData.LightPrimaryColor,
            }}
          >
            Subscribed
          </p>
        );
      } else {
        if (item.currency === 'INR' ) {
          return <RazorpayPayment productId={item.productId} />;
        } else if (item.currency === 'USD' && item.subscriptionType === 'Monthly') {
          return <HappyprancerPaypalMonthly />;
        } else if (item.currency === 'USD' && item.subscriptionType === 'Hybrid') {
          return <HappyprancerPaypalHybrid />;
        }
      }
    } else {
      return (
        <button
          onClick={() => {
            Navigate('/signup');
          }}
          className={`w-[15rem] px-12 py-2 rounded-2xl hover:text-lightPrimaryColor hover:bg- hover:border-lightPrimaryColor hover:border-[0.3rem] h-[3rem] flex justify-center items-center mt-auto mb-10 text-white`}
          style={{
            backgroundColor: InstitutionData.LightPrimaryColor,
          }}
        >
          Sign Up
        </button>
      );
    }
  };

  return (
    <div
      id="subscription-section"
      className={`Back text-[1.5rem] flex flex-col items-center h-auto min-h-screen max980:h-[auto] justify-center gap-[5rem] `}
      style={{
        backgroundImage: bgInView ? `url(${InstitutionData.SubscriptionBg})` : 'none',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundColor: bgInView ? 'transparent' : 'black',
        transition: 'background-color 0.3s ease-in-out',
      }}
    >
      <div className="text-center sans-serif mt-4">
        <h1
        className='text-[3rem] max850:text-[1.5rem] font-[700]'
          style={{
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          Monthly Membership Subscription
        </h1>
        <h3
          className="text-[1rem] mt-2 max850:text-[.7rem] font-[600]"
          style={{
            color: 'black',
          }}
        >
          See the pricing details below
        </h3>
      </div>
      <ul className="flex flex-wrap justify-center w-[90vw] max-w-[80rem] gap-16 pl-0">
        {productList.map((item, i) => (
          <li
            key={item.productId + `home${i}`}
            className="subscription-card w-full sm:w-[45%] lg:w-[30%] py-6 px-8 rounded-[2rem] z-10 flex flex-col items-center gap-4 shadowSubscribe bg-white border-[0.1rem]"
            style={{ borderColor: InstitutionData.LightPrimaryColor }}
          >
            <p className="text-[1.6rem] font-bold text-center">{item.heading}</p>
            <ul className="text-[1rem] pl-0 flex flex-col items-center gap-2 ">
              {item.provides.map((provide, j) => (
                <li key={`${i}-provide-${j}`} className="text-center">
                  <p>{provide}</p>
                </li>
              ))}
            </ul>
            <div className="flex-grow"></div>
            <h1 className="w-[100%] text-center text-[2.3rem] font-bold">
              {(item.currency === 'INR' ? '₹ ' : '$ ') + parseInt(item.amount) / 100 + '/' + item.durationText}
            </h1>
            <div className="z-1 flex justify-center items-center mt-auto mb-10">
              {paymentHandler(item)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subscription;
