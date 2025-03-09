import React, { useContext, useEffect, useMemo, useState } from "react";
import { Pagination, Table, Dropdown } from "flowbite-react";
import { API } from "aws-amplify";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Context from "../../../../Context/Context";
import RevenueSection from "./RevenueCard";

function PaymentDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cashoutAmount, setCashoutAmount] = useState(null);
  const { userData, revenue } = useContext(Context);
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });

  const months = useMemo(
    () => [
      "All time",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2];
  }, []);

  const SortIcon = React.memo(({ isActive, direction }) => (
    <span className="inline-flex flex-col ml-1 relative h-4 w-3">
      <IoMdArrowDropup
        className={`absolute top-0 ${
          isActive && direction === 'ascending' ? 'text-blue-600' : 'text-gray-400'
        }`}
        size={12}
      />
      <IoMdArrowDropdown
        className={`absolute bottom-0 ${
          isActive && direction === 'descending' ? 'text-blue-600' : 'text-gray-400'
        }`}
        size={12}
      />
    </span>
  ));

  useEffect(() => {
    const fetchCashoutAmount = async () => {
      if (!userData?.institution) return;

      try {
        const response = await API.get(
          "main",
          `/cashCollected/${userData.institution}`
        );
        if (response?.client?.length > 0) {
          setCashoutAmount({
            client: response.client,
            paymentDate: response.client[0]?.lastUpdated || null,
          });
        }
      } catch (error) {
        console.error("Error fetching cashout amount:", error);
        setCashoutAmount(null);
      }
    };

    fetchCashoutAmount();
  }, [userData?.institution]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      key = null;
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction || !revenue) return revenue;

    return [...revenue].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'userName':
          aValue = a.userDetails?.userName?.toLowerCase() || '';
          bValue = b.userDetails?.userName?.toLowerCase() || '';
          break;
        case 'phoneNumber':
          aValue = a.userDetails?.phoneNumber || '';
          bValue = b.userDetails?.phoneNumber || '';
          break;
        case 'products':
          aValue = a.userDetails?.products?.length || 0;
          bValue = b.userDetails?.products?.length || 0;
          break;
        case 'amount':
          aValue = Number(a.amount) || 0;
          bValue = Number(b.amount) || 0;
          break;
        case 'paymentDate':
          aValue = new Date(a.paymentDate || 0).getTime();
          bValue = new Date(b.paymentDate || 0).getTime();
          break;
        default:
          aValue = (a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key] || '').toString();
          bValue = (b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key] || '').toString();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'ascending'
        ? aValue - bValue
        : bValue - aValue;
    });
  }, [revenue, sortConfig]);

  const filteredPayments = useMemo(() => {
    if (!revenue) return [];

    let filtered = sortData;
    if (selectedYear !== "All time") {
      filtered = sortData?.filter((payment) => {
        const date = new Date(payment.paymentDate);
        const paymentYear = date.getFullYear();
        const paymentMonth = date.getMonth() + 1;

        const isYearMatch = paymentYear === parseInt(selectedYear);
        const isMonthMatch =
          selectedMonth === "All time" ||
          paymentMonth === months.indexOf(selectedMonth);

        return isYearMatch && isMonthMatch;
      });
    }
    return filtered;
  }, [sortData, selectedYear, selectedMonth, months]);

  const { totalOnlineAmount, totalOfflineAmount } = useMemo(() => {
    return {
      totalOnlineAmount: filteredPayments
        ?.filter(payment => payment.paymentMode === 'online')
        .reduce((total, payment) => total + (Number(payment.amount) || 0), 0) || 0,
      totalOfflineAmount: filteredPayments
        ?.filter(payment => payment.paymentMode === 'offline')
        .reduce((total, payment) => total + (Number(payment.amount) || 0), 0) || 0
    };
  }, [filteredPayments]);

  const selectedPayments = useMemo(() => {
    return filteredPayments?.slice((currentPage - 1) * 7, currentPage * 7) || [];
  }, [filteredPayments, currentPage]);

  const handleRowClick = (payment) => {
    console.log('Payment details:', payment);
  };

  const formatEpochToReadableDate = (epoch) => {
    if (!epoch) return "N/A";
    return new Date(epoch).toLocaleDateString();
  };

  const formatAmountWithCurrency = (amount, currency = "INR") => {
    const symbol = currency === "INR" ? "₹" : "$";
    return `${symbol} ${(amount / 100).toFixed(2)}`;
  };

  const availableMonths = useMemo(() => {
    if (selectedYear === currentYear) {
      return months.slice(0, currentMonth + 1);
    }
    return months;
  }, [selectedYear, currentYear, currentMonth, months]);

  const tableHeaders = [
    { key: 'userName', label: 'Name', className: 'w-32' },
    { key: 'phoneNumber', label: 'Phone Number', className: 'w-32' },
    { key: 'paymentDate', label: 'Payment Date', className: 'w-32' },
    { key: 'paymentMode', label: 'Payment Mode', className: 'w-32' },
    { key: 'renew date', label: 'renew date', className: 'w-32' },
    { key: 'amount', label: 'Amount', className: 'w-32' }
  ];

  const CustomTableHeadCell = React.memo(({ onClick, children, sortKey, className }) => (
    <Table.HeadCell
      className={`h-14 px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-1 h-full">
        <span className="truncate">{children}</span>
        <SortIcon
          isActive={sortConfig.key === sortKey}
          direction={sortConfig.direction}
        />
      </div>
    </Table.HeadCell>
  ));

  return (
    <div className="p-4 Inter max850:p-1">
      <div className="w-full">
        <div className="w-full flex justify-center gap-2 flex-wrap mb-4">
          <div className="border flex items-center justify-center w-32 py-1 rounded-md">
            <Dropdown label={selectedYear.toString()} inline>
              <div className="flex flex-col items-left">
                <Dropdown.Item onClick={() => setSelectedYear("All time")}>
                  All time
                </Dropdown.Item>
                {years?.map((year) => (
                  <Dropdown.Item key={year} onClick={() => setSelectedYear(year)}>
                    {year}
                  </Dropdown.Item>
                ))}
              </div>
            </Dropdown>
          </div>

          {selectedYear !== "All time" && (
            <div className="border flex items-center justify-center w-32 rounded-md">
              <Dropdown label={selectedMonth} inline>
                {availableMonths?.map((month) => (
                  <Dropdown.Item
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                  >
                    {month}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          )}
        </div>

        <RevenueSection
          revenue={filteredPayments}
          cashoutAmount={cashoutAmount}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          totalOnlineAmount={totalOnlineAmount}
          totalOfflineAmount={totalOfflineAmount}
        />

        <div className="mt-6 bg-white max-w-full mx-auto rounded-lg shadow">
          <div className="overflow-x-auto">
            <Table hoverable className="min-w-full table-fixed">
              <Table.Head className="bg-white">
                {tableHeaders.map((column) => (
                  <CustomTableHeadCell
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    sortKey={column.key}
                    className={column.className}
                  >
                    {column.label}
                  </CustomTableHeadCell>
                ))}
              </Table.Head>
              <Table.Body className="divide-y">
                {selectedPayments?.map((payment) => (
                  <Table.Row
                    key={payment.paymentId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(payment)}
                  >
                    <Table.Cell className="h-12 text-sm text-gray-500 text-center w-32 overflow-hidden">
                      <div className="truncate px-2">
                        {payment.userDetails?.userName || 'N/A'}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="h-12 text-sm text-gray-500 text-center w-32 overflow-hidden">
                      <div className="truncate px-2">
                        {payment.userDetails?.phoneNumber || 'N/A'}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="h-12 text-sm text-gray-500 text-center w-32 overflow-hidden">
                      <div className="truncate px-2">
                        {formatEpochToReadableDate(payment.paymentDate)}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="h-12 text-sm text-gray-500 text-center w-32">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.paymentMode === "offline"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {payment.paymentMode === "offline" ? "Offline" : "Online"}
                      </span>
                    </Table.Cell>

                    <Table.Cell className="h-12 text-sm text-gray-500 text-center w-32 overflow-hidden">
                      <div className="truncate px-2">
                        {formatEpochToReadableDate(payment.renewDate)}
                      </div>
                    </Table.Cell>

                    <Table.Cell className="h-12 text-sm text-gray-500 text-center w-32 overflow-hidden">
                      <div className="truncate px-2">
                        {formatAmountWithCurrency(payment.amount, payment.currency)}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <div className="py-4 flex justify-between items-center px-6 border-t">
            <div className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * 7 + 1, filteredPayments?.length || 0)}-
              {Math.min(currentPage * 7, filteredPayments?.length || 0)}{" "}
              of {filteredPayments?.length || 0}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((filteredPayments?.length || 0) / 7)}
              onPageChange={setCurrentPage}
              className="flex justify-end"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;