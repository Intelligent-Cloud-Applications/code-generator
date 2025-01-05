import { animated, useSpring } from "@react-spring/web";
import React, { useContext, useEffect, useState } from "react";
import Context from "../../Context/Context";
import InstitutionContext from "../../Context/InstitutionContext";
import copy from "../../utils/Png/copy.png";
import Facebook from "../../utils/Png/Facebook.svg";
import share from "../../utils/Png/share.png";
import Telegram from "../../utils/Png/Telegram.svg";
import Twitter from "../../utils/Png/Twitter.svg";
import Whatsapp from "../../utils/Png/Whatsapp.svg";
// import './Referral.css';
import { API } from "aws-amplify";
import { Badge, Modal } from "flowbite-react";
import { PaginatedTable } from "../DataDisplay";

function HybridReferral() {
  const { userData } = useContext(Context);
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const [shareClicked, setShareClicked] = useState(false);
  const [membersLength, setMembersLength] = useState(0);
  const [members, setMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentDates, setPaymentDates] = useState({});
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    const loadPaymentDates = async () => {
      const dates = {};
      for (const member of members) {
        dates[member.cognitoId] = await getPaymentDate(member);
      }
      setPaymentDates(dates);
      setIsLoadingDates(false);
    };

    if (members.length > 0) {
      loadPaymentDates();
    }
  }, [members]);

  let domain;

  if (process.env.NODE_ENV === "development") {
    domain = "http://localhost:3000";
  } else if (process.env.REACT_APP_STAGE === "DEV") {
    domain = process.env.REACT_APP_DOMAIN_BETA;
  } else if (process.env.REACT_APP_STAGE === "PROD") {
    domain = process.env.REACT_APP_DOMAIN_PROD;
  }

  let referralLink;
  if (userData.userType === "instructor") {
    referralLink = `${domain}/hybrid/?institution=${userData.institution}&referral=${userData.referral_code}`;
  } else if (userData.userType === "admin") {
    referralLink = `${domain}/signup?referral=${userData.institution}`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  const handleShare = () => {
    setShareClicked(!shareClicked);
  };

  const getDate = (epochTime) => {
    const date = new Date(Number(epochTime)); // Creating a Date object
    // To convert the date to local time
    const localDate = date.toLocaleString();
    return localDate.split(",")[0];
  };

  const getPaymentDate = async (user) => {
    try {
      const response = await API.get(
        "awsaiapp",
        `/getReciept/${user.institution}/${user.cognitoId}`,
        {}
      );
      const data = response.payments.map((e) => e.paymentDate);
      const date = data.map((e) => getDate(e));
      return date;
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const shareMessage = `I'm inviting you to join ${InstitutionData.InstitutionId}. Just click the link below.\n${referralLink}`;

  const handleSocialShare = (platform) => {
    let url = "";
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          referralLink
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareMessage
        )}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(
          referralLink
        )}&text=${encodeURIComponent(shareMessage)}`;
        break;
      default:
        break;
    }
    window.open(url, "_blank");
  };
  useEffect(() => {
    async function fetchReferralData() {
      try {
        const response = await API.get(
          "main",
          `/instructor/referred-members/${userData.referral_code}`
        );
        console.log("Response:", response);
        setMembers(response.referredMembers);
        setMembersLength(response.referredMembers.length);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    }
    fetchReferralData();
  }, [userData.referral_code]);

  const { number } = useSpring({
    from: { number: 0 },
    number: membersLength,
    delay: 200,
    config: { duration: 1000 },
  });

  const getInitials = (name) => {
    if (!name) return "";
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  const getColor = (name) => {
    if (!name) return "#888888";
    const colors = [
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF5733",
      "#33FF57",
      "#5733FF",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  useEffect(() => {
    const transformedData = () => {
      const data = members.flatMap((member) => {
        // Map each product for the member to create separate rows
        return (
          member.products?.map((product, productIndex) => [
            // Image column
            member.hasOwnProperty("imgUrl") ? (
              <img
                src={member.imgUrl}
                alt={member.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className={`rounded-full p-2 h-12 w-12 flex items-center justify-center text-[1rem] text-white`}
                style={{ backgroundColor: getColor(member.userName) }}
              >
                {getInitials(member.userName)}
              </div>
            ),
            // Name column
            member.userName,
            // Type column
            member.hasOwnProperty("hybridPageUser") &&
            member.hybridPageUser === true ? (
              <Badge color="info" icon="off" size="xs">
                Hybrid
              </Badge>
            ) : (
              <Badge color="gray" icon="off">
                Referral
              </Badge>
            ),
            // Product column
            product?.S || "---",
            // Payment date column
            isLoadingDates
              ? "Loading..."
              : paymentDates[member.cognitoId]?.[productIndex] || "---",
          ]) || []
        );
      });

      // Filter data based on selected month
      const filteredData = data.filter((row) => {
        if (selectedMonth === "all") return true;
        const month = new Date(row[4]).getMonth();
        return month === Number(selectedMonth);
      });

      setFilteredMembers(filteredData);
    };
    transformedData();
  }, [selectedMonth, members, isLoadingDates, paymentDates]);

  const monthOptions = [
    { value: "all", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  return (
    <div className="Poppins w-full flex flex-col justify-center items-center">
      <div className="flex mt-4 gap-4">
        <div
          className={`w-[85%] max1050:w-[100%] max-w-[40rem] p-7 flex flex-col items-center max536:w-[90%] relative bg-[#ffffffe1]`}
          style={{
            boxShadow: `0 0px 12px ${InstitutionData.LightestPrimaryColor}`,
          }}
        >
          <div className="text-[1.1rem] font-[600] w-[95%]">
            Share your link and earn exciting bonuses for every new member who
            joins!
          </div>
          <div className="flex gap-1 items-center mt-3">
            <div
              className="w-[87%] p-2 bg-[#f1f1f1a1] font-[500] border-[1.4px] border-[#808080]"
              style={{
                color: InstitutionData.PrimaryColor,
              }}
            >
              <div className="text-[0.95rem] font-[500] py-[3px]">
                {referralLink}
              </div>
            </div>
            <div
              className="flex flex-col font-[500] gap-1 -mb-8 cursor-pointer"
              onClick={handleCopy}
            >
              <div className="bg-white shadow-md p-[8px] flex items-center justify-center">
                <img src={copy} alt="Copy" />
              </div>
              <p className="text-[0.7rem] text-center">copy</p>
            </div>
            <div
              className="flex flex-col font-[500] gap-1 -mb-8 cursor-pointer"
              onClick={handleShare}
            >
              <div className="bg-white shadow-md p-[11px] flex items-center justify-center">
                <img src={share} alt="Share" />
              </div>
              <p className="text-[0.7rem] text-center">share</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-[15rem] bg-white shadow-md h-[50%]">
            <div
              className="text-center text-white "
              style={{ backgroundColor: InstitutionData.PrimaryColor }}
            >
              MEMBERS
            </div>
            <animated.div
              className="text-[2rem] p-2 text-center font-bold Inter hover:cursor-pointer"
              style={{ color: InstitutionData.PrimaryColor }}
              onClick={() => setIsOpen(true)}
            >
              {number.to((n) => n.toFixed(0))}
            </animated.div>
          </div>
          <div className="w-[15rem] bg-white shadow-sm h-[50%]">
            <div
              className="text-center text-white "
              style={{ backgroundColor: InstitutionData.PrimaryColor }}
            >
              EARNINGS
            </div>
            <div
              className="text-[1.8rem] p-2 h-full text-center font-bold Inter"
              style={{ color: InstitutionData.PrimaryColor }}
            >
              ₹ {userData.bonus / 100 || 0}
            </div>
          </div>
        </div>
      </div>
      {shareClicked && (
        <div
          className={`bg-[#ffffff] mt-3 mb-4 flex flex-col items-center px-5 p-2 fade-down`}
          style={{ boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="flex justify-center items-center gap-5">
            <div
              className="flex flex-col gap-[2px] items-center cursor-pointer"
              onClick={() => handleSocialShare("whatsapp")}
            >
              <img width={27} src={Whatsapp} alt="WhatsApp" />
              <p className="font-[400] text-gray-500 text-[0.7rem] text-center mb-0">
                whatsapp
              </p>
            </div>
            <div
              className="flex flex-col gap-[2px] items-center cursor-pointer"
              onClick={() => handleSocialShare("facebook")}
            >
              <img width={27} src={Facebook} alt="Facebook" />
              <p className="font-[400] text-gray-500 text-[0.7rem] text-center mb-0">
                facebook
              </p>
            </div>
            <div
              className="flex flex-col gap-[2px] items-center cursor-pointer"
              onClick={() => handleSocialShare("twitter")}
            >
              <img width={27} src={Twitter} alt="Twitter" />
              <p className="font-[400] text-gray-500 text-[0.7rem] text-center mb-0">
                twitter
              </p>
            </div>
            <div
              className="flex flex-col gap-[2px] items-center cursor-pointer"
              onClick={() => handleSocialShare("telegram")}
            >
              <img width={27} src={Telegram} alt="Telegram" />
              <p className="font-[400] text-gray-500 text-[0.7rem] text-center mb-0">
                telegram
              </p>
            </div>
          </div>
        </div>
      )}
      {membersLength > 0 && (
        <Modal show={isOpen} onClose={() => setIsOpen(false)} size="5xl">
          <Modal.Header>
            <div className="w-48">
              <select
                className="bg-lighestPrimaryColor border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="overflow-x-auto">
              <PaginatedTable
                head={[
                  "Profile Picture",
                  "Name",
                  "Type",
                  "Plan",
                  "Payment Date",
                ]}
                data={filteredMembers}
                itemsPerPage={10}
              />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default HybridReferral;
