import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Register from "./pages/auth/Register";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import FlightList from "./pages/customer/FlightList";
import AdminLogin from "./pages/admin/AdminLogin";
import AirlineManagement from "./pages/admin/AirlineManagement";
import FlightManagement from "./pages/admin/FlightManagement";
import ScheduleFight from "./pages/admin/ScheduleFight";
import PassengersList from "./pages/admin/PassengersList";
import CustomerFeedback from './pages/feedback/CustomerFeedback';
import PassengerDetails from './pages/customer/PassengerDetails';
import BookingPreview from './pages/customer/BookingPreview';
import Payment from './pages/customer/Payment';
import TicketPage from './pages/customer/TicketPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminLogin />} />



        //check the validation with the user is login or not
        <Route path="/flightlist" element={<FlightList />} />



        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/airlinemanagement" element={<AirlineManagement/>}/>
        <Route path="/flightmanagement" element={<FlightManagement/>}/>
        <Route path="/scheduleflight" element={<ScheduleFight/>}/>
        <Route path="/passengerslist" element={<PassengersList/>}/>
        <Route path="/feedback" element={<CustomerFeedback/>}/>
        
        
        <Route path="/passengerdetails" element={<PassengerDetails/>}/>
        <Route path="/bookingpreview" element={<BookingPreview/>}/>
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/ticketpage" element={<TicketPage/>}/>

        

      </Routes>
    </>
  );
}

export default App;
