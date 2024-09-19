import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {API, Auth} from "aws-amplify";
import InstitutionContext from "../../../Context/InstitutionContext";
import Context from "../../../Context/Context";
import {toast} from "react-toastify";
import SubmitRating from "./SubmitRating";

const PutAttendance = () => {
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const { isAuth, userData, util } = useContext(Context);
  const { emailId } = userData;
  const navigate = useNavigate();
  // const { classId } = useParams();

  const [instructorData, setInstructorData ] = useState({});

  useEffect(() => {
    const putAttendance = async () => {
      console.log('USERDATA', userData);
      if (!isAuth) return;
      util.setLoader(true);
      let response;
      try {
        await Auth.currentAuthenticatedUser();
        try {
          const { classId } = await API.get('main', `/any/get-current-class/${InstitutionId}`, {});
          response = await API.post('main', `/user/put-attendance/${InstitutionId}`, { body: { classId, emailId } });
          setInstructorData(response);
          toast.success("Attendance marked successfully");
          if (response.message) toast.info(response.message);
        } catch (error) {
          toast.error(error.response.data.message || "An unknown error occurred");
          util.setLoader(false);
          navigate('/dashboard');
        } finally {
          util.setLoader(false);
        }
      }
      catch {
        util.setLoader(false);
        navigate(`/auth/put-attendance`);
      }
    }

    putAttendance();
  }, [isAuth]);

  return <SubmitRating instructorData={instructorData} />
}

export default PutAttendance;
