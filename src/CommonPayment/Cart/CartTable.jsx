import React, { useState, useEffect, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useParams } from 'react-router-dom';
import colors from '../../color.json';
import { API } from 'aws-amplify';
import Context from '../../Context/Context';

const CartTable = ({ product, removeItem }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const { getCartItems } = useContext(Context);
  const { institution, cognitoId } = useParams();
  const color = colors[institution];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  const removeProduct = async (index, productId) => {
    try {
      setDeletingIndex(index);
      removeItem(index);

      // API call after updating UI
      await API.del('awsaiapp', `/any/deleteCartItem/${institution}/${cognitoId}`, {
        body: {
          productId: productId,
        },
      });

      // Refresh cart items
      getCartItems(institution, cognitoId);
    } catch (error) {
      console.error('Error removing product:', error);
      // If there is an error, reset the deleting index
      setDeletingIndex(null);
    } finally {
      // Always reset the deleting index after the operation
      setDeletingIndex(null);
    }
  };

  return (
    <section className="w-[60vw] flex mt-[2.5rem] gap-3 px-[1.25rem] pb-[2.5rem] items-center max767:w-full">
      {product.length === 0 ? (
        <div className="w-full text-center py-[2.5rem]">
          <p className="text-lg text-[black] border-t border-r border-l border-black font-semibold">YOUR CART IS EMPTY</p>
          <div className="text-[black] text-[1.5rem] py-[0.5rem] px-[1rem] h-24 border border-black text-center font-[600] inter flex items-center">
            Add Some Products
          </div>
        </div>
      ) : (
        <table className="table-fixed w-full max767:w-[95vw] border text-[#555555] ">
          <thead className="h-16" style={{ backgroundColor: color.primary }}>
            <tr>
              <th className="text-white w-1/3 max767:w-1/2" style={{ backgroundColor: color.primary }}>ITEM</th>
              <th className="text-white w-1/3 max767:hidden" style={{ backgroundColor: color.primary }}>DESCRIPTION</th>
              <th  style={{ backgroundColor: color.primary }}></th>
              <th className="text-white w-[20%]" style={{ backgroundColor: color.primary }}>PRICE</th>
              <th className="text-white w-[20%]" style={{ backgroundColor: color.primary }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton width={150} height={30} />
                  </td>
                  <td></td>
                  <td>
                    <Skeleton width={50} height={30} />
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              ))
            ) : (
              product.map((item, index) => {
                const { heading, amount, productId, currency, description } = item;
                const currencySymbol = currency === 'INR' ? '₹' : '$';
                return (
                  <tr key={index} className={`${deletingIndex === index ? 'animate-fade-out' : ''}`}>
                    <td className="w-1/2">
                      <div className="flex">
                        <div className="flex flex-col justify-center">
                          <p className="text-md font-bold max767:font-[300] max767:text-[0.8rem]">
                            {heading}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="w-1/3 max767:hidden">{description}</td>
                    <td></td>
                    <td className="w-[10%] inter font-bold">
                      {currencySymbol}{(amount / 100)}
                    </td>
                    <td className="w-[5%] align-middle">
                      <span
                        onClick={() => removeProduct(index, productId)}
                        className="m-0 text-[1.7rem] h-8 w-8 cursor-pointer"
                      >
                        ×
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default CartTable;