// RatingPage.tsx
import React, {useContext, useState} from 'react';
import { Button, Card, Label, Textarea } from 'flowbite-react';
import { FaStar } from 'react-icons/fa6';
import Context from "../../../Context/Context";
import {API} from "aws-amplify";
import InstitutionContext from "../../../Context/InstitutionContext";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const RatingPage = ({ instructorData }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const { userData, util } = useContext(Context);
  const navigate = useNavigate();

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    console.log('Rating submitted:', rating);
    console.log('Feedback submitted:', feedback);

    // Handle the submission logic (e.g., send to an API)
    try {
      util.setLoader(true);
      const response = await API.put(
        'main',
        `/instructor/rating/${InstitutionId}`,
        {
          body: {
            instructorId: instructorData.iId,
            instructorEmailId: instructorData.iEmail,
            instructorName: instructorData.iName,
            userEmailId: userData.emailId,
            userName: userData.userName,
            rating: rating,
            review: feedback,
          }
        }
      );
      toast.success('Rating submitted.');
    } catch (e) {
      toast.error('An unknown error has occurred');
    } finally {
      util.setLoader(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Rate Us</h2>
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`w-8 h-8 cursor-pointer ${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>
        <Label htmlFor="feedback" className="mb-2">
          Feedback
        </Label>
        <Textarea
          id="feedback"
          placeholder="Write your feedback here..."
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button className="mt-4 bg-primaryColor hover:bg-lightPrimaryColor" onClick={handleSubmit}>
          Submit
        </Button>
      </Card>
    </div>
  );
};

export default RatingPage;
