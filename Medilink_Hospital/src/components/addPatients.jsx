import React, { useState } from 'react';
import axios from 'axios';
import '../styles/addPatient.css';

const Addpatient = () => {
    const [formData, setFormData] = useState({
        MPD_PATIENT_NAME: '',
        MPD_MOBILE_NO: '',
        MPD_NIC_NO: '',
        MPD_PATIENT_REMARKS: '',
        MPD_ADDRESS: '',
        MPD_CITY: '',
        MPD_GUARDIAN: '',
        MPD_GUARDIAN_CONTACT_NO: '',
        MPD_PATIENT_CODE: '',
        MPD_PATIENT_TYPE: '',
        MPD_STATUS: '',
        MPD_CREATED_BY: '',
        MPD_UPDATED_BY: '',
        MPD_CREATED_DATE: new Date().toISOString(),
        MPD_UPDATED_DATE: null,
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); 
        try {
            await axios.post('https://localhost:7132/api/Patient', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert("Patient registered successfully");
            setFormData({
                MPD_PATIENT_NAME: '',
                MPD_MOBILE_NO: '',
                MPD_NIC_NO: '',
                MPD_PATIENT_REMARKS: '',
                MPD_ADDRESS: '',
                MPD_CITY: '',
                MPD_GUARDIAN: '',
                MPD_GUARDIAN_CONTACT_NO: '',
                MPD_PATIENT_CODE: '',
                MPD_PATIENT_TYPE: '',
                MPD_STATUS: '',
                MPD_CREATED_BY: '',
                MPD_UPDATED_BY: '',
                MPD_CREATED_DATE: new Date().toISOString(),
                MPD_UPDATED_DATE: null,
            });
        } catch (error) {
            console.error("Failed to register the patient", error.response?.data || error.message);
            setErrorMessage(`Failed to register the patient: ${error.response?.data || error.message}`);
        }
    };

    return (
        <div>

<div className="add-patient-form-container">
            <h2 className="form-title">Patient Registration Form</h2>
            

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form className="patient-form" onSubmit={handleSubmit}>
                <div className="form-section1">
                    <div className="form-grid1">
                        <div className="form-group">
                            <label>Full Name <span className="required">*</span></label>
                            <input 
                                type="text" 
                                name="MPD_PATIENT_NAME"
                                value={formData.MPD_PATIENT_NAME}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>NIC Number</label>
                            <input 
                                type="text"
                                name="MPD_NIC_NO"
                                value={formData.MPD_NIC_NO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Number <span className="required">*</span></label>
                            <input 
                                type="text"
                                name="MPD_MOBILE_NO"
                                value={formData.MPD_MOBILE_NO}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input 
                                type="text"
                                name="MPD_ADDRESS"
                                value={formData.MPD_ADDRESS}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>City <span className="required">*</span></label>
                            <input 
                                type="text"
                                name="MPD_CITY"
                                value={formData.MPD_CITY}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Guardian <span className="required">*</span></label>
                            <input 
                                type="text"
                                name="MPD_GUARDIAN"
                                value={formData.MPD_GUARDIAN}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Guardian Contact No <span className="required">*</span></label>
                            <input 
                                type="text"
                                name="MPD_GUARDIAN_CONTACT_NO"
                                value={formData.MPD_GUARDIAN_CONTACT_NO}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Created By <span className="required">*</span></label>
                            <input 
                                type="text"
                                name="MPD_CREATED_BY"
                                value={formData.MPD_CREATED_BY}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-button">Register Patient</button>
            </form>
        </div>

       
        </div>
    );
};

export default Addpatient;
