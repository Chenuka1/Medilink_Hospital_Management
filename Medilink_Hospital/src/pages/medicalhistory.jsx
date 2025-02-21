import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/addPatient.css';
import '../styles/medicalhistory.css';
import Addpatient from '../components/addPatients';
import { useNavigate } from 'react-router-dom';

export default function MedicalHistory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [popup, setPopup] = useState(null);
    const [treatmentPopup, setTreatmentPopup] = useState(null);
    const navigate = useNavigate();

    // Define the fetchAllPatients function
    const fetchAllPatients = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://localhost:7132/api/Patient');
            setPatients(response.data);
            setFilteredPatients(response.data); // Initially, set filteredPatients to all patients
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Failed to load patient data.');
            setPatients([]);
            setFilteredPatients([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all patients when the component mounts
    useEffect(() => {
        fetchAllPatients();
    }, []);

    // Filter patients by search term (real-time filtering)
    useEffect(() => {
        if (searchTerm) {
            const filtered = patients.filter((patient) =>
                patient.MPD_MOBILE_NO.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPatients(filtered);
            setErrorMessage(filtered.length === 0 ? 'No matching patients found.' : '');
        } else {
            setFilteredPatients(patients); // Reset to all patients if searchTerm is empty
        }
    }, [searchTerm, patients]);

    const handleSearch = async () => {
        if (!searchTerm) {
            // If search term is empty, fetch all patients
            await fetchAllPatients();
            setErrorMessage(''); // Clear any error message
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`https://localhost:7132/api/Patient/SearchByContact/${searchTerm}`);
            setPatients(response.data);
            setErrorMessage('');
            setPopup(null);
            setTreatmentPopup(null);
        } catch (error) {
            setPatients([]);
            if (error.response && error.response.status === 404) {
                setErrorMessage('No patient found with the provided contact number.');
                setPopup(<Addpatient />);
            } else {
                setErrorMessage('An error occurred while searching for the patient.');
                setPopup(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRecord = (patientId) => {
        setTreatmentPopup(null);
        navigate(`/dashboard/addrecord/${patientId}`);
    };

    const handleViewRecord = async (patientId) => {
        try {
            setErrorMessage('');
            const response = await axios.get(`https://localhost:7132/api/Treatment/patient/${patientId}`);
            setTreatmentPopup(
                <div className="treatment-popup">
                    <h2>Treatment Details</h2>
                    <div className="treatment-list">
                        {response.data.map((treatment, index) => (
                            <div className="treatment-card" key={index}>
                                <h3>Treatment {index + 1}</h3>
                                <p>Treatment-date: {new Date(treatment.MTD_CREATED_DATE).toLocaleDateString()}</p>
                                <button onClick={() => { navigate(`view-record/${patientId}/${treatment.MTD_SERIAL_NO}`) }}>View info</button>
                            </div>
                        ))}
                    </div>
                    <button className="close-popup-button" onClick={() => setTreatmentPopup(null)}>Close</button>
                </div>
            );
        } catch (error) {
            console.error('Error fetching treatment details:', error);
            setErrorMessage('Failed to fetch treatment details.');
            setTreatmentPopup(null);
        }
    };

    const handleNoPatient = () => {
        setPopup(<Addpatient />);
    };

    const closePopup = () => {
        setPopup(null);
    };

    return (
        <div className="medical-history-container">
            <h1 className="title">Search Patient Records</h1>
            <div className="search-container">
                <input
                    type="search"
                    placeholder="Enter patient contact"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="button-container">
                    <button className="search-button" onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                    <button className="no-patient-button" onClick={handleNoPatient}>
                        Add Patient
                    </button>
                </div>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {filteredPatients.length > 0 && (
                <div className="patient-details">
                    <table className="records-table">
                        <thead>
                            <tr>
                                <th>Patient Code</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>NIC</th>
                                
                                <th colSpan="2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.MPD_PATIENT_CODE}>
                                    <td>{patient.MPD_PATIENT_CODE}</td>
                                    <td>{patient.MPD_PATIENT_NAME}</td>
                                    <td>{patient.MPD_MOBILE_NO}</td>
                                    
                                    <td>{patient.MPD_NIC_NO}</td>
                                    <td>
                                        <button
                                            className="action-button"
                                            onClick={() => handleViewRecord(patient.MPD_PATIENT_CODE)}
                                        >
                                            View treatment details
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="action-button"
                                            onClick={() => handleAddRecord(patient.MPD_PATIENT_CODE)}
                                        >
                                            Add treatment details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {popup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-popup-button" onClick={closePopup}>X</button>
                        {popup}
                    </div>
                </div>
            )}

            {treatmentPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        {treatmentPopup}
                    </div>
                </div>
            )}
        </div>
    );
}
