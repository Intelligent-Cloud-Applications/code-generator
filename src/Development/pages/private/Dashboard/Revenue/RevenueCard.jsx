import React, { useMemo } from 'react';

const RevenueCard = ({ 
  currency, 
  totalCollected = 0, 
  totalPaid, 
  transactionCount = 0, 
  minAmount = 0, 
  maxAmount = 0,
  isOffline = false,
  cashoutDate
}) => {
  const getCurrencySymbol = (curr) => curr === "USD" ? "$" : "₹";
  
  const formatAmount = (amount, minimumFractionDigits = 2) => {
    return `${getCurrencySymbol(currency)}${(amount/100).toLocaleString(undefined, { 
      minimumFractionDigits,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-3 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-blue-100 p-1.5 rounded-full">
          <svg 
            className="h-5 w-5 text-blue-600" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-700">
          {isOffline ? "Offline Collection" : `${currency} Online Collection`}
        </h3>
      </div>

      {isOffline ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-500 text-center">Total Collected</div>
          <div className="text-lg font-bold text-blue-600 text-center">
            {formatAmount(totalCollected)}
          </div>
          <div className="grid grid-cols-1 gap-3 bg-gray-50 p-2 rounded-lg">
            <div className="text-center">
              <div className="font-bold text-blue-600 text-base">
                {transactionCount}
              </div>
              <div className="text-xs text-gray-600">Transactions</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Total Collected</div>
              <div className="text-lg font-bold text-blue-600">
                {formatAmount(totalCollected)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Total Paid</div>
              <div className="text-lg font-bold text-green-600">
                {formatAmount(totalPaid)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2 rounded-lg">
            <div className="text-center">
              <div className="font-bold text-blue-600 text-base">
                {transactionCount}
              </div>
              <div className="text-xs text-gray-600">Transactions</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600 text-xs">
                {formatAmount(minAmount)} - {formatAmount(maxAmount)}
              </div>
              <div className="text-xs text-gray-600">Amount Range</div>
            </div>
          </div>
          
          {cashoutDate && (
            <div className="text-xs text-gray-500 text-center">
              Last cashout on {new Date(cashoutDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RevenueSection = ({ revenue = [], cashoutAmount }) => {
  // Calculate USD stats
  const usdStats = useMemo(() => {
    const onlineUsdPayments = revenue?.filter(payment => 
      payment.paymentMode !== 'offline' && 
      payment.currency === 'USD'
    ) || [];

    return onlineUsdPayments.reduce((stats, payment) => {
      const amount = parseInt(payment.amount) || 0;
      if (!Number.isFinite(amount)) return stats;

      return {
        total: stats.total + amount,
        count: stats.count + 1,
        amounts: [...stats.amounts, amount]
      };
    }, { total: 0, count: 0, amounts: [] });
  }, [revenue]);

  // Calculate INR stats
  const inrStats = useMemo(() => {
    const onlineInrPayments = revenue?.filter(payment => 
      payment.paymentMode !== 'offline' && 
      payment.currency === 'INR'
    ) || [];

    return onlineInrPayments.reduce((stats, payment) => {
      const amount = parseInt(payment.amount) || 0;
      if (!Number.isFinite(amount)) return stats;

      return {
        total: stats.total + amount,
        count: stats.count + 1,
        amounts: [...stats.amounts, amount]
      };
    }, { total: 0, count: 0, amounts: [] });
  }, [revenue]);

  // Calculate offline stats
  const offlineStats = useMemo(() => {
    const offlinePayments = revenue?.filter(payment => 
      payment.paymentMode === 'offline'
    ) || [];

    return offlinePayments.reduce((stats, payment) => {
      const amount = parseInt(payment.amount) || 0;
      if (!Number.isFinite(amount)) return stats;
      
      return {
        total: stats.total + amount,
        count: stats.count + 1
      };
    }, { total: 0, count: 0 });
  }, [revenue]);

  // Calculate total paid amounts from cashout logs
  const paidAmounts = useMemo(() => {
    const cashoutLogs = cashoutAmount?.client?.[0]?.cashoutLogs || [];
    return {
      USD: cashoutLogs
        .filter(log => log.currency === 'USD' && log.status === 'Transferred')
        .reduce((total, log) => total + (parseFloat(log.amount) ), 0),
      INR: cashoutLogs
        .filter(log => log.currency === 'INR' && log.status === 'Transferred')
        .reduce((total, log) => total + (parseFloat(log.amount) ), 0)
    };
  }, [cashoutAmount]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <RevenueCard
        currency="USD"
        totalCollected={usdStats.total}
        totalPaid={paidAmounts.USD}
        transactionCount={usdStats.count}
        minAmount={Math.min(...usdStats.amounts)}
        maxAmount={Math.max(...usdStats.amounts)}
      />
      
      <RevenueCard
        currency="INR"
        totalCollected={inrStats.total}
        totalPaid={paidAmounts.INR}
        transactionCount={inrStats.count}
        minAmount={Math.min(...inrStats.amounts)}
        maxAmount={Math.max(...inrStats.amounts)}
        cashoutDate={cashoutAmount?.paymentDate}
      />
      
      <RevenueCard
        currency="INR"
        totalCollected={offlineStats.total}
        transactionCount={offlineStats.count}
        isOffline={true}
      />
    </div>
  );
};

export default RevenueSection;