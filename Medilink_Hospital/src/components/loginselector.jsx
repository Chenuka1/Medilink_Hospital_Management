import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/loginselector.css';

const LoginSelector = () => {
  const navigate = useNavigate();

  const handleDoctorLogin = () => {
    navigate('/login'); // Update this path to your doctor login route
  };

  const handlePatientLogin = () => {
    navigate('/patient-login'); // Update this path to your patient login route
  };

  return (
    <div className="login-selector-container">
      <div className="login-selector">
        <h1>Select Account Type</h1>
        <div className="button-container">
          <div className="card" onClick={handleDoctorLogin}>
            <FontAwesomeIcon icon={faUserMd} size="3x" className="icon" />
            <button className="btn-doctor">Doctor Login</button>
          </div>
          <div className="card" onClick={handlePatientLogin}>
            <FontAwesomeIcon icon={faUser} size="3x" className="icon" />
            <button className="btn-patient">Patient Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelector;
