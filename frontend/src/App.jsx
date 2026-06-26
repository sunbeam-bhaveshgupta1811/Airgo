import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/customer/auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import FlightList from "./pages/customer/FlightList";
import AirlineManagement from "./pages/admin/AirlineManagement";
import FlightManagement from "./pages/admin/FlightManagement";
import ScheduleFight from "./pages/admin/ScheduleFight";
import PassengersList from "./pages/admin/PassengersList";
import { ToastContainer } from "react-toastify";
import Profile from "./components/Profile";
import PassengerDetails from "./pages/customer/PassengerDetails";
import BookingPreview from "./pages/customer/BookingPreview";
import Payment from "./pages/customer/Payment";
import TicketPage from "./pages/customer/TicketPage";
import AddAirline from "./pages/admin/AddAirline";
import AddFlights from "./pages/admin/Addflight";
import AddScheduleFlight from "./pages/admin/AddScheduleFlight";
import FlightSearch from "./pages/customer/FlightSearch";
import SeatSelection from "./pages/customer/SeatSelection";
import AdminLayout from "./pages/admin/AdminLayout";
import CustomerFeedback from "./pages/feedback/CustomerFeedback";
import AdminLogin from "./pages/admin/auth/Login";
import AdminViewFeedbackTable from "./pages/admin/auth/AdminViewFeedback";
import PerformanceChart from "./components/PerformanceChart";
import FAQChatbot from './components/Faq';
import SeatSelection from "./pages/customer/SeatSelection";
import ManagerLayout from "./pages/manager/ManagerLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import TerminalManagement from "./pages/manager/TerminalManagement";
import GateManagement from "./pages/manager/GateManagement";
import ManagerBookings from "./pages/manager/ManagerBookings";
import ManagerLogin from "./pages/manager/auth/ManagerLogin";

function App() {
  return (
    <>
      <FAQChatbot />

      <Routes>
        {/* Home Layout with nested routes */}
        <Route path="/" element={<Home />}>
          {/* Default route shows only FlightSearch (already in Home component) */}
          <Route index element={<></>} />
          <Route path="about" element={<About />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes nested under Home */}
          <Route path="customer">
            <Route index element={<FlightSearch />} />
            <Route path="flightlist" element={<FlightList />} />
            <Route path="flightsearch" element={<FlightSearch />} />
            <Route
              path="seatselection"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="passengerdetails"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
                  <PassengerDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookingpreview"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
                  <BookingPreview />
                </ProtectedRoute>
              }
            />
            <Route
              path="payment"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="ticketpage"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
                  <TicketPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="feedback"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER", "USER"]}>
                  <CustomerFeedback />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>

        {/* Authentication Routes - Outside Home layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/managerlogin" element={<ManagerLogin />} />
        <Route path="/unauthorized" element={<Navigate to="/" replace />} />

        {/* Admin Routes with separate AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/adminlogin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="admindashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="addairline" element={<AddAirline />} />
          <Route path="airlinemanagement" element={<AirlineManagement />} />
          <Route path="flightmanagement" element={<FlightManagement />} />
          <Route path="scheduleflight" element={<ScheduleFight />} />
          <Route path="addscheduleflight" element={<AddScheduleFlight />} />
          <Route path="addflight" element={<AddFlights />} />
          <Route path="passengerslist" element={<PassengersList />} />
          <Route path="viewfeedback" element={<AdminViewFeedbackTable />} />
          <Route path="feedback" element={<Navigate to="/admin/viewfeedback" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="performance" element={<PerformanceChart />} />
        </Route>

        {/* Manager Routes with separate ManagerLayout */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["AIRPORT_MANAGER"]} redirectTo="/managerlogin">
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerDashboard />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="terminals" element={<TerminalManagement />} />
          <Route path="gates" element={<GateManagement />} />
          <Route path="bookings" element={<ManagerBookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-all route - Redirect to home if no match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
