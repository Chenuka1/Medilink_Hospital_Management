import Navbar from "../components/navbar";
import '../styles/home.css';
import image from "../assets/feedback.png";
import image2 from '../assets/medical-record.jpg';
import image3 from '../assets/appoinment.avif';
import Appointment from "./appoinment";
import image4 from '../assets/doctorset.jpg';
import Footer from "../components/footer";


export default function Home() {
  return (
    <div className="home-container">
      <Navbar />
      
      <div id="home-section" className="section1">
        <h1>We care about your health</h1>
      </div>

      <div id="services-section" className="services-section">
        <h1>Our services</h1>
        <div className="card">
          <div className="service-item">
            <img src={image3} alt="Online appointment system" />
            <h3>Schedule an appointment online</h3>
          </div>
          <div className="service-item">
            <img src={image2} alt="Patient record system" />
            <h3>Keep patient medical history</h3>
          </div>
          <div className="service-item">
            <img src={image} alt="Patient record system" />
            <h3>Gather feedback from the patients</h3>
          </div>
        </div>
      </div>

      <div id="aboutus-section" className="aboutus-section">
  <div className="aboutus-content">
    <h2>Why choose us</h2>
    <br /> 
    <p>
      Medilink Health employs, consults, and partners with the most dedicated, skilled, and experienced healthcare professionals to offer some of the country’s most advanced, evidence-based clinical programmes for treating complex diseases through our Centres of Excellence. We have a sound record for offering outstanding outcomes.
      <br />
      Medilink hospital also offers treatment for increasingly common lifestyle-based diseases, preventive healthcare, and the most complete menu of diagnostic tests.
      <br />
      All Asiri Health Hospitals have international accreditation.
    </p>
    <button className="about-us-btn">Learn more</button>
  </div>
  <img src={image4} alt="doctor-list" />
</div>


      <div id="appoinment-section" className="appoinment-section">
        <h1>Book an appointment</h1>
        <Appointment />
      </div>

    <Footer/>
    </div>
  );
}
