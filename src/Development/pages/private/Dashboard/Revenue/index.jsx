import React, { useContext, useEffect, useMemo, useState } from "react";
import { Pagination, Table, Dropdown } from "flowbite-react";
import { API } from "aws-amplify";
import Context from "../../../../Context/Context";
import RevenueSection from "./RevenueCard";

function PaymentDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cashoutAmount, setCashoutAmount] = useState(null); // Changed initial state to null
  const { userData, revenue } = useContext(Context);
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);

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
    return [currentYear, currentYear - 1, currentYear - 2];
  }, [currentYear]);

  useEffect(() => {
    const fetchCashoutAmount = async () => {
      try {
        const response = await API.get(
          "main",
          `/cashCollected/${userData.institution}`
        );
        // Store the entire client array from the response
        if (response && response.client && Array.isArray(response.client)) {
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
  }, [userData.institution]);

  // Filter payments based on the selected year and month
  const filteredPayments = useMemo(() => {
    if (selectedYear === "All time") {
      return revenue;
    }

    return revenue?.filter((payment) => {
      const date = new Date(payment.paymentDate);
      const paymentYear = date.getFullYear();
      const paymentMonth = date.getMonth() + 1;

      const isYearMatch = paymentYear === parseInt(selectedYear);
      const isMonthMatch =
        selectedMonth === "All time" ||
        paymentMonth === months.indexOf(selectedMonth);

      return isYearMatch && isMonthMatch;
    });
  }, [revenue, selectedYear, selectedMonth, months]);

  const selectedPayments = filteredPayments?.slice(
    (currentPage - 1) * 7,
    currentPage * 7
  );

  const handleRowClick = (payment) => {
    console.log(payment);
  };

  const formatEpochToReadableDate = (epoch) => {
    if (!epoch) return "N/A";
    const date = new Date(epoch);
    return date.toLocaleDateString();
  };

  const formatAmountWithCurrency = (amount, currency) => {
    const symbol = currency === "INR" ? "₹" : "$";
    return `${symbol} ${amount / 100}`;
  };

  const currency = revenue?.length > 0 ? revenue[0].currency : "USD";

  // Determine the available months based on the selected year
  const availableMonths = useMemo(() => {
    if (selectedYear === currentYear) {
      return months.slice(0, currentMonth + 1);
    }
    return months;
  }, [selectedYear, currentYear, currentMonth, months]);

  return (
    <div className="p-4 Inter max850:p-1">
      <div className="w-full h-screen">
        {/* Year and Month Filter Section */}
        <div className="w-full flex justify-center gap-2 flex-wrap">
          <div className="border flex items-center justify-center w-[8rem] py-1 rounded-md">
            <Dropdown label={selectedYear} inline>
              <div className=" ml-[-1rem] flex flex-col items-left">
                <Dropdown.Item onClick={() => setSelectedYear("All time")}>
                  All time
                </Dropdown.Item>
                {years?.map((year) => (
                  <Dropdown.Item
                    key={year}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </Dropdown.Item>
                ))}
              </div>
            </Dropdown>
          </div>

          {/* Month Dropdown */}
          {selectedYear !== "All time" && (
            <div className="border flex items-center justify-center w-[8rem] rounded-md">
              <Dropdown label={selectedMonth} inline>
                {availableMonths?.map((month, index) => (
                  <Dropdown.Item
                    key={index}
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
        />

        {/* Table Section */}
        <div className="mt-6 bg-white max-w-full mx-auto rounded-b-md">
          <div className="overflow-x-auto border rounded-[1rem]">
            <Table hoverable className="min-w-full">
              <Table.Head>
                <Table.HeadCell className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">
                  Name
                </Table.HeadCell>
                <Table.HeadCell className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Phone Number
                </Table.HeadCell>
                <Table.HeadCell className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Products
                </Table.HeadCell>
                <Table.HeadCell className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Subscription Type
                </Table.HeadCell>
                <Table.HeadCell className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Payment Mode
                </Table.HeadCell>
                <Table.HeadCell className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Payment Date
                </Table.HeadCell>
                <Table.HeadCell className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Amount
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {selectedPayments?.map((payment) => (
                  <Table.Row
                    key={payment.paymentId}
                    className="hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleRowClick(payment)}
                  >
                    <Table.Cell className="whitespace-nowrap text-sm text-gray-500 text-center bg-white">
                      {payment.userDetails?.userName}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-sm text-gray-500 text-center bg-white">
                      {payment.userDetails?.phoneNumber}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-sm text-gray-500 text-center bg-white">
                      {payment.userDetails?.products?.length > 0
                        ? payment.userDetails.products?.map(
                            (product, index) => <p key={index}>{product.S}</p>
                          )
                        : "N/A"}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-sm text-gray-500 text-center bg-white">
                      {payment.subscriptionType}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-sm text-gray-500 text-center bg-white">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.paymentMode === "offline"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {payment.paymentMode === "offline"
                          ? "Offline"
                          : "Online"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-sm text-gray-500 text-center bg-white">
                      {formatEpochToReadableDate(payment.paymentDate)}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-sm text-gray-500 text-center bg-white">
                      {formatAmountWithCurrency(
                        payment.amount,
                        payment.currency
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="py-2 flex justify-between items-center px-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 7 + 1}-
            {Math.min(
              currentPage * (selectedPayments?.length || 0),
              filteredPayments?.length || 0
            )}{" "}
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
  );
}

export default PaymentDetails;
