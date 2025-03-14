import { API } from "aws-amplify";
import React, { useContext, useState, useEffect } from "react";
import { Pagination, Button } from "flowbite-react";
import { useMediaQuery } from "../../../../utils/helpers";
import DashboardRatingMobile from "./mobile";
import InstitutionContext from "../../../../Context/InstitutionContext";
import Context from "../../../../Context/Context";
import { Table } from "flowbite-react";
import Skeleton from "react-loading-skeleton";

export default function DashboardRating() {
  const [ratings, setRatings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const UserCtx = useContext(Context);
  const itemsPerPage = 7;

  const [ratingTypeFilter, setRatingTypeFilter] = useState("");
  const [instructorTypeFilter, setinstructorTypeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();

    const intervalId = setInterval(fetchRatings, 60000); // Refresh every minute

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

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
      <div className="instructor-dashboard-container w-full">
        <h2 className="pl-5 font-sans text-[1.4rem] max536:mb-3 max536:text-[1.7rem] sans-serif max536:text-[bg-[#1b7571] font-bold text-center mt-4 w-[80%] mx-auto">
          Reviews
        </h2>
        <div className="h-[100vh] ml-[6rem] max1050:ml-0 max1050:mt-0">
          <div
            className={`w-[85%] min-h-[35rem] max536:bg-transparent max536:w-full rounded-3xl p-2 flex flex-col items-center
      max1050:w-[94vw] mx-[2.5%] max1440:w-[95%] mt-10`}
            // style={{ backgroundColor: InstitutionData.LightestPrimaryColor }}
          >
            <div className="overflow-x-auto w-full">
              <Table hoverable>
                <Table.Head
                  style={{ backgroundColor: InstitutionData.PrimaryColor }}
                >
                  <Table.HeadCell className="text-center ">Date</Table.HeadCell>
                  <Table.HeadCell className="text-center ">
                    Average Rating
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <Table.Row
                          key={index}
                          className="animate-pulse bg-gray-200"
                        >
                          <Table.Cell className="h-6 w-full bg-gray-300 rounded">
                            <Skeleton height={20} />
                          </Table.Cell>
                          <Table.Cell className="h-6 w-full bg-gray-300 rounded">
                            <Skeleton height={20} />
                          </Table.Cell>
                        </Table.Row>
                      ))
                    : Object.keys(instructorAverageRatings).map(
                        (date) =>
                          instructorAverageRatings[date] && (
                            <Table.Row
                              key={date}
                              className="text-center bg-white hover:bg-gray-100"
                            >
                              <Table.Cell className="text-black">
                                {date}
                              </Table.Cell>
                              <Table.Cell>
                                {renderStarRating(
                                  instructorAverageRatings[date]
                                )}
                              </Table.Cell>
                            </Table.Row>
                          )
                      )}
                </Table.Body>
              </Table>

              <div className="absolute bottom-0 w-full flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, allRatings.length)}
                  </span>{" "}
                  of <span className="font-medium">{allRatings.length}</span>{" "}
                  results
                </div>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(value) => setCurrentPage(value)}
                  style={{ margin: "0" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (UserCtx.userData.userType === "member") {
    return (
      <div className="w-full member-dashboard-container">
        <h2 className="pl-5 font-sans text-[1.4rem] max536:mb-3 max536:text-[1.7rem] sans-serif max536:text-[bg-[#1b7571] font-bold text-center mt-4 w-[80%] mx-auto">
          Reviews
        </h2>
        <div className="min-h-screen ml-[6rem] max1050:ml-[0] max1050:mt-0">
          <div className="w-[85%] min-h-[35rem] max536:bg-transparent max536:w-[100%] rounded-3xl p-2 flex flex-col items-center max1050:w-[94vw] mx-[2.5%] max1440:w-[95%] mt-4">
            <div className="w-full h-full relative">
              <div className="w-full pb-16">
                <Table striped>
                  <Table.Head
                    className="rounded-3xl"
                    style={{ backgroundColor: InstitutionData.PrimaryColor }}
                  >
                    <Table.HeadCell className="text-center w-[30%]">
                      Instructor
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center">
                      Date
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center">
                      Time
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center">
                      Rating
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {isLoading
                      ? Array.from({ length: 6 }).map((_, index) => (
                          <Table.Row
                            key={index}
                            className="animate-pulse bg-gray-200"
                          >
                            <Table.Cell className="text-center">
                              <Skeleton height={20} width={100} />
                            </Table.Cell>
                            <Table.Cell className="text-center">
                              <Skeleton height={20} width={80} />
                            </Table.Cell>
                            <Table.Cell className="text-center">
                              <Skeleton height={20} width={60} />
                            </Table.Cell>
                            <Table.Cell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Skeleton
                                    key={i}
                                    height={20}
                                    width={20}
                                    circle
                                  />
                                ))}
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      : ratings
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .slice(startIndex, endIndex)
                          .map((rating) => (
                            <Table.Row key={rating.ratingId}>
                              <Table.Cell className="text-gray-700 font-semibold text-center">
                                {rating.instructorName}
                              </Table.Cell>
                              <Table.Cell className="text-gray-700 font-semibold text-center">
                                {new Date(
                                  parseInt(rating.timestamp)
                                ).toLocaleDateString()}
                              </Table.Cell>
                              <Table.Cell className="text-gray-700 font-semibold text-center">
                                {new Date(
                                  parseInt(rating.timestamp)
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Table.Cell>
                              <Table.Cell className="text-gray-700 font-semibold text-center">
                                <div className="flex items-center justify-center">
                                  {Array.from({ length: 5 }, (_, index) => (
                                    <span
                                      key={index}
                                      className={`text-sm mx-1 ${
                                        index < rating.rating
                                          ? "text-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                  </Table.Body>
                </Table>
              </div>
              <div className="absolute bottom-0 w-full flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, allRatings.length)}
                  </span>{" "}
                  of <span className="font-medium">{allRatings.length}</span>{" "}
                  results
                </div>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(value) => setCurrentPage(value)}
                  style={{ margin: "0" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container w-full">
      <h2 className="pl-5 font-sans text-[1.4rem] max536:mb-3 max536:text-[1.7rem] sans-serif max536:text-[bg-[#1b7571] font-bold text-center mt-4 w-[80%] mx-auto">
        Reviews
      </h2>
      <div className="min-h-screen ml-[6rem] max1050:ml-[0] max1050:mt-0">
        <div className="w-[85%] flex justify-end mt-4">
          <Button
            style={{
              backgroundColor: InstitutionData.LightPrimaryColor,
            }}
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
                className={`rounded-[0.51rem] px-4`}
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
        >
          <div className="w-full h-full relative">
            <div className="w-full pb-16">
              <Table striped>
                <Table.Head
                  className="rounded-3xl"
                  style={{
                    backgroundColor: InstitutionData.PrimaryColor,
                  }}
                >
                  <Table.HeadCell className="text-center">
                    User Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-center">
                    Instructor
                  </Table.HeadCell>
                  <Table.HeadCell className="text-center">Date</Table.HeadCell>
                  <Table.HeadCell className="text-center">Time</Table.HeadCell>
                  <Table.HeadCell className="text-center">
                    Rating
                  </Table.HeadCell>
                  <Table.HeadCell className="text-center">
                    Review
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {isLoading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <Table.Row
                          key={index}
                          className="animate-pulse bg-gray-200"
                        >
                          <Table.Cell className="text-center">
                            <Skeleton height={20} width={80} />
                          </Table.Cell>
                          <Table.Cell className="text-center">
                            <Skeleton height={20} width={100} />
                          </Table.Cell>
                          <Table.Cell className="text-center">
                            <Skeleton height={20} width={80} />
                          </Table.Cell>
                          <Table.Cell className="text-center">
                            <Skeleton height={20} width={60} />
                          </Table.Cell>
                          <Table.Cell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton
                                  key={i}
                                  height={20}
                                  width={20}
                                  circle
                                />
                              ))}
                            </div>
                          </Table.Cell>
                          <Table.Cell className="text-center">
                            <Skeleton height={20} width={150} />
                          </Table.Cell>
                        </Table.Row>
                      ))
                    : allRatings
                        .sort((a, b) => (a.timestamp - b.timestamp ? -1 : 1))
                        .slice(startIndex, endIndex)
                        .map((rating) => (
                          <Table.Row key={rating.ratingId}>
                            <Table.Cell className="text-gray-700 font-semibold text-center">
                              {rating.userName.split(" ")[0]}
                            </Table.Cell>
                            <Table.Cell className="text-gray-700 font-semibold text-center">
                              {rating.instructorName}
                            </Table.Cell>
                            <Table.Cell className="text-gray-700 font-semibold text-center">
                              {new Date(
                                parseInt(rating.timestamp)
                              ).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell className="text-gray-700 font-semibold text-center">
                              {new Date(
                                parseInt(rating.timestamp)
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Table.Cell>
                            <Table.Cell className="text-gray-700 font-semibold text-center">
                              <div className="flex items-center justify-center">
                                {Array.from({ length: 5 }, (_, index) => (
                                  <span
                                    key={index}
                                    className={`text-sm mx-1 ${
                                      index < rating.rating
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </Table.Cell>
                            <Table.Cell className="text-gray-700 font-semibold text-center">
                              {rating.review}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                </Table.Body>
              </Table>
            </div>
            <div className="absolute bottom-0 w-full flex items-center justify-between ">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, allRatings.length)}
                  </span>{" "}
                  of <span className="font-medium">{allRatings.length}</span>{" "}
                  results
                </div>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(value) => setCurrentPage(value)}
                  style={{ margin: "0" }}
                />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
