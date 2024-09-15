import { API } from "aws-amplify";
import React, { useContext, useState, useEffect } from "react";
import { Pagination, Button } from "flowbite-react";
import { useMediaQuery } from "../../../../utils/helpers";
import DashboardRatingMobile from "./mobile";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Context from "../../../../Context/Context";

export default function DashboardRating() {
  const [ratings, setRatings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const UserCtx = useContext(Context);
  const itemsPerPage = 7;

  const [ratingTypeFilter, setRatingTypeFilter] = useState("");
  const [instructorTypeFilter, setinstructorTypeFilter] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Fetch ratings for the logged-in user
        const response = await API.put(
          "main",
          "/admin/rating-fetch/happyprancer"
        );
        if (UserCtx.userData.userType === "admin") {
          setRatings(response);
        } else if (UserCtx.userData.userType === "instructor") {
          setRatings(
            response.filter(
              (ratings) => UserCtx.userData.cognitoId === ratings.instructorId
            )
          );
        } else if (UserCtx.userData.userType === "member") {
          setRatings(
            response.filter(
              (rating) =>
                rating.userEmailId.trim() === UserCtx.userData.emailId.trim()
            )
          );
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();

    const intervalId = setInterval(fetchRatings, 60000); // Refresh every minute

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  });

  //sort ratings by timestamp in descending order
  ratings.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  let allRatings = ratings
    .filter((rating) => {
      if (instructorTypeFilter === "") {
        return true;
      } else {
        return rating.instructorName === instructorTypeFilter;
      }
    })
    .filter((rate) => {
      if (ratingTypeFilter === "") {
        return true;
      } else {
        return rate.rating === Number(ratingTypeFilter);
      }
    });

    console.log(allRatings);
    
  // Calculate average ratings by date
  const calculateAverageRatings = () => {
    // Group ratings by date
    const ratingsByDate = {};
    allRatings.forEach((rating) => {
      const date = new Date(parseInt(rating.timestamp)).toLocaleDateString();
      if (!ratingsByDate[date]) {
        ratingsByDate[date] = [];
      }
      ratingsByDate[date].push(rating.rating);
    });

    // Calculate average rating for each date
    const averageRatings = {};
    for (const date in ratingsByDate) {
      const totalRatings = ratingsByDate[date].length;
      const sumRatings = ratingsByDate[date].reduce(
        (acc, rating) => acc + rating,
        0
      );
      const averageRating = sumRatings / totalRatings;
      averageRatings[date] = averageRating;
    }

    return averageRatings;
  };

  const isMobileScreen = useMediaQuery("(max-width: 600px)");

  const totalPages = Math.ceil(allRatings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  function renderStarRating(averageRating) {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-500 text-l mx-1">
          <i className="fas fa-star"></i>
        </span>
      );
    }

    if (halfStar) {
      stars.push(
        <span key="half" className="text-yellow-500 text-l mx-1">
          <i className="fas fa-star-half-alt"></i>
        </span>
      );
    }

    const remainingStars = Math.max(5 - fullStars - (halfStar ? 1 : 0), 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 text-l mx-1">
          <i className="fas fa-star"></i>
        </span>
      );
    }

    return stars;
  }

  if (isMobileScreen) {
    return <DashboardRatingMobile />;
  }

  if (UserCtx.userData.userType === "instructor") {
    const instructorAverageRatings = calculateAverageRatings();
    return (
      <div className="instructor-dashboard-container">
        <div className="h-[100vh] ml-[6rem] max1050:ml-[0] max1050:mt-0">
          <div
            className={`w-[85%] min-h-[35rem] max536:bg-transparent max536:w-[100%] rounded-3xl p-2 flex flex-col items-center max1050:w-[94vw] mx-[2.5%] max1440:w-[95%] mt-10`}
            style={{
              backgroundColor: InstitutionData.LightestPrimaryColor,
            }}
          >
            <h2 className="pl-5 font-sans text-[1.4rem] max536:mb-3 max536:text-[1.7rem] sans-serif max536:text-[bg-[#1b7571] font-bold]">
              Reviews
            </h2>
            <div className="overflow-x-auto w-full">
              <ul
                className="relative px-0 pb-[3rem] w-[95%] max-w-[1700px] mx-auto flex flex-col rounded-3xl items-center justify-start pt-6 max536:gap-3 max536:h-[calc(100vh-16rem)] max536:bg-gradient-to-b max536:from-[#dad7c6] max536:to-[#fdd00891]"
                style={{
                  backgroundColor: InstitutionData.PrimaryColor,
                }}
              >
                <li className="w-full flex flex-col items-center justify-center p-2 max536:pt-5 max536:rounded-2xl">
                  <div className="grid grid-cols-12 justify-content-between w-[98%] max1050:w-[100%] mb-5 font-bold">
                    <div className="col-span-6 text-center text-white">
                      Date
                    </div>
                    <div className="col-span-6 text-center text-white">
                      Average Rating
                    </div>
                  </div>
                  {Object.keys(instructorAverageRatings).map((date) => (
                    <div
                      key={date}
                      className="grid grid-cols-12 justify-content-between w-[98%] max1050:w-[100%] mb-4"
                    >
                      <div className="col-span-6 text-center text-white">
                        {date}
                      </div>
                      <div className="col-span-6 text-center">
                        {renderStarRating(instructorAverageRatings[date])}
                      </div>
                    </div>
                  ))}
                </li>
                <div className="absolute bottom-3 flex justify-center items-center w-full">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(value) => setCurrentPage(value)}
                    style={{ margin: "0 auto" }}
                  />
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (UserCtx.userData.userType === "member") {
    return (
      <div className="instructor-dashboard-container">
        <div className="h-[100vh] ml-[6rem] max1050:ml-[0] max1050:mt-0">
          <div
            className={`w-[85%] min-h-[35rem] max536:bg-transparent max536:w-[100%] rounded-3xl p-2 flex flex-col items-center max1050:w-[94vw] mx-[2.5%] max1440:w-[95%] mt-10`}
            style={{
              backgroundColor: InstitutionData.LightestPrimaryColor,
            }}
          >
            <h2 className="pl-5 font-sans text-[1.4rem] max536:mb-3 max536:text-[1.7rem] sans-serif max536:text-[bg-[#1b7571] font-bold]">
              Reviews
            </h2>
            <div className="overflow-x-auto w-full">
              <ul
                className="relative px-0 pb-[3rem] w-[95%] max-w-[1700px] mx-auto flex flex-col rounded-3xl items-center justify-start pt-6 max536:gap-3 max536:h-[calc(100vh-16rem)] max536:bg-gradient-to-b max536:from-[#dad7c6] max536:to-[#fdd00891]"
                style={{
                  backgroundColor: InstitutionData.PrimaryColor,
                }}
              >
                <li className="w-full flex flex-col items-center justify-center p-2 max536:pt-5 max536:rounded-2xl">
                  <div className="grid grid-cols-12 justify-content-between w-[98%] max1050:w-[100%] mb-5 font-bold">
                    <div className="col-span-3 text-center text-white">
                      Instructor
                    </div>
                    <div className="col-span-3 text-center text-white">
                      Date
                    </div>
                    <div className="col-span-3 text-center text-white">
                      Time
                    </div>
                    <div className="col-span-3 text-center text-white">
                      Rating
                    </div>
                  </div>
                  {ratings
                    .sort((a, b) => {
                      a.timestamp - b.timestamp ? -1 : 1;
                    })
                    .slice(startIndex, endIndex)
                    .map((rating) => (
                      <div
                        key={rating.ratingId}
                        className="grid grid-cols-12 justify-content-between w-[98%] max1050:w-[100%] mb-4 "
                      >
                        <div className="col-span-3 text-center text-white">
                          {rating.instructorName}
                        </div>
                        <div className="col-span-3 text-center text-white">
                          {new Date(
                            parseInt(rating.timestamp)
                          ).toLocaleDateString()}
                        </div>
                        <div className="col-span-3 text-center text-white">
                          {new Date(
                            parseInt(rating.timestamp)
                          ).toLocaleTimeString()}
                        </div>
                        <div className="col-span-3 text-center">
                          {/* Integrate the StarRating component here with Tailwind classes */}
                          <div className="flex items-center justify-center">
                            {Array.from({ length: 5 }, (_, index) => (
                              <span
                                key={index}
                                className={`text-2xl mx-1 ${
                                  index < rating.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </li>
                <div className="absolute bottom-3 flex justify-center items-center w-full">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(value) => setCurrentPage(value)}
                    style={{ margin: "0 auto" }}
                  />
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="h-[100vh] ml-[6rem] max1050:ml-[0] max1050:mt-0">
        <div className="w-[85%] flex justify-end mt-4">
          <Button
            color={"primary"}
            onClick={() => {
              setShowFilters(!showFilters);
            }}
          >
            Filters
          </Button>
        </div>
        <div className={`flex flex-col-reverse w-[85%]`}>
          <div className={`filters ${showFilters ? "show" : ""}`}>
            <div className={`w-[95%] flex justify-end m-[0.8rem] gap-3`}>
              <label className={`font-bold`} htmlFor="instructorTypeFilter">
                Instructor:{" "}
              </label>
              <select
                className={`rounded-[0.51rem] px-4`}
                style={{
                  backgroundColor: InstitutionData.LightestPrimaryColor,
                }}
                id="instructorTypeFilter"
                value={instructorTypeFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setinstructorTypeFilter(e.target.value);
                }}
              >
                <option value="">All</option>
                {Array.from(
                  new Set(ratings.map((rating) => rating.instructorName))
                ).map((instructorName) => (
                  <option key={instructorName} value={instructorName}>
                    {instructorName}
                  </option>
                ))}
              </select>
            </div>
            <div className={`w-[95%] flex justify-end m-[0.8rem] gap-3`}>
              <label className={`font-bold`} htmlFor="ratingTypeFilter">
                Rating:{" "}
              </label>
              <select
                className={`rounded-[0.51rem] px-4 `}
                style={{
                  backgroundColor: InstitutionData.LightestPrimaryColor,
                }}
                id="ratingTypeFilter"
                value={ratingTypeFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setRatingTypeFilter(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className={`w-[85%] min-h-[35rem] max536:bg-transparent max536:w-[100%] rounded-3xl p-2 flex flex-col items-center max1050:w-[94vw] mx-[2.5%] max1440:w-[95%] mt-4`}
          style={{
            backgroundColor: InstitutionData.LightestPrimaryColor,
          }}
        >
          <h2 className="pl-5 font-sans text-[1.4rem] max536:mb-3 max536:text-[1.7rem] sans-serif max536:text-[bg-[#1b7571] font-bold">
            Reviews
          </h2>
          <div className="overflow-x-auto w-full">
            <ul className="relative px-0 pb-[3rem] w-[95%] max-w-[1700px] mx-auto flex flex-col rounded-3xl items-center justify-start pt-6 max536:gap-3 max536:h-[calc(100vh-16rem)] max536:bg-gradient-to-b max536:from-[#dad7c6] max536:to-[#fdd00891]">
              <li className="w-full flex flex-col items-center justify-center p-2 max536:pt-5 max536:rounded-2xl">
                <div className="grid grid-cols-12 justify-content-between w-[98%] max1050:w-[100%] mb-5 font-bold">
                  <div className="col-span-2 text-center text-black">
                    User Name
                  </div>
                  <div className="col-span-2 text-center text-black">
                    Instructor
                  </div>
                  <div className="col-span-2 text-center text-black">Date</div>
                  <div className="col-span-2 text-center text-black">Time</div>
                  <div className="col-span-2 text-center text-black">
                    Rating
                  </div>
                  <div className="col-span-2 text-center text-black">
                    Review
                  </div>
                </div>
                {allRatings
                  .sort((a, b) => {
                    a.timestamp - b.timestamp ? -1 : 1;
                  })
                  .slice(startIndex, endIndex)
                  .map((rating) => (
                    <div
                      key={rating.ratingId}
                      className="grid grid-cols-12 justify-content-between w-[98%] max1050:w-[100%] mb-4"
                    >
                      <div className="col-span-2 text-center text-black">
                        {rating.userName.split(" ")[0]}
                      </div>
                      <div className="col-span-2 text-center text-black">
                        {rating.instructorName}
                      </div>
                      <div className="col-span-2 text-center text-black">
                        {new Date(
                          parseInt(rating.timestamp)
                        ).toLocaleDateString()}
                      </div>
                      <div className="col-span-2 text-center text-black">
                        {new Date(
                          parseInt(rating.timestamp)
                        ).toLocaleTimeString()}
                      </div>
                      <div className="col-span-2 text-center">
                        {/* Integrate the StarRating component here with Tailwind classes */}
                        <div className="flex items-center justify-center">
                          {Array.from({ length: 5 }, (_, index) => (
                            <span
                              key={index}
                              className={`text-2xl mx-1 ${
                                index < rating.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2 text-center text-black">
                        {rating.review}
                      </div>
                    </div>
                  ))}
              </li>
              <div className="absolute bottom-3 flex justify-center items-center w-full">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(value) => setCurrentPage(value)}
                  style={{ margin: "0 auto" }}
                />
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
