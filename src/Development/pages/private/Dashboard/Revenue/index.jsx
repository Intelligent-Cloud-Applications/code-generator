import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Pagination, Table, Dropdown } from "flowbite-react";
import { API } from 'aws-amplify';
import Context from '../../../../Context/Context';
import InstitutionContext from '../../../../Context/InstitutionContext';
function PaymentDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cashoutAmount, setCashoutAmount] = useState(0);
  const { userData, revenue } = useContext(Context);
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const months = useMemo(() => [
    'All time', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);

  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth]);

  console.log(userData)
  const years = useMemo(() => {
    return [currentYear, currentYear - 1, currentYear - 2];
  }, [currentYear]);

  useEffect(() => {
    const fetchCashoutAmount = async () => {
      try {
        const response = await API.get('main', `/cashCollected/${userData.institution}`);
        console.log(response)
        setCashoutAmount(response.cashout);
      } catch (error) {
        console.error('Error fetching cashout amount:', error);
      }
    };

    fetchCashoutAmount();
  }, [userData.institution]);

  // Filter payments based on the selected year and month
  const filteredPayments = useMemo(() => {
    if (selectedYear === 'All time') {
      return revenue;
    }

    return revenue?.filter(payment => {
      const date = new Date(payment.paymentDate);
      const paymentYear = date.getFullYear();
      const paymentMonth = date.getMonth() + 1;

      const isYearMatch = paymentYear === parseInt(selectedYear);
      const isMonthMatch = selectedMonth === 'All time' || paymentMonth === months.indexOf(selectedMonth);

      return isYearMatch && isMonthMatch;
    });
  }, [revenue, selectedYear, selectedMonth, months]);

  // Calculate total amounts based on filtered payments
  const totalOnlineAmount = useMemo(() => {
    return filteredPayments
      ?.filter(payment => payment.paymentMode === 'online')
      .reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
  }, [filteredPayments]);

  const totalOfflineAmount = useMemo(() => {
    return filteredPayments
      ?.filter(payment => payment.paymentMode === 'offline')
      .reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
  }, [filteredPayments]);

  console.log(totalOfflineAmount)
  const selectedPayments = filteredPayments?.slice((currentPage - 1) * 7, currentPage * 7);

  const handleRowClick = (payment) => {
    console.log(payment);
  };

  const formatEpochToReadableDate = (epoch) => {
    if (!epoch) return 'N/A';
    const date = new Date(epoch);
    return date.toLocaleDateString();
  };

  const formatAmountWithCurrency = (amount, currency) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol} ${(amount / 100)}`;
  };

  const currency = revenue?.length > 0 ? revenue[0].currency : 'USD';

  // Determine the available months based on the selected year
  const availableMonths = useMemo(() => {
    if (selectedYear === currentYear) {
      // If current year is selected, show months up to the current month
      return months.slice(0, currentMonth + 1);
    }
    // If a previous year is selected, show all months
    return months;
  }, [selectedYear, currentYear, currentMonth, months]);

  return (
    <div className='p-4 Inter max850:p-1'>
      <div className='w-full h-screen'>
        {/* Year and Month Filter Section */}
        <div className="w-full flex justify-center gap-2 flex-wrap">
          <div className='border flex items-center justify-center w-[8rem] py-1 rounded-md'>
            <Dropdown label={selectedYear} inline>
              <div className=" ml-[-1rem] flex flex-col items-left">
                <Dropdown.Item onClick={() => setSelectedYear('All time')}>All time</Dropdown.Item>
                {years?.map(year => (
                  <Dropdown.Item key={year} onClick={() => setSelectedYear(year)}>{year}</Dropdown.Item>
                ))}
              </div>
            </Dropdown>
          </div>

          {/* Month Dropdown */}
          {selectedYear !== 'All time' && (
            <div className='border flex items-center justify-center w-[8rem] rounded-md'>
              <Dropdown label={selectedMonth} inline>
                {availableMonths?.map((month, index) => (
                  <Dropdown.Item key={index} onClick={() => setSelectedMonth(month)}>{month}</Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          )}
        </div>

        {/* Totals Section */}
        <div className='flex w-full justify-center flex-wrap min850:px-5 max850:gap-4'>
          <div className="flex flex-col w-1/2 max850:w-full">
            <div className='w-full'>
              <div className='w-fit p-1 px-2 text-start text-white'
                style={{
                  backgroundColor: InstitutionData.PrimaryColor
                }}
              >
                Online Collection
              </div>
            </div>
            <div className='p-4 border'>
              <div className='text-[2rem] font-[700]'>
                {formatAmountWithCurrency(totalOnlineAmount, currency)}
              </div>
              <div className='text-[0.9rem] font-[500] text-[gray]'>
                Last Cashout amount is <span className='text-green-600 text-bold'>₹{cashoutAmount?.amount}</span> on date {cashoutAmount?.paymentDate}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 max850:w-full">
            <div className='w-full flex justify-end max800:justify-start'>
              <div className='w-fit p-1 px-2 text-start text-white'
                style={{
                  backgroundColor: InstitutionData.PrimaryColor
                }}
              >
                Offline Collection
              </div>
            </div>
            <div className='p-4 h-full border'>
              <div className='text-[2rem] font-[700]'>
                {formatAmountWithCurrency(totalOfflineAmount, currency)}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className='mt-6 bg-white max-w-full mx-auto rounded-b-md'>
          <div className='overflow-x-auto border rounded-[1rem]'>
            <Table hoverable className='min-w-full'>
              <Table.Head>
                <Table.HeadCell className='px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase'>Name</Table.HeadCell>
                <Table.HeadCell className='px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase'>Phone Number</Table.HeadCell>
                <Table.HeadCell className='px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase'>Products</Table.HeadCell>
                <Table.HeadCell className='px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase'>Subscription Type</Table.HeadCell>
                <Table.HeadCell className='px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase'>Payment Mode</Table.HeadCell>
                <Table.HeadCell className='px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase'>Payment Date</Table.HeadCell>
                <Table.HeadCell className='px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase'>Amount</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y'>
                {selectedPayments?.map((payment) => (
                  <Table.Row
                    key={payment.paymentId}
                    className='hover:bg-gray-200 cursor-pointer'
                    onClick={() => handleRowClick(payment)}
                  >
                    <Table.Cell className='whitespace-nowrap text-sm text-gray-500 text-center bg-white'>
                      {payment.userDetails?.userName}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap text-sm text-gray-500 text-center bg-white'>
                      {payment.userDetails?.phoneNumber}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap text-sm text-gray-500 text-center bg-white'>
                      {payment.userDetails?.products?.length > 0 ? (
                        payment.userDetails.products?.map((product, index) => (
                          <p key={index}>{product.S}
                          </p>
                        ))
                      ) : 'N/A'}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap text-sm text-gray-500 text-center bg-white'>
                      {payment.subscriptionType}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-sm text-gray-500 text-center bg-white">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.paymentMode === "offline" ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"}`}>
                        {payment.paymentMode === "offline" ? "Offline" : "Online"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap text-sm text-gray-500 text-center bg-white'>
                      {formatEpochToReadableDate(payment.paymentDate)}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap text-sm text-gray-500 text-center bg-white'>
                      {formatAmountWithCurrency(payment.amount, payment.currency)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className='py-2 flex justify-between items-center px-4'>
          <div className='text-sm text-gray-600'>
            Showing {(currentPage - 1) * 7 + 1}-{Math.min(currentPage * (selectedPayments?.length || 0), filteredPayments?.length || 0)} of {filteredPayments?.length || 0}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((filteredPayments?.length || 0) / 7)}
            onPageChange={setCurrentPage}
            className='flex justify-end'
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;