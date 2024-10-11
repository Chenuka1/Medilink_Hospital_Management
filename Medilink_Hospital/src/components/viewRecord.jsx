import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import '../styles/viewRecord.css'; // Import the custom CSS
import { Spinner } from 'react-bootstrap'; 

export default function ViewRecord() {
    const { patientId, serial_no } = useParams();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleContinue = () => {
        navigate(`/dashboard/remark/${patientId}/${serial_no}`);
    };

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(`https://localhost:7132/api/Treatment/patient/record/${patientId}/${serial_no}`);
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching records:', error);
                setError('Failed to fetch patient records.');
            }
        };

        fetchRecords();
    }, [patientId, serial_no]);

    if (error) {
        return <div className="error-notification">{error}</div>;
    }

    if (!details) {
        return (
            <div className="loading-container">
                <Spinner animation="border" /> 
            </div>
        );
    }

    return (
        <div className="view-record-container">
            <div className="header">
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                
            </div>
            <div className="main">
                <div className="healthrecord">
                    <h2>Medical History</h2>
                    <div className="details-header">
                        <p><strong>Date:</strong> {new Date(details.MTD_DATE).toLocaleDateString()}</p>
                        <p><strong>Doctor:</strong> {details.MTD_DOCTOR}</p>
                    </div>
                    <div className="form-group">
                        <label><strong>Complain:</strong></label>
                        <textarea value={details.MTD_COMPLAIN} readOnly />
                    </div>
                    <div className="form-group">
                        <label><strong>Diagnostics:</strong></label>
                        <textarea value={details.MTD_DIAGNOSTICS} readOnly />
                    </div>

                    <h3>Prescribed Medicines</h3>
                    <table className="prescription-table">
                        <thead>
                            <tr>
                                <th>Drug Name</th>
                                <th>Quantity</th>
                                <th>Dosage</th>
                                <th>Takes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.Drugs.map((drug, index) => (
                                <tr key={index}>
                                    <td>{drug.DrugName}</td>
                                    <td>{drug.MDD_QUANTITY}</td>
                                    <td>{drug.MDD_DOSAGE}</td>
                                    <td>{drug.MDD_TAKES}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="form-group">
                        <label><strong>Doctor Remarks:</strong></label>
                        <textarea value={details.MTD_REMARKS} readOnly />
                    </div>

                    <button className="continue-button" onClick={handleContinue}>Continue</button>
                </div>
            </div>
        </div>
    );
}
