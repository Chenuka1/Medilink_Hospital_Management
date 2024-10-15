import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/addUser.css';

const Adduser = () => {
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const Name = localStorage.getItem("Name");
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7132/api/User');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const [formData, setFormData] = useState({
    MUD_USER_NAME: '',
    MUD_PASSWORD: '',
    MUD_USER_TYPE: 'Doc',
    MUD_STATUS: 'A',
    MUD_CREATED_DATE: new Date().toISOString(),
    MUD_UPDATE_DATE: new Date().toISOString(),
    MUD_USER_ID: '',
    MUD_UPDATED_BY: '',
    MUD_CREATED_BY: '',
    MUD_SPECIALIZATION: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post('https://localhost:7132/api/User', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('User registered successfully');
      window.location.reload();

      setFormData({
        MUD_USER_NAME: '',
        MUD_PASSWORD: '',
        MUD_USER_TYPE: 'Doc',
        MUD_STATUS: 'A',
        MUD_CREATED_DATE: new Date().toISOString(),
        MUD_UPDATE_DATE: new Date().toISOString(),
        MUD_USER_ID: '',
        MUD_UPDATED_BY: Name,
        MUD_CREATED_BY: '',
        MUD_SPECIALIZATION: ''
      });
      setError('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const Deleteuser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://localhost:7132/api/User/${id}`);
        alert("User deleted successfully");

        // Update the state to remove the deleted user
        setUsers((prevUsers) => prevUsers.filter(user => user.MUD_USER_ID !== id));
      } catch (error) {
        console.error("Error deleting user:", error.response?.data || error.message);
        alert("Failed to delete user.");
      }
    }
  }

  const mapUserCategory = (userType) => {
    switch (userType) {
      case 'Doc':
        return 'Doctor';
      case 'phuser':
        return 'Pharmacy User';
      case 'Admin':
        return 'Administrator';
      case 'staff':
        return 'Staff';
      default:
        return userType;
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.MUD_USER_NAME.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter key
      // You can handle search submission if necessary
    }
  };

  return (
    <div className='add-user-container'>
      <h2>Healthcare providers</h2>
      <div className="search-container1">
        <input
          type="text"
          placeholder="Search users by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
        {/* <button onClick={() => setPopup(true)} className="open-popup-btn">Add User</button> */}
        <button 
          className="clear-search-btn" 
          onClick={() => setSearchQuery('')}
          title="Clear Search"
        >
          Clear
        </button>

        <button onClick={() => setPopup(true)} className="open-popup-btn">Add User</button>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>User Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.MUD_USER_ID}>
              <td>{user.MUD_USER_ID}</td>
              <td>{user.MUD_USER_NAME}</td>
              <td>{mapUserCategory(user.MUD_USER_TYPE)}</td>
              <td><button className='btn-delete' onClick={() => Deleteuser(user.MUD_USER_ID)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {popup && (
        <div className="popup-container">
          <div className='popup-content4'>
            <button className="close-popup-btn" onClick={() => setPopup(false)}>X</button>
            <h1 className="register-header">Add a New User</h1>
            {error && <div className="error-message">{error}</div>}
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  name="MUD_USER_NAME"
                  value={formData.MUD_USER_NAME}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  name="MUD_PASSWORD"
                  value={formData.MUD_PASSWORD}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>User Type</label>
                <select
                  name="MUD_USER_TYPE"
                  value={formData.MUD_USER_TYPE}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Admin">Admin</option>
                  <option value="Doc">Doctor</option>
                  <option value="staff">Staff</option>
                  <option value="phuser">Pharmacy user</option>
                </select>
              </div>
              <div className="input-group">
                <label>Specialization</label>
                <input
                  type="text"
                  placeholder="Enter doctor qualification"
                  name="MUD_SPECIALIZATION"
                  value={formData.MUD_SPECIALIZATION}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="register-btn">Register</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adduser;
