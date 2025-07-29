import { Routes, Route } from "react-router-dom";
// import Otp from "./pages/auth/Otp";
// import { ContextProvider } from "./context/Context";
import LandingPage from "./pages/auth/LandingPage";
import Login from "./pages/auth/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import User from "./pages/dashboard/User";
import Credit from "./pages/dashboard/Credit";
import Notification from "./pages/dashboard/Notification";
import Payment from "./pages/dashboard/Payment";
import Feedback from "./pages/dashboard/Feedback";
import Cutlist from "./pages/dashboard/Cutlist";
import ScrollTop from "./components/top/ScrollTop";
import UserDetails from "./components/user/UserDetails";
import UserFeedback from './components/feedback/UserFeedback'

function App() {
  return (
    // <ContextProvider>
    <>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="admin-login" element={<Login />} />
        <Route path="" element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<User />} />
          <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/credit-packages" element={<Credit />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/feedback/:feedbackId" element={<UserFeedback />} />
          <Route path="/cutlist" element={<Cutlist />} />
        </Route>
      </Routes>
    </>
    // </ContextProvider>
  );
}

export default App;
