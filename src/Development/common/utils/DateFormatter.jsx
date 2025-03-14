import { useEffect, useState } from "react";
import apiPaths from "../../utils/api-paths";

const DateFormatter = ({ epochDate }) => {
  const [location, setLocation] = useState("IN");
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const data = await API.get("main", apiPaths?.getUserLocation);
        setLocation(data?.countryCode);
      } catch (e) {
        console.log(e);
      }
    };
    fetchLocationData();
  }, []);
  let date = new Date(epochDate);
  if (location === "US") {
    date = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  } else if (location === "IN") {
    date = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  } else {
    date = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
  console.log("Date", date);
  return <>{date}</>;
};

export default DateFormatter;
