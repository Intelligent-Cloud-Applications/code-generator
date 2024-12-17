// Packages
import { Routes, Route } from "react-router-dom";

// Local
import Home from "../pages/public/Home";
import About from "../pages/public/AboutUs";
import Instructor from "../pages/public/Instructors";
import Error from "../pages/Error";
import Logout from "../pages/Auth/Logout";
import DashBoard from "../pages/private/Dashboard";
import Meeting from "../pages/private/Meeting";
import Query from "../pages/public/Query";
import Gallery from "../pages/public/Gallery";
import Schedule from "../pages/public/Schedule";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";
import Terms from "../pages/public/Terms";
import Refund from "../pages/public/Refund";
import Attendance from "../pages/private/Attendance";
import Subscriptions from "../pages/private/Subscriptions";
import PaymentSuccessful from "../pages/private/PaymentSuccessful";
import PaymentFailed from "../pages/private/PaymentFailed";
import Rating from "../pages/private/Rating";
import PutAttendance from "../pages/private/PutAttendance";
import DevAuth from "../pages/Auth/dev";
import Redirect from "../pages/Auth/Login/Redirect";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import { HybridPayment } from "../pages/private/HybridPayment";
import QR from "../pages/private/PutAttendance/QR";
import HomePayment from "../CommonPayment/HomePayment";
import PhoneAuth from "../pages/Auth/phone";

//const Navigate = ({to}) => {
//  const navigate = useNavigate();
//  useEffect(() => {
//    navigate(to);
//  }, [])
//  return (
//    <div></div>
//  )
//}

// Code
const RoutesContainer = () => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/aboutus" element={<About />} />
      <Route path="/instructor" element={<Instructor />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/login" element={process.env.REACT_APP_STAGE === "PROD" ? <PhoneAuth /> : <Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/signup" element={process.env.REACT_APP_STAGE === "PROD" ? <Error /> : <Signup />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/meeting" element={<Meeting />} />
      <Route path="/query" element={<Query />} />
      <Route path="/qr" element={<Attendance />} />
      <Route path="/subscription" element={<Subscriptions />} />
      <Route path="/hybrid" element={<HybridPayment />} />
      <Route path="/paymentsuccessful" element={<PaymentSuccessful />} />
      <Route path="/paymentfailed" element={<PaymentFailed />} />
      <Route path="/rating" element={<Rating />} />
      <Route
        path="/auth"
        element={
          process.env.REACT_APP_STAGE === "PROD" ? <Error /> : <DevAuth />
        }
      />
      <Route path="/put-attendance" element={<PutAttendance />} />
      <Route path="/attendance-qr" element={<QR />} />
      <Route path="/redirect" element={<Redirect />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/allpayment/:institution/:cognitoId/:emailId"
        element={<HomePayment />}
      />
      <Route path="/allpayment/:institution" element={<HomePayment />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default RoutesContainer;
