import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import '../styles/viewRecord.css';

export default function ViewRecord() {
    const { patientId, serial_no } = useParams();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

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
        return <div>{error}</div>;
    }

    if (!details) {
        return <div>Loading...</div>;
    }

    return (
        <div className="view-record-container">
            {/* <div className="header">
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            </div> */}
            <div className="main">
                <div className="healthrecord">
                    <h1>Medical History of the Patient</h1>

                    <div className="details-header">
                        <p><strong>Date:</strong> {new Date(details.MTD_DATE).toLocaleDateString()}</p>
                    </div>

                    <div className="details-grid">
                        <div className="form-group">
                            <label><strong>Doctor:</strong></label>
                            <input type="text" value={details.MTD_DOCTOR} readOnly />
                        </div>

                        <div className="form-group">
                            <label><strong>Complain:</strong></label>
                            <input type="text" value={details.MTD_COMPLAIN} readOnly />
                        </div>
                    </div>

                    <div className="form-group">
                        <label><strong>Diagnostics:</strong></label>
                        <textarea value={details.MTD_DIAGNOSTICS} readOnly />
                    </div>

                    <h2>Prescribed Medicines</h2>
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
                </div>
            </div>
        </div>
    );
}
