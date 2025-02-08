import React, { useContext } from 'react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import Context from '../Context/Context';

const PaymentHistory = ({ institution }) => {
  const { paymentHistory } = useContext(Context);
  const urlParams = new URLSearchParams(window.location.search);
  const color = {
    primary: "#"+(urlParams.get('primary')),
    secondary: "#"+(urlParams.get('secondary'))
  };
  
  if (!color) {
    return <div>Error: Institution color not found</div>;
  }

  // Function to format the date
  const formatDate = (timestamp) => {
    return format(new Date(timestamp), 'yyyy-MM-dd');
  };

  // Access payments and products from the paymentHistory object, with checks
  const payments = paymentHistory?.payments || [];
  const products = paymentHistory?.profile?.products || [];

  // Mapping of currency codes to symbols
  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    // Add more currency symbols as needed
  };

  const getCurrencySymbolUnicode = (symbol) => {
    switch (symbol) {
      case '₹':
        return 'Rs.';
      case '$':
        return '\u0024';
      // Add more currency symbols here if needed
      default:
        return symbol;
    }
  };

  const downloadReceiptPDF = (payment, product) => {
    const { paymentId, amount, currency, paymentDate, renewDate } = payment;
    const customWidth = 176; // B5 width
    const customHeight = 225; // Custom height less than B5 height
    const pdf = new jsPDF('p', 'mm', [customWidth, customHeight], true);

    // Get the correct Unicode for the currency symbol
    const currencySymbolUnicode = getCurrencySymbolUnicode(currencySymbols[currency]);

    // Title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Payment Successful", customWidth / 2, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text("--------------------------------------------------------------------------------------------------------------------------------------------------------------", customWidth / 2, 30, { align: 'center' });

    let yOffset = 40;
    const lineHeight = 8;
    const sectionSpacing = 10;
    const labelX = 10;
    const valueX = 45; // Adjust this value to set the alignment for the text

    // Institution
    pdf.setFont('helvetica', 'bold');
    pdf.text("Institution:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(institution, valueX, yOffset);
    yOffset += lineHeight;

    // Email
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Email:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(paymentHistory?.profile?.emailId || '', valueX, yOffset);
    yOffset += lineHeight;

    // Subscription ID
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Subscription ID:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(paymentId, valueX, yOffset);
    yOffset += lineHeight;

    // Plan Details
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Plan Details:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    const planDetailLines = pdf.splitTextToSize(product || 'Unknown Product', 130); // Adjust the width for B5
    planDetailLines.forEach((line, index) => {
      pdf.text(line, valueX, yOffset + (index * lineHeight));
    });
    yOffset += lineHeight * planDetailLines.length;

    // Amount
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Amount:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${currencySymbolUnicode} ${(amount / 100).toFixed(2)}`, valueX, yOffset);
    yOffset += lineHeight;

    // Payment Date
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Payment Date:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatDate(paymentDate), valueX, yOffset);
    yOffset += lineHeight;

    // Renew Date
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Renew Date:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatDate(renewDate), valueX, yOffset);
    yOffset += lineHeight;

    // Bottom Border
    yOffset += sectionSpacing * 2;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text("--------------------------------------------------------------------------------------------------------------------------------------------------------------", customWidth / 2, yOffset, { align: 'center' });

    pdf.save(`receipt_${new Date().toISOString()}.pdf`);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg overflow-x-auto overflow-y-auto w-[80vw] min-h-[80vh] max600:h-screen max600:mt-[8rem] max767:w-[90vw]">
        <div className=" border-b border-black grid grid-cols-7 gap-4 p-4 text-[#000000] max767:hidden">
          <div className="font-bold col-span-1">Payment ID</div>
          <div className="font-bold col-span-2">Products</div>
          <div className="font-bold col-span-1">Payment Date</div>
          <div className="font-bold col-span-1">Renew Date</div>
          <div className="font-bold col-span-1">Amount</div>
          <div className="font-bold col-span-1"></div>
        </div>

        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <div key={index} className="border-t border-b p-3 md:border-none border-black grid grid-cols-1 md:grid-cols-7 py-6 items-center max600:border-black max600:mt-[1rem]">
              <div className="col-span-1 flex flex-col md:flex-row items-start md:items-center space-y-2 max767:space-y-0 md:space-x-4">
                <div className="font-bold md:hidden">Payment ID:</div>
                <div>{payment.paymentId}</div>
              </div>
              <div className="col-span-2 flex flex-col md:flex-row items-start md:items-center space-y-2 max767:space-y-0 md:space-x-4">
                <div className="font-bold md:hidden max767:mt-[0.5rem]">Products:</div>
                <div>{products[index]?.S || 'Unknown Product'}</div>
              </div>
              <div className="col-span-1 flex flex-col md:flex-row items-start md:items-center space-y-2 max767:space-y-0 md:space-x-4">
                <div className="font-bold md:hidden max767:mt-[0.5rem]">Payment Date:</div>
                <div>{formatDate(payment.paymentDate)}</div>
              </div>
              <div className="col-span-1 flex flex-col md:flex-row items-start md:items-center space-y-2 max767:space-y-0 md:space-x-4">
                <div className="font-bold md:hidden max767:mt-[0.5rem]">Renew Date:</div>
                <div>{formatDate(payment.renewDate)}</div>
              </div>
              <div className="col-span-1 flex flex-col md:flex-row items-start md:items-center space-y-2 max767:space-y-0 md:space-x-4">
                <div className="font-bold md:hidden max767:mt-[0.5rem]">Amount:</div>
                <div>{`${currencySymbols[payment.currency] || ''} ${(payment.amount) / 100}`}</div>
              </div>
              <div className="col-span-1 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => downloadReceiptPDF(payment, products[index]?.S)}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center">No payment history available.</div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;