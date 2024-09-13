import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import image from '../assets/logo.png';
import '../styles/navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={image} alt="Logo" />
                </div>
                <ul className="navbar-menu">
                    <li>
                        <ScrollLink to="home-section" smooth={true} duration={500}>
                            Home
                        </ScrollLink>
                    </li>
                    <li>
                        <ScrollLink to="appoinment-section" smooth={true} duration={500}>
                            Book Appointment
                        </ScrollLink>
                    </li>
                    <li>
                        <ScrollLink to="aboutus-section" smooth={true} duration={500}>
                            About Us
                        </ScrollLink>
                    </li>
                    <li>
                        <ScrollLink to="services-section" smooth={true} duration={500}>
                            Services
                        </ScrollLink>
                    </li>
                    <li>
                        <Link to="/dashboard">Doctor Dashboard</Link>
                    </li>
                </ul>
                <div className="navbar-profile">
                    <div className="profile-icon">
                        <FaUserCircle size={30} />
                        <FaCaretDown size={20} className="dropdown-icon" />
                    </div>
                    <div className="dropdown-menu">
                        <ScrollLink to="profile-section" smooth={true} duration={500}>
                            Profile
                        </ScrollLink>
                        <ScrollLink to="settings-section" smooth={true} duration={500}>
                            Settings
                        </ScrollLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}
