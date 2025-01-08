import React, { useEffect, useState, useContext } from 'react';
import tick from '../utils/tick.png';
import { useParams, useSearchParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Context from '../../Context/Context';

function Card({ product, setActiveComponent, userType, setIsEditPopupOpen, handleSetSelectedProduct }) {
  const [isLoading, setIsLoading] = useState(true);
  const { institution, cognitoId } = useParams();
  const { getCartItems, isProductInCart, addCartItem } = useContext(Context);
  const util = useContext(Context).util;
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchParams] = useSearchParams();
  const color = {
    primary: searchParams.get('primary') || '#000',
    secondary: searchParams.get('secondary') || '#000'
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = async () => {
    try {
      setIsAnimating(true);
      util.setLoader(true);
      await addCartItem(product, institution, cognitoId);
      await getCartItems(institution, cognitoId);
      setTimeout(() => {
        setIsAnimating(false);
        util.setLoader(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAnimating(false);
    }
  };

  const isInCart = isProductInCart(product.planId);
  const handleEditProduct = () => {
    handleSetSelectedProduct(product);
    // setActiveComponent('EditPayment');
  };
  return (
    <div className={`bg-white w-80 min-h-[30rem] flex flex-col ${institution === 'awsaiapp' ? " w-[25rem] h-[45rem]" : ""}`}
      style={{
        boxShadow: `0px 0px 20px rgba(0, 0, 0, 0.3)`,
      }}
    >
      <h2 className='text-xl font-bold text-center text-white py-2 px-1 capitalize'
        style={{
          backgroundColor: color.primary
        }}
      >
        {isLoading ? <Skeleton width={150} /> : product.heading}
      </h2>
      <div className="flex flex-col flex-grow mt-9 h-full">
        <ul className='space-y-3 px-[1rem]'>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className='flex items-start'>
                <Skeleton width={20} height={20} />
                <Skeleton width={200} height={20} className='ml-2' />
              </li>
            ))
          ) : (
            Array.isArray(product.provides) ? (
              product.provides.map((item, index) => (
                <li key={index} className='flex items-start'>
                  <img className='mt-[8px]' src={tick} alt="" />
                  <span className={`ml-2 text-[#202020] text-[1.2rem] font-[600]${institution === "lissome" || 'awsaiapp' ? " text-[13px]" : ""}`}>{item}</span>
                </li>
              ))
            ) : null
          )}
        </ul>
      </div>
      <div className='flex flex-col items-center justify-center relative bottom-8'>
        <div className='text-center mb-6'>
          {isLoading ? (
            <Skeleton width={100} height={30} />
          ) : (
            <span className='text-[2rem] font-bold'>{product.currency === 'INR' ? '₹' : '$'}{(product.amount / 100).toFixed(2)}</span>
          )}
        </div>
        {/* awsaiapp excluded */}
        {(userType === 'admin' && institution !== 'awsaiapp') ? (
          <button
            className="text-white font-bold py-2 px-[1rem] rounded focus:outline-none focus:shadow-outline  mt-4"
            onClick={handleEditProduct}
            style={{
              backgroundColor: color.primary
            }}
          >
            Edit Product
          </button>
        ) : (
          <button
            className={`w-[90%] text-center gap-4 flex items-center justify-center ${isAnimating ? 'animate-loader' : ''} ${isInCart ? 'text-black font-[700] p-[5px]' : "text-white p-2"}`}
            onClick={isInCart ? () => setActiveComponent('Cart') : handleAddToCart}
            disabled={isLoading}
            style={{
              backgroundColor: isInCart ? 'transparent' : color.primary,
              border: isInCart ? `3px solid ${color.primary}` : 'none'
            }}
          >
            {isLoading ? <Skeleton width={100} height={30} /> : isInCart ? 'GO TO CART' : 'ADD TO CART'}
            {!isLoading && !isAnimating && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            )}
          </button>
        )}

      </div>
    </div>
  );
}

export default Card;