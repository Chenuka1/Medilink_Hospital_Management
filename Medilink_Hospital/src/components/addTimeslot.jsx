
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/timeslot.css';

const Addtimeslot = () => {
  const [formData, setFormData] = useState({
    MT_SLOT_DATE: '',
    MT_TIMESLOT: '',
    MT_START_TIME: '',
    MT_SEAT_NUMBER: '',
    MT_END_TIME: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Adjust the time format if needed
    const adjustedFormData = {
      ...formData,
      MT_TIMESLOT: formData.MT_TIMESLOT + ":00", // Add seconds to match HH:mm:ss format
      MT_START_TIME: formData.MT_START_TIME + ":00", // Add seconds for start time
      MT_END_TIME: formData.MT_END_TIME + ":00" // Add seconds for end time
    };
  
    try {
      const response = await axios.post('https://localhost:7132/api/Timeslot', adjustedFormData);
      console.log(response.data);
      alert('Timeslot added successfully!');
    } catch (error) {
      console.error("Failed to add timeslot", error.response?.data || error.message);
      setErrorMessage('Failed to add timeslot.');
    }
  };
  

  return (
    <div className="container2">
      <h1>Add timeslot</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="MT_SLOT_DATE"
            value={formData.MT_SLOT_DATE}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Timeslot</label>
          <input
            type="time"
            name="MT_TIMESLOT"
            value={formData.MT_TIMESLOT}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Start time</label>
          <input
            type="time"
            name="MT_START_TIME"
            value={formData.MT_START_TIME}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Seat-no</label>
          <input
            type="number"
            name="MT_SEAT_NUMBER"
            value={formData.MT_SEAT_NUMBER}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End time</label>
          <input
            type="time"
            name="MT_END_TIME"
            value={formData.MT_END_TIME}
            onChange={handleChange}
            required
          />
        </div>
        <button className="add-button" type="submit">Add time</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Addtimeslot;

