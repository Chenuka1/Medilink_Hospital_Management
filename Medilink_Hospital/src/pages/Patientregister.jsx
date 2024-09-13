


import React, { useState } from 'react';
import axios from 'axios';
import '../styles/patientregister.css';
import { useNavigate } from 'react-router-dom';

export default function Patientregister() {
    const [formData, setFormData] = useState({
        mp_patient_id:'',
        mp_full_name: '',
        mp_email: '',
        mp_contact: '',
        mp_password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('https://localhost:7132/api/Patient', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert("Patient registered successfully");
            navigate("/"); 
        } catch (error) {
            console.error("Failed to register the patient", error);
        }
    };

    const handleReset = () => {
        setFormData({
            mp_patient_id:"",
            mp_full_name: '',
            mp_email: '',
            mp_contact: '',
            mp_password: '',
        });
    };

    return (
        <div className="main-container">
            <div className="register-patients-container">
                <form onSubmit={handleSubmit} className="patient-form">
                    <h1>Register Patients</h1>

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="mp_full_name"
                            placeholder="Enter full name"
                            value={formData.mp_full_name}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group1">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="mp_email"
                            placeholder="Enter email"
                            value={formData.mp_email}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group1">
                        <label className="form-label">Contact</label>
                        <input
                            type="text"
                            name="mp_contact"
                            placeholder="Enter contact"
                            value={formData.mp_contact}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group1">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="mp_password"
                            placeholder="Enter password"
                            value={formData.mp_password}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                   
                    <input type="submit" value="Register" className="form-submit-button" />
                    <input type="reset" value="Clear" onClick={handleReset} className="form-reset-button" />
                </form>
            </div>
        </div>
    );
}



