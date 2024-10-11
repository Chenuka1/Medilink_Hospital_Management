import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DailyAppoinment.css"; 

export default function DailyAppointment() {
    const [appointments, setAppointments] = useState([]);
    
    // Correct usage of localStorage
    const Name = localStorage.getItem("Name");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`https://localhost:7132/api/Appointment/getappoinments/doctor?doctor=${Name}`);
                setAppointments(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAppointments();
    }, [Name]); 

    return (
        <div className="daily-appointment-container">
            <h1 className="title">Today's Appointments</h1>
            <p className="sub-title">Total Appointments: {appointments.length}</p>

            {appointments.length > 0 ? (
                <table className="appointments-table">
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Contact</th>
                            <th>Patient number</th>
                            <th>Appointment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.appointment_id}>
                                <td>{appointment.MAD_FULL_NAME}</td>
                                <td>{appointment.MAD_CONTACT}</td>
                                <td>{appointment.MAD_PATIENT_NO}</td>                                
                                <td>{new Date(appointment.MAD_APPOINMENT_DATE).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-appointments">No appointments found.</p>
            )}
        </div>
    );
}
