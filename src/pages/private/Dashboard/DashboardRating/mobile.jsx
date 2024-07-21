import { API } from 'aws-amplify'
import React, { useContext, useState, useEffect } from 'react'
import {Pagination} from 'flowbite-react'
// import "./DashboardRating.css";
import Context from '../../../../Context/Context'
import InstitutionContext from '../../../../Context/InstitutionContext'

export default function DashboardRatingMobile() {
  const InstitutionData = useContext(InstitutionContext).institutionData
  const [ratings, setRatings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7
  const UserCtx = useContext(Context)

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Fetch ratings for the logged-in user
        const response = await API.put(
          'main',
          '/admin/rating-fetch/happyprancer',
          {
            body: {}
          }
        )
        if (UserCtx.userData.userType === 'admin') {
          setRatings(response)
        } else if (UserCtx.userData.userType === 'instructor') {
          setRatings(
            response.filter(
              (ratings) =>
                UserCtx.userData.cognitoId === ratings.instructorId
            )
          )
        } else if (UserCtx.userData.userType === 'member') {
          setRatings(
            response.filter(
              (rating) =>
                rating.userEmailId.trim() === UserCtx.userData.emailId.trim()
            )
          )
        }
      } catch (error) {
        console.error('Error fetching ratings:', error)
      }
    }

    fetchRatings()

    const intervalId = setInterval(fetchRatings, 60000) // Refresh every minute

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId)
  })

  const totalPages = Math.ceil(ratings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const calculateAverageRatings = () => {
    // Group ratings by date
    const ratingsByDate = {}
    ratings.forEach((rating) => {
      const date = new Date(parseInt(rating.timestamp)).toLocaleDateString()
      if (!ratingsByDate[date]) {
        ratingsByDate[date] = []
      }
      ratingsByDate[date].push(rating.rating)
    })

    // Calculate average rating for each date
    const averageRatings = {}
    for (const date in ratingsByDate) {
      const totalRatings = ratingsByDate[date].length
      const sumRatings = ratingsByDate[date].reduce(
        (acc, rating) => acc + rating,
        0
      )
      const averageRating = sumRatings / totalRatings
      averageRatings[date] = averageRating
    }

    return averageRatings
  }

  function renderStarRating(averageRating) {
    const stars = []
    const fullStars = Math.floor(averageRating)
    const halfStar = averageRating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-500 text-l mx-1">
          <i className="fas fa-star"></i>
        </span>
      )
    }

    if (halfStar) {
      stars.push(
        <span key="half" className="text-yellow-500 text-l mx-1">
          <i className="fas fa-star-half-alt"></i>
        </span>
      )
    }

    const remainingStars = Math.max(5 - fullStars - (halfStar ? 1 : 0), 0)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 text-l mx-1">
          <i className="fas fa-star"></i>
        </span>
      )
    }

    return stars
  }
  if (UserCtx.userData.userType === 'instructor') {
    const instructorAverageRatings = calculateAverageRatings()
    return (
      <div className="instructor-dashboard-container">
        <h2 className="text-[1.4rem] mb-5 font-bold text-black-700 mt-3 text-center">
          Reviews
        </h2>
        <div className="grid">
          {Object.keys(instructorAverageRatings).map((date) => (
            <div key={date} className="class-container">
              <div
                className="bg-gradient-to-r from-[#1b7571]  to-[#1b7571] rounded-lg p-3 md:p-4 mx-2 shadow-md my-2"
                style={{
                  background: InstitutionData.SecondaryColor,
                  boxShadow: '0 0px 15px rgba(0, 0, 0, 0.4)',
                  borderRadius: '1.8rem'
                }}
              >
                <div
                  className="flex flex-row mx-4"
                  style={{
                    justifyContent: 'space-between'
                  }}
                >
                  <div className="w-[7rem] grid">
                    <div className="rounded-[0.51rem] px-2 py-1 font-bold">
                      Date{' '}
                    </div>
                    <div className="rounded-[0.51rem] px-2 py-1"> {date} </div>
                  </div>
                  <div className=" flex flex-col">
                    <div className="rounded-[0.51rem] px-2 text-center py-1 font-bold">
                      {' '}
                      Averge rating
                    </div>
                    <div className="rounded-[0.51rem] px-2 text-center py-1">
                      {renderStarRating(instructorAverageRatings[date])}{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex mb-[6rem] justify-center items-center mt-4 md:mt-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(value) => setCurrentPage(value)}
            style={{ margin: '0 auto' }}
          />
        </div>
      </div>
    )
  }
  if (UserCtx.userData.userType === 'member') {
    return (
      <div>
        <h2 className="text-[1.4rem] mb-5 font-bold text-black-700 mt-3 text-center">
          Reviews
        </h2>
        <div className="grid ">
          {ratings.slice(startIndex, endIndex).map((rating) => (
            <div key={rating.ratingId} className="class-container">
              <div
                className="bg-gradient-to-r from-#1b7571  to-#1b7571 rounded-lg p-3 md:p-4 mx-2 shadow-md my-2"
                style={{
                  background: InstitutionData.SecondaryColor,
                  boxShadow: '0 0px 15px rgba(0, 0, 0, 0.4)',
                  borderRadius: '1.8rem'
                }}
              >
                <div
                  className="flex flex-row mx-4"
                  style={{
                    justifyContent: 'space-between'
                  }}
                >
                  <div className="w-[7rem] grid">
                    <div className="rounded-[0.51rem] px-2 py-1">
                      {' '}
                      {new Date(
                        parseInt(rating.timestamp)
                      ).toLocaleDateString()}
                    </div>
                    <div className="rounded-[0.51rem] px-2 py-1">
                      {' '}
                      {new Date(
                        parseInt(rating.timestamp)
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className=" flex flex-col">
                    <div className="rounded-[0.51rem] px-2 text-center py-1 font-bold">
                      {' '}
                      {rating.instructorName}
                    </div>
                    <div className="rounded-[0.51rem] px-2 py-1">
                      {' '}
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={index}
                          className={`text-2xl mx-1 ${
                            index < rating.rating
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex mb-[6rem] justify-center items-center mt-4 md:mt-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(value) => setCurrentPage(value)}
            style={{ margin: '0 auto' }}
          />
        </div>
      </div>
    )
  }
  return (
    <div>
      <h2 className="text-[1.4rem] mb-5 font-bold text-black-700 mt-3 text-center">
        Reviews
      </h2>
      <div className="grid ">
        {ratings.slice(startIndex, endIndex).map((rating) => (
          <div key={rating.ratingId} className="class-container">
            <div
              className="bg-gradient-to-r from-#1b7571  to-#1b7571 rounded-lg p-3 md:p-4 mx-2 shadow-md my-2"
              style={{
                background: InstitutionData.SecondaryColor,
                boxShadow: '0 0px 15px rgba(0, 0, 0, 0.4)',
                borderRadius: '1.8rem'
              }}
            >
              <div
                className="flex flex-row mx-4"
                style={{
                  justifyContent: 'space-between'
                }}
              >
                <div className="w-[7rem] grid">
                  <div className="rounded-[0.51rem] px-2 py-1 font-bold">
                    {rating.userName.split(' ')[0]}
                  </div>
                  <div className="rounded-[0.51rem] px-2 py-1">
                    {' '}
                    {new Date(parseInt(rating.timestamp)).toLocaleDateString()}
                  </div>
                  <div className="rounded-[0.51rem] px-2 py-1">
                    {' '}
                    {new Date(parseInt(rating.timestamp)).toLocaleTimeString()}
                  </div>
                </div>
                <div className=" flex flex-col">
                  <div className="rounded-[0.51rem] px-2 text-center py-1 font-bold">
                    {' '}
                    {rating.instructorName}
                  </div>
                  <div className="rounded-[0.51rem] px-2 py-1">
                    {' '}
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={`text-2xl mx-1 ${
                          index < rating.rating
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="rounded-[0.51rem] px-2 text-center py-1">
                    {' '}
                    {rating.review}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex mb-[6rem] justify-center items-center mt-4 md:mt-6">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(value) => setCurrentPage(value)}
          style={{ margin: '0 auto' }}
        />
      </div>
    </div>
  )
}
