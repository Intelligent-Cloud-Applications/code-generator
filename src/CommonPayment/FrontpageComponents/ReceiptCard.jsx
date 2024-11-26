import React from 'react';
import colors from '../../color.json';
import jsPDF from 'jspdf';
import invoice from '../utils/check.png';

const ReceiptCard = ({ subscriptionIds = [], currencySymbol, amount, paymentDate, institution, planDetails, email, renewalDate, }) => {
  const color = colors[institution];
  const plans = planDetails.split(', ');

  const handleBackClick = () => {
    window.close();
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

  const downloadReceiptPDF = () => {
    const customWidth = 176; // B5 width
    const customHeight = 225; // Custom height less than B5 height
    const pdf = new jsPDF('p', 'mm', [customWidth, customHeight], true);

    // Get the correct Unicode for the currency symbol
    const currencySymbolUnicode = getCurrencySymbolUnicode(currencySymbol);

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
    pdf.text(email, valueX, yOffset);
    yOffset += lineHeight;


    // Subscription ID
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Subscription ID:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    subscriptionIds.forEach((id, index) => {
      pdf.text(id, valueX, yOffset + (index * lineHeight));
    });
    yOffset += lineHeight * subscriptionIds.length;

    // Plan Details
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Plan Details:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    const planDetailLines = pdf.splitTextToSize(planDetails.replace(/<\/?[^>]+(>|$)/g, ""), 130); // Adjust the width for B5
    planDetailLines.forEach((line, index) => {
      pdf.text(line, valueX, yOffset + (index * lineHeight));
    });
    yOffset += lineHeight * planDetailLines.length;

    // Amount
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Amount:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${currencySymbolUnicode} ${amount}`, valueX, yOffset);
    yOffset += lineHeight;

    // Payment Date
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Payment Date:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(paymentDate, valueX, yOffset);
    yOffset += lineHeight;

    // Renew Date
    yOffset += sectionSpacing;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Renew Date:", labelX, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(renewalDate, valueX, yOffset);
    yOffset += lineHeight;

    // Bottom Border
    yOffset += sectionSpacing * 2;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text("--------------------------------------------------------------------------------------------------------------------------------------------------------------", customWidth / 2, yOffset, { align: 'center' });

    pdf.save(`receipt_${new Date().toISOString()}.pdf`);
  };

  return (
    <div id="receipt" className="receipt-card relative" style={cardStyle}>
      <h2 className='font-bold text-xl text-center mb-4'>Payment Successful</h2>
      <div className='font-bold mb-2'>------------------------------------------------</div>
      <div className='text-lg mb-2 flex'>
        <strong className='mr-2 '>Institution:</strong>
        <span>{institution}</span>
      </div>

      <div className='text-lg mb-2 flex'>
        <strong className='mr-2'>Email:</strong>
        <span>{email}</span>
      </div>

      <div className='text-lg mb-2 flex'>
        <strong className='mr-2'>Subscription ID:</strong>
        <div>
          <ul>
            {subscriptionIds.length > 0 ? (
              subscriptionIds.map((id, index) => (
                <li key={index}>{id}</li>
              ))
            ) : (
              <li>No subscription IDs available</li>
            )}
          </ul>
        </div>
      </div>

      <div className='text-lg mb-2 flex'>
        <strong className='mr-2'>Plan Details:</strong>
        <div>
          <ul>
            {plans.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>


      <div className='text-lg mb-2 flex'>
        <strong className='mr-2 '>Amount:</strong>
        <span>{currencySymbol} {amount}</span>
      </div>
      <div className='text-lg mb-2 flex'>
        <strong className='mr-2 w-[auto] '>Payment Date:</strong>
        <span>{paymentDate}</span>
      </div>

      <div className='text-lg mb-2 flex'>
        <strong className='mr-2 w-[auto]'>Renew Date:</strong>
        <span>{renewalDate}</span>
      </div>

      <div className='font-bold mt-2'>------------------------------------------------</div>
      <button id="nextButton" className='w-full p-2 text-white mt-8' onClick={handleBackClick} style={{ backgroundColor: color.primary }}>
        GO Back
      </button>
      <button id="downloadButton" className='w-full p-2 text-white mt-4 flex gap-3 justify-center text-[1.1rem]' onClick={downloadReceiptPDF} style={{ backgroundColor: color.primary }}>
        Download Receipt
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
      <img className="absolute top-5 right-7 w-7 h-7" src={invoice} alt='' />

    </div>
  );
};

const cardStyle = {
  padding: '20px',
  boxShadow: '0 0px 18px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#fff',
  textAlign: 'left',
  width: "25rem",
};

export default ReceiptCard;