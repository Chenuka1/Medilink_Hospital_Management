
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/patientappoinment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Corrected import
import { faUserMd } from '@fortawesome/free-solid-svg-icons';    // Corrected import

export default function PatientAppointment({ onClose }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctor,setDoctor]=useState("");
  const [specialization, setSpecialization] = useState("OPD");
  const [currentScreen, setCurrentScreen] = useState(0);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [MAD_FULL_NAME, setFullName] = useState("");
  const [MAD_CONTACT, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  useEffect(() => {
    // Check if the user is already logged in by checking localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      setCurrentScreen(1); // Skip the login screen if logged in
    }
  }, []);

  
  const handleLogin = async () => {
    try {
      const response = await axios.post(`https://localhost:7132/api/AppoinmentLogin/Login`, {
        email: email,
        password: password,
      });

      console.log(response.data);
      alert("Login successful");

      // Store login status in localStorage
      localStorage.setItem("isLoggedIn", true);

      // Proceed to the next screen
      setCurrentScreen(1);
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };
  

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      try {
        const response = await axios.get(
          `https://localhost:7132/api/User/suggest?query=${searchValue}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (selectedDoctor) {
        try {
          const response = await axios.get(`https://localhost:7132/api/Timeslot/Doctor/${selectedDoctor}`);
          setAppointmentDetails(response.data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setAppointmentDetails([]);
        }
      }
    };

    fetchAppointments();
  }, [selectedDoctor]);

  const handleSuggestionClick = (doctorName) => {
    setSelectedDoctor(doctorName);
    setQuery(doctorName);
    setSuggestions([]);
  };
  const handleConfirm = async () => {
    if (!MAD_FULL_NAME || !MAD_CONTACT) {
      alert("Please enter both name and contact details.");
      return;
    }
    try {
      await submitAppointment();
      await handleUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchClick = async () => {
    try {
      const response = await axios.get("https://localhost:7132/api/User/doctorname/specialization", {
        params: {
          name: query,
          specialization: specialization,
        },
      });
  
      if (response.data.length > 0) {
        setDoctor(response.data); // Assuming `response.data` is an array of doctor names
        setSelectedDoctor(response.data[0].MUD_USER_NAME); // Set the first doctor from the result as the selected doctor
        setCurrentScreen(2); // Move to the second screen
      } else {
        setDoctor([]); // No doctors found
        alert("No doctors found for the selected specialization.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  
  
  
  const handleBackClick = () => {
    setCurrentScreen((prevScreen) => (prevScreen > 0 ? prevScreen - 1 : 0));
  };
  

  const handleChannelClick = () => {
    setCurrentScreen(3);
  };

  const handleBookNowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCurrentScreen(4);
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`https://localhost:7132/api/Timeslot/${selectedAppointment.MT_SLOT_ID}/incrementSeat`);
    } catch (error) {
      console.error("Failed to update time slot", error.response?.data || error.message);
    }
  };

  const email1 = localStorage.getItem("Email");

const submitAppointment = async () => {
  try {
    // Check if email is retrieved correctly
    if (!email1) {
      alert("Email not found. Please log in again.");
      return;
    }

    // Validate the selectedAppointment fields before proceeding
    if (!selectedAppointment) {
      alert("No appointment selected. Please choose a time slot.");
      return;
    }

    const appointmentData = {
      MAD_FULL_NAME,  // Make sure MAD_FULL_NAME and MAD_CONTACT are defined in the component
      MAD_CONTACT,
      MAD_PATIENT_NO: selectedAppointment.MT_PATIENT_NO + 1,
      MAD_APPOINMENT_DATE: selectedAppointment.MT_SLOT_DATE,
      MAD_START_TIME: selectedAppointment.MT_START_TIME,
      MAD_END_TIME: selectedAppointment.MT_END_TIME,
      MAD_DOCTOR: selectedAppointment.MT_DOCTOR,
      MAD_ALLOCATED_TIME:selectedAppointment.MT_ALLOCATED_TIME,
      MAD_EMAIL: email1,  // Use retrieved email from localStorage
    };

    // Post the appointment data
    await axios.post("https://localhost:7132/api/Appointment", appointmentData);

    alert("Appointment submitted successfully");
    setCurrentScreen(5); // Navigate to the desired screen after successful submission
  } catch (error) {
    console.error("Error booking appointment:", error);
    alert("Failed to submit the appointment. Please try again.");
  }
};



  return (
    <div className="appoinment-screen-container">

      <div className="mobile-frame">

      

      <div className={`screen login-screen ${currentScreen === 0 ? 'active' : ''}`}>
        <h1>Login</h1>
        <label>Email</label>
        <input
          type="text"
          placeholder="please enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an account? <a href="/register-user">Create One</a></p>

      </div>
      <div className={`screen1 ${currentScreen === 1 ? 'active' : ''}`}>
        <h1>Find a doctor and book an appointment</h1>
        <label>Doctor name</label>
        <input
          type="search"
          placeholder="Enter doctor name"
          value={query}
          onChange={handleSearch}
        />
        {suggestions.length > 0 && (
          <ul className="doctor-suggestions">
            {suggestions.map((doctorName, index) => (
              <li key={index} onClick={() => handleSuggestionClick(doctorName)}>
                {doctorName}
              </li>
            ))}

           {/* <button onClick={() => handleBookNowClick(appointment)}>Book now</button> */}
          </ul>
        )}
        <label>Specialization</label>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option></option>
          
          <option value="physciatrist">Psychiatrist</option>
          <option value="Dentist">Dentist</option>
          <option value="cardiologist">cardiologist</option>
        </select>
        <button className="btn-search-appointment" onClick={handleSearchClick}>Search</button>
        
      </div>

    
      <div className={`screen2 ${currentScreen === 2 ? 'active' : ''}`}>
  {doctor.length > 0 ? (
    <ul className="doctor-list">
      {doctor.map((doc, index) => (
        <li key={index} className="doctor-item">
          <div className="doctor-details">
            <span>{doc.MUD_USER_NAME}</span>
            <p>{doc.MUD_SPECIALIZATION}</p>
          </div>
          <span className="channel-icon" onClick={handleChannelClick} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faUserMd} />
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p>No doctors available.</p>
  )}
  <button onClick={handleBackClick}>Back</button>
</div>





      
<div className={`screen3 ${currentScreen === 3 ? 'active' : ''}`}>
  <div>
    {appointmentDetails.length > 0 ? (
      <ul>
        {appointmentDetails.map((appointment, index) => (
          <li key={index}>
            <p>Appointment Date: {new Date(appointment.MT_SLOT_DATE).toLocaleDateString()}</p>
            <p>
              Time duration: {new Date(`1970-01-01T${appointment.MT_START_TIME}`).toLocaleTimeString('en-LK', {
                timeZone: 'Asia/Colombo',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })} -{" "}
              {new Date(`1970-01-01T${appointment.MT_END_TIME}`).toLocaleTimeString('en-LK', {
                timeZone: 'Asia/Colombo',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </p>
            {appointment.MT_PATIENT_NO >= appointment.MT_MAXIMUM_PATIENTS ? (
              <p>Bookings are filled</p>
            ) : (
              <button onClick={() => handleBookNowClick(appointment)}>Book now</button>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>No appointments available.</p>
    )}
    <button onClick={handleBackClick}>Back</button>
  </div>
</div>




      {/* Screen 4: Appointment Confirmation */}
      <div className={`screen4 ${currentScreen === 4 ? 'active' : ''}`}>
        {selectedAppointment && (
          <>
            <p>Your patient number is {selectedAppointment.MT_PATIENT_NO + 1}</p>
            <p>Your time is {selectedAppointment.MT_ALLOCATED_TIME}</p>
            
            
            <label>Patient full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={MAD_FULL_NAME}
              onChange={(e) => setFullName(e.target.value)}
            />
            <br />
            <label>Contact</label>
            <input
              type="text"
              placeholder="Enter contact number"
              value={MAD_CONTACT}
              onChange={(e) => setContact(e.target.value)}
            />


            
            <p>Appointment Date: {new Date(selectedAppointment.MT_SLOT_DATE).toLocaleDateString()}</p>
            <p>
              Doctor available time: {new Date(`1970-01-01T${selectedAppointment.MT_START_TIME}`).toLocaleTimeString('en-LK', {
                timeZone: 'Asia/Colombo',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })} -{" "}
              {new Date(`1970-01-01T${selectedAppointment.MT_END_TIME}`).toLocaleTimeString('en-LK', {
                timeZone: 'Asia/Colombo',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </p>
           

            <button onClick={handleConfirm}>Book now</button>
            <br></br>
            <br></br>
            <button onClick={handleBackClick}>Back</button>
          </>
        )}
      </div>

      {/* Screen 5: Confirmation Message */}
      <div className={`screen5 ${currentScreen === 5 ? 'active' : ''}`}>
        <h1>Thank you for your booking!</h1>
        <p>Your appointment has been successfully booked.</p>

        <button onClick={handleBackClick}>Back</button>
      </div>







      </div>
    
      

    </div>
  );
}

