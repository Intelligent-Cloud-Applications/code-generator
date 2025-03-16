import { useEffect, useState } from "react";
import apiPaths from "../../utils/api-paths";
import { API } from "aws-amplify";

const DateFormatter = ({ epochDate }) => {
  const [location, setLocation] = useState("IN");
  const [formattedDate, setFormattedDate] = useState("");

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

  useEffect(() => {
    if (!epochDate) {
      setFormattedDate("Invalid Date");
      return;
    }

    try {
      const date = new Date(epochDate);
      if (location === "US") {
        setFormattedDate(
          date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })
        );
      } else {
        setFormattedDate(
          date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })
        );
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      setFormattedDate("Invalid Date");
    }
  }, [epochDate, location]);

  return <>{formattedDate}</>;
};

export default DateFormatter;
