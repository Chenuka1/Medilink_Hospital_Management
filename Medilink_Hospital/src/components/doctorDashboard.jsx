import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/doctorDashboard.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_new.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCog, faHistory, faPills, faUserPlus, 
    faCalendarAlt, faSignOutAlt, faClock, faUserCircle, 
    faUserMd, faClinicMedical // Import the pharmacy icon
} from '@fortawesome/free-solid-svg-icons'; // Font Awesome icons

export default function Doctordashboard() {
    const [isOpen, setIsOpen] = useState(true);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
    const navigate = useNavigate();
    
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const toggleSettingsDropdown = () => {
        setShowSettingsDropdown(!showSettingsDropdown);
    };

    const handleLogout = () => {
        localStorage.removeItem('Token');
        navigate('/');
    };

    return (
        <div className={`doctorDashboard ${isOpen ? 'open' : 'closed'}`}>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                {/* Logo Section */}
                <div className="logo">
                    <img src={logo} alt="Doctor Dashboard Logo" />
                </div>
                {/* <button className="toggleButton" onClick={toggleNavbar}>
                    {isOpen ? 'Close' : 'Open'}
                </button> */}
                <ul className="menu">
                    <li><NavLink to="" activeClassName="active"><FontAwesomeIcon icon={faHistory} /> {isOpen && 'Medical History'}</NavLink></li>
                    <li><NavLink to="register-medicines"><FontAwesomeIcon icon={faPills} /> {isOpen && 'Drug details'}</NavLink></li>       
                    <li><NavLink to="pharmacy"><FontAwesomeIcon icon={faClinicMedical} /> {isOpen && 'Pharmacy'}</NavLink></li> {/* Pharmacy section */}
                    <li><NavLink to="Add-users"><FontAwesomeIcon icon={faUserMd} /> {isOpen && 'Add users'}</NavLink></li>
                    <li><NavLink to="daily-appointments"><FontAwesomeIcon icon={faCalendarAlt} /> {isOpen && 'Appointments'}</NavLink></li>           
                    <li><NavLink to="add-timeslot"><FontAwesomeIcon icon={faClock} /> {isOpen && 'Add Timeslots'}</NavLink></li>
                    
                    {/* <li><NavLink to="/"><FontAwesomeIcon icon={faUserCircle} /> {isOpen && 'Patient Interface'}</NavLink></li> */}
                </ul>

                <ul className="below">
                   <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</li>
                </ul>
            </div>

            <div className="main-content1">
                <Outlet />
            </div>
        </div>
    );
}
