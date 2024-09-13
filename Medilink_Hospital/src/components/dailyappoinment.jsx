import { useEffect, useState } from "react";
import axios from "axios";

export default function DailyAppoinment() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('https://localhost:7132/api/Appointment');
                setAppointments(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="daily-appointment">
            <h1>Daily appoinments</h1>
            {appointments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Patient Contact</th>
                            <th>Timeslot</th>
                            <th>Appointment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.appointment_id}>
                                <td>{appointment.mad_full_name}</td>
                                <td>{appointment.mad_contact}</td>
                                <td>{appointment.mad_timeslot}</td>
                                <td>{new Date(appointment.mad_appoinment_date).toLocaleDateString()}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No appointments found.</p>
            )}

            
        </div>
    );
}
