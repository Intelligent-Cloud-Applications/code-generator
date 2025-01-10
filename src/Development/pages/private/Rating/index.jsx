import React, { useContext, useState } from 'react'
import NavBar from '../../../components/Header'
import { useLocation, useNavigate } from 'react-router-dom'
import Context from '../../../Context/Context'
import { API } from 'aws-amplify'
import InstitutionContext from '../../../Context/InstitutionContext'
import { toast } from 'react-toastify'

const Rating = () => {
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const navigate = useNavigate()
  const userCtx = useContext(Context).userData
  const Ctx = useContext(Context)
  const UtilCtx = useContext(Context).util
  const InstitutionData = useContext(InstitutionContext).institutionData

  const location = useLocation()
  const instructorId = location.search.split('?')[1].split('instructorId=')[1]
  const instructor = Ctx.instructorList.find(
    (i) => i.instructorId.toString() === instructorId.toString()
  )

  const getInstructor = (cognitoId) => {
    return Ctx.instructorList.find(
      (i) => i.instructorId.toString() === instructorId
    )
  }

  const handleRatingHover = (value) => {
    setHoveredRating(value)
  }

  const handleRatingClick = (value) => {
    setSelectedRating(value)
  }

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast.info('Please select a rating before submitting.')
      return
    }

    UtilCtx.setLoader(true)

    const body = {
      instructorId: instructorId,
      instructorEmailId: instructor.emailId,
      instructorName: getInstructor(instructorId).name,
      timestamp: Date.now().toString(),
      userEmailId: userCtx.emailId,
      userId: userCtx.cognitoId,
      institution: userCtx.institution,
      userName: userCtx.userName,
      rating: selectedRating,
      review: review.trim() !== '' ? review : ''
    }

    try {
      await API.put(
        'main',
        `/instructor/rating/${InstitutionData.InstitutionId}`,
        {
          body: body
        }
      )

      toast.info('Rating submitted successfully!')
      setReview('')
      setSelectedRating(0)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      UtilCtx.setLoader(false)
    }
  }

  const handleReturn = () => {
    navigate('/dashboard')
  }

  const ratingMessages = {
    1: 'Poor',
    2: 'Bad',
    3: 'Average',
    4: 'Good',
    5: 'Excellant'
  }

  return (
    <>
      <NavBar />
      <div className="bg-gray-800 h-screen flex justify-center items-center">
        {/* Blurred background */}
        <div className="fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>

        {/* Rating popup */}
        <div className="bg-white min-h-[20rem] p-10 rounded-md shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] ">
          {/* Close button */}
          <button
            onClick={handleReturn}
            className="absolute top-2 right-4 font-bold text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            &#10005;
          </button>

          {/* Rating heading */}
          <h2 className="text-2xl font-bold mb-2 text-center">
            Rate the Class
          </h2>

          {/* Rating stars */}
          <div className="flex items-center flex-col mb-6 mt-8">
            {(hoveredRating > 0 || selectedRating > 0) && (
              <div className="mt-[-1rem] absolute text-gray-600">
                {ratingMessages[selectedRating || hoveredRating]}
              </div>
            )}
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <div
                  key={value}
                  className={` text-4xl cursor-pointer ${
                    value <= (selectedRating || hoveredRating)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                  onMouseEnter={() => handleRatingHover(value)}
                  onMouseLeave={() => handleRatingHover(0)}
                  onClick={() => handleRatingClick(value)}
                >
                  &#9733;
                </div>
              ))}
            </div>
          </div>

          {/* Review input */}
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Write your review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}

export default Rating
