import { useState } from "react";
import Navbar from "../components/navbar";
import '../styles/home.css';
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import PatientAppointment from "../components/patientappoinment";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import image from "../assets/feedback.png";
import image2 from '../assets/medical-record.jpg';
import image3 from '../assets/appoinment.avif';
import image4 from '../assets/online-medical.png'
import image5 from '../assets/pharmacy_new.png'
import image6 from '../assets/medical-prescription.png'


export default function Home() {
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();

  const openup = () => {
    setPopup(true);
  };

  const closeup = () => {
    setPopup(false);
  };

  return (
    <div className="home-container">
      <Navbar />
      <br />

      <div id="home-section" className="section1">
        <h1>Patient Record Management System</h1>
        <p>
        The system is enables the  doctors to view  the medical history and add <br></br>
          add medical records for each patient visit.The system provides a platform<br></br>
          Schedule online appoinments.
        
     
         
        </p>
        <button onClick={openup}>Book Appointment</button>
      </div>


      {popup && (
        <div className="popup">
          <PatientAppointment />
          <button className="close-btn" onClick={closeup}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      )}



      <div className="services-container">
        <h2>Our Services</h2>
        <div id="services-section" className="services-section">



          <div className="service-card">
            <h3>Online appointments</h3>
            <div className="card-content">
              <p>The system allows patients to book an appoinment for doctor.</p>
              <img src={image4} alt="Online appointments" />
            </div>
          </div>

          <div className="service-card">
            <h3>Keep Medical History</h3>
            <div className="card-content">
              <p>The system keeps the patient's medical history.</p>
              <img src={image6} alt="Medical history" />
            </div>
          </div>

          <div className="service-card">
            <h3>Pharmacy Management</h3>
            <div className="card-content">
              <p>The system allows pharmacy users to track prescriptions.</p>
              <img src={image5} alt="Pharmacy management" />
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
