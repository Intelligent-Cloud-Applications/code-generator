import { Card, Table } from 'flowbite-react';
import {useContext, useEffect, useState} from "react";
import institutionContext from "../../../../Context/InstitutionContext";
import {API} from "aws-amplify";
import { PaginatedTable } from "../../../../common/DataDisplay";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Context from "../../../../Context/Context";
import { institution } from "../../../../utils/constants";

const Billing = () => {
  const {PrimaryColor} = useContext(institutionContext).institutionData;
  const {userData, productList, util} = useContext(Context);
  const [renewDate, setRenewDate] = useState('');
  const [amount, setAmount] = useState('$0');
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      util.setLoader(true);
      try {
        const response = await API.get(
          'awsaiapp',
          `/getReciept/${institution}/${userData.cognitoId}`,
          {}
        );
        const data = response.payments
          .map((object, index) => [
            (new Date(object.paymentDate)).toDateString(),
            response.profile.products[index].S,
            // 'hello',
            object.paymentMode,
            `${object.currency === 'USD' ? '$' : '₹'}${object.amount / 100}`
          ]);
        setOrderHistory(data);
        setAmount(data.slice(-1)[0][3]);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        util.setLoader(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='mt-4 mx-4'>
      <h1 className='text-4xl font-bold'>Billing</h1>

      <div className='flex flex-row flex-wrap justify-center items-center'>
        <div style={{backgroundColor: PrimaryColor}} className='w-max-xl rounded-3xl p-4 mt-8 mx-4 text-white'>
          <h2>Your Subscription</h2>
          <p className='text-xl font-bold'>{userData.products.slice(-1)[0].S}</p>
          <br/>
          <p>Renews on {(new Date(userData.renewDate)).toDateString()}</p>
        </div>

        <div style={{backgroundColor: PrimaryColor}} className='w-max-md rounded-3xl p-4 mt-8 mx-4 text-white'>
          <h2>You are currently paying:</h2>
          <p className='text-xl font-bold'>{amount}</p>
          <br/>
          <p>Click here to cancel.</p>
        </div>
      </div>

      <div className='max-w-4xl mt-16 mx-auto'>
        <h2 className='text-2xl font-bold'>Your Order History:</h2>
        <PaginatedTable
            head={['Date', 'Description', 'Payment Method', 'Amount']}
            data={orderHistory}
        />
      </div>

    </div>
  )
}

export default Billing;