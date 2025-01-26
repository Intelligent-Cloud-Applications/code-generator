import { Card, Table } from 'flowbite-react';
import { useContext, useEffect, useState } from "react";
import institutionContext from "../../../../Context/InstitutionContext";
import { API } from "aws-amplify";
import { PaginatedTable } from "../../../../common/DataDisplay";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Context from "../../../../Context/Context";
import { institution } from "../../../../utils/constants";

const Billing = () => {
  // const {PrimaryColor} = useContext(institutionContext).institutionData;
  const { userData, util, productList } = useContext(Context);
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const [renewDate, setRenewDate] = useState(userData.renewDate);
  const [amount, setAmount] = useState('$0');
  const [productName, setProductName] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      util.setLoader(true);
      try {
        const products = {};
        for (let product of productList) {
          products[product.productId] = product;
        }
        console.log(products);

        const response = await API.get(
          'awsaiapp',
          `/getReciept/${institution}/${userData.cognitoId}`,
          {}
        );
        console.log("Response:", response)
        const sortedData = response.payments
          .toSorted((a, b) => b.paymentDate - a.paymentDate);
        const data = sortedData
          .map((object, index) => [
            (new Date(object.paymentDate)).toLocaleDateString(),
            // response.profile.products[index].S,
            products[object.productId].heading,
            object.paymentMode,
            `${object.currency === 'USD' ? '$' : '₹'}${object.amount / 100}`
          ]);
        // .flatMap(item => Array(6).fill(item));
        setOrderHistory(data);
        setAmount(data[0][3]);
        setProductName(data[0][1]);
        setRenewDate(response.payments[0].renewDate)
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        util.setLoader(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='mx-8 p-8 bg-gray-100 font-family'>
      <h2 className='text-2xl font-bold'>Membership Details</h2>
      <div className='bg-white my-4 p-4'>
        <p className='bg-primaryColor text-white font-bold w-fit -ml-6 my-2 py-2 px-4 rounded-r-full'
           style={{
             backgroundColor: InstitutionData.LightPrimaryColor,
           }}
        >Member since {(new Date(userData.joiningDate).toDateString())}</p>
        <p className='text-xl font-bold'>{productName}</p>
        <p className='text-lg'>{amount}</p>
        <br />
        <p className='text-xl font-bold'>Next billing date</p>
        <p>{(new Date(renewDate)).toLocaleDateString()}</p>
      </div>

      <h2 className='text-2xl font-bold mt-16 mb-8'>Billing History</h2>
      <div>
        <PaginatedTable
          head={['Date', 'Description', 'Payment Method', 'Amount']}
          data={orderHistory}
          itemsPerPage={5}
        />
      </div>
    </div>
  )

  // return (
  //   <div className='mt-4 mx-4'>
  //     <h1 className='text-4xl font-bold'>Billing</h1>
  //
  //     <div className='flex flex-row flex-wrap justify-center items-center'>
  //       <div style={{backgroundColor: PrimaryColor}} className='w-max-xl rounded-3xl p-4 mt-8 mx-4 text-white'>
  //         <h2>Your Subscription</h2>
  //         <p className='text-xl font-bold'>{userData.products.slice(-1)[0].S}</p>
  //         <br/>
  //         <p>Renews on {(new Date(userData.renewDate)).toDateString()}</p>
  //       </div>
  //
  //       <div style={{backgroundColor: PrimaryColor}} className='w-max-md rounded-3xl p-4 mt-8 mx-4 text-white'>
  //         <h2>You are currently paying:</h2>
  //         <p className='text-xl font-bold'>{amount}</p>
  //         <br/>
  //         <p>Click here to cancel.</p>
  //       </div>
  //     </div>
  //
  //     <div className='max-w-4xl mt-16 mx-auto'>
  //       <h2 className='text-2xl font-bold'>Your Order History:</h2>
  //       <PaginatedTable
  //           head={['Date', 'Description', 'Payment Method', 'Amount']}
  //           data={orderHistory}
  //       />
  //     </div>
  //
  //   </div>
  // )
}

export default Billing;
