import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for redirection after logout
import { FaUserCircle, FaCaretDown, FaBars } from 'react-icons/fa';
import image from '../assets/logo_new.png';
import '../styles/navbar.css';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate(); // To handle navigation after logout

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Clear any user session data (token, etc.)
        console.log()
        localStorage.removeItem('Token'); // Or the method you use to store the token
        // Redirect the user to the login page
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Left-aligned logo */}
                <div className="navbar-logo">
                    <img src={image} alt="Logo" />
                </div>

                {/* Mobile menu icon */}
                <div className="mobile-menu-icon" onClick={toggleMenu}>
                    <FaBars />
                </div>

                {/* Centered menu items */}
                <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    <li>
                        <ScrollLink to="home-section" smooth={true} duration={500} onClick={toggleMenu}>
                            Home
                        </ScrollLink>
                    </li>

                    <li>
                        <ScrollLink to="services-section" smooth={true} duration={500} onClick={toggleMenu}>
                            Services
                        </ScrollLink>
                    </li>

                    <li>
                        <Link to="/register-user">User Registration</Link>
                    </li>
                    
                   
                    
                </ul>

                {/* Right-aligned profile icon */}
                <div className="navbar-profile">
                    <div className="profile-icon" onClick={toggleDropdown}>
                        <FaUserCircle size={30} />
                        <FaCaretDown size={20} className="dropdown-icon" />
                    </div>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            
                            <Link to="/profile">profile </Link>
                            <button onClick={handleLogout} className="logout-button">Logout</button> {/* Logout button */}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
