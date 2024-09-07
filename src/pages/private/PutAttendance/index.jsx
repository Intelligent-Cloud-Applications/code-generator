import {useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {API} from "aws-amplify";
import InstitutionContext from "../../../Context/InstitutionContext";
import Context from "../../../Context/Context";
import {toast} from "react-toastify";

const PutAttendance = () => {
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const { emailId } = useContext(Context).userData;
  console.log(emailId);
  const { classId } = useParams();

  useEffect(() => {
    const putAttendance = async () => {
      let response;
      if (!emailId) return;
      try {
        response = await API.post('main', `/user/put-attendance/${InstitutionId}`, { body: { classId, emailId } });
        toast.success("Attendance marked successfully");
        if (response.message) toast.info(response.message);
      } catch (error) {
        toast.error(error.response.data.message || "An unknown error occurred");
      }
    }

    putAttendance();
  }, [emailId, classId, InstitutionId]);
}

export default PutAttendance;