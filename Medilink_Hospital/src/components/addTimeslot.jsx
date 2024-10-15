import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/addtimeslot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const Addtimeslot = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    MT_SLOT_DATE: '',
    MT_TIMESLOT: '',
    MT_START_TIME: '',
    MT_PATIENT_NO: 0,
    MT_END_TIME: '',
    MT_MAXIMUM_PATIENTS: '',
    MT_DOCTOR: '',
    MT_ALLOCATED_TIME: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const [timeslotData, setTimeslotData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSuggestionClick = (doctorName) => {
    setSelectedDoctor(doctorName);
    setQuery(doctorName);
    setFormData((prevFormData) => ({
      ...prevFormData,
      MT_DOCTOR: doctorName // Update the selected doctor in formData
    }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set MT_ALLOCATED_TIME equal to MT_START_TIME
    const adjustedFormData = {
      ...formData,
      MT_TIMESLOT: formData.MT_TIMESLOT + ":00",
      MT_START_TIME: formData.MT_START_TIME + ":00",
      MT_END_TIME: formData.MT_END_TIME + ":00",
      MT_ALLOCATED_TIME: formData.MT_START_TIME + ":00", // Assign MT_START_TIME to MT_ALLOCATED_TIME
    };

    try {
      const response = await axios.post('https://localhost:7132/api/Timeslot', adjustedFormData);
      console.log(response.data);
      alert('Timeslot added successfully!');
      window.location.reload();

    } catch (error) {
      console.error("Failed to add timeslot", error.response?.data || error.message);
      setErrorMessage('Failed to add timeslot.');
    }
  };


  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      try {
        const response = await axios.get(
          `https://localhost:7132/api/User/suggest?query=${searchValue}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };


  useEffect(() => {   // Correct useEffect syntax
    const fetchTimeslots = async () => {
      try {
        const response = await axios.get('https://localhost:7132/api/Timeslot');
        console.log(response.data);  // Log the data to verify its structure
        setTimeslotData(response.data);
      } catch (error) {
        console.error('Error fetching timeslots:', error);
        setErrorMessage('Failed to load timeslots. Please try again later.');
      }
    };

    fetchTimeslots();
  }, []);  // Empty dependency array to run the effect once when the component mounts



  const Deletetime = async (id) => {
    if (window.confirm("Are you sure you want to delete this timeslot?")) {
      try {
        await axios.delete(`https://localhost:7132/api/Timeslot/${id}`);
        alert("Timeslot deleted successfully");
        setTimeslotData(timeslotData.filter((timeslot) => timeslot.MT_SLOT_ID !== id));
      } catch (error) {
        console.error("Error deleting timeslot:", error.response?.data || error.message);
        alert("Failed to delete timeslot.");
      }
      
    }
  };



  return (
    <div>
      <div className="addtimeslot-container">
        <h1>Add Available Timeslot</h1>
        <form className="form-timeslot" onSubmit={handleSubmit}>
          <div className="form-group-timeslot">
            <label>Date</label>
            <input
              type="date"
              name="MT_SLOT_DATE"
              value={formData.MT_SLOT_DATE}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-timeslot">
            <label>Start Time</label>
            <input
              type="time"
              name="MT_START_TIME"
              value={formData.MT_START_TIME}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-timeslot">
            <label>End Time</label>
            <input
              type="time"
              name="MT_END_TIME"
              value={formData.MT_END_TIME}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-timeslot">
            <label>Maximum Patients</label>
            <input
              type="number"
              name="MT_MAXIMUM_PATIENTS"
              value={formData.MT_MAXIMUM_PATIENTS}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-timeslot">
            <label>Doctor Name</label>
            <input
              type="search"
              placeholder="Enter doctor name"
              value={query}
              onChange={handleSearch}
            />

            {suggestions.length > 0 && (
              <ul className="doctor-suggestions">
                {suggestions.map((doctorName, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(doctorName)}>
                    {doctorName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="submit-button" type="submit">Add Timeslot</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
      <div className='view-timeslots'>
        <div className="timeslot-container">

          {timeslotData.length > 0 ? (
            <div className="timeslot-grid">
              {timeslotData.map((timeslot) => (
                <div key={timeslot.mt_slot_id} className="timeslot-card">
                  <button className="delete-btn2" onClick={() => Deletetime(timeslot.MT_SLOT_ID)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <div className="timeslot-time">
                    <p> <strong>Date:</strong> {new Date(timeslot.MT_SLOT_DATE).toLocaleDateString()}</p>
                    <p><strong>Time: </strong>
                      {new Date(`1970-01-01T${timeslot.MT_START_TIME}`).toLocaleTimeString('en-LK', {
                        timeZone: 'Asia/Colombo',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                      -
                      {new Date(`1970-01-01T${timeslot.MT_END_TIME}`).toLocaleTimeString('en-LK', {
                        timeZone: 'Asia/Colombo',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </p>

                    <p><strong>Doctor name:</strong>{timeslot.MT_DOCTOR}</p>
                  </div>
                  {/* <div className="timeslot-body1">
                    <p><strong>Doctor name:</strong>Dr. {timeslot.MT_DOCTOR}</p>
                  </div> */}

                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No available timeslots</p>
          )}
        </div>
      </div>
    </div>

  );
};

export default Addtimeslot;
