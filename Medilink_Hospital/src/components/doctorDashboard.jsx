import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/doctorDashboard.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons'; // Font Awesome icon

export default function Doctordashboard() {
    const [isOpen, setIsOpen] = useState(true);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false); // State for settings dropdown
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
                <button className="toggleButton" onClick={toggleNavbar}>
                    {isOpen ? 'Close' : 'Open'} Menu
                </button>
                <ul>
                    
                    <li><NavLink to="" activeClassName="active">View Medical History</NavLink></li>
                    <li><NavLink to="register-medicines">Register medicines</NavLink></li>
                    <li><NavLink to="add-patient">Add patients</NavLink></li>
                    <li><NavLink to="/">Patient portal</NavLink></li>
                    <li><NavLink>Daily appoinments</NavLink></li>
                    <li><NavLink to="add-timeslot" activeClassName="active">Add Timeslots</NavLink></li>
                </ul>

                <ul className="below">
                    <li onClick={toggleSettingsDropdown} className="settings-option">
                        <FontAwesomeIcon icon={faCog} className="settings-icon" /> 
                        <span>Settings</span>
                    </li>
                    {showSettingsDropdown && (
                        <ul className="settings-dropdown">
                            <li onClick={handleLogout}>Logout</li>
                            
                        </ul>
                    )}
                </ul>
            </div>

            <div className="main-content">
                <div className="">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
