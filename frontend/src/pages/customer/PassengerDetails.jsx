import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../../components/HomeNavbar";
import "../../CSS/PassengerDetails.css";

const PassengerDetails = () => {
  const navigate = useNavigate();

  // Get passenger count from URL params or state management
  // For demo, we'll use 2 passengers
  const passengerCount = 2;

  const [passengers, setPassengers] = useState(
    Array(passengerCount)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        title: "",
        firstName: "",
        lastName: "",
        mobile: "",
        dob: "",
        gender: "",
      }))
  );

  const handleInputChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Passenger details submitted:", passengers);
    navigate("/payment");
  };

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <>
      <div className="passenger-details-page">
        <HomeNavbar />

        <div className="passenger-details-container">
          <h2>Passenger Details</h2>
          <p>Please enter details for all passengers</p>

          <form onSubmit={handleSubmit}>
            <div className="passenger-cards-container">
              {passengers.map((passenger, index) => (
                <div key={passenger.id} className="passenger-card">
                  <div className="passenger-number">Passenger {index + 1}</div>

                  <div className="passenger-form-row">
                    <div className="form-group">
                      <label>Title</label>
                      <select
                        value={passenger.title}
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value)
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) =>
                          handleInputChange(index, "firstName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) =>
                          handleInputChange(index, "lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="passenger-form-row">
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input
                        type="tel"
                        value={passenger.mobile}
                        onChange={(e) =>
                          handleInputChange(index, "mobile", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={passenger.dob}
                        onChange={(e) =>
                          handleInputChange(index, "dob", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        value={passenger.gender}
                        onChange={(e) =>
                          handleInputChange(index, "gender", e.target.value)
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="passenger-form-buttons">
              <button
                type="button"
                className="back-button"
                onClick={handleBack}
              >
                Back
              </button>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PassengerDetails;
