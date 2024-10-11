// import React, { useState } from 'react';
// import '../styles/userRegistration.css';
// import axios from 'axios';
// import emailjs from 'emailjs-com';
// import {useNavigate} from 'react-router-dom'

// export default function UserRegistration() {
//   const [formData, setFormData] = useState({
//     MAU_EMAIL: '',
//     MAU_NIC: '',
//     MAU_CONTACT: '',
//     MAU_ADDRESS: '',
//     MAU_PASSWORD: '',
//   });

//   const navigate=useNavigate("");

//   const [otp, setOtp] = useState('');
//   const [enteredOtp, setEnteredOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const sendOtp = async () => {
//     const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
//     setOtp(generatedOtp);
//     console.log("Generated OTP:", generatedOtp);
  
//     try {
//       await emailjs.send(
//         'service_naq3m94', 
//         'template_5lc51z4',
//         {
//           to_name: 'User',
//           otp: generatedOtp,
//           email: formData.MAU_EMAIL,  // This sends the OTP to the user's email
//           message: ''
//         },
//         '5Z0ZQCQbi6vWIGWpC'
//       );
//       setOtpSent(true);
//       setErrorMessage('');
//     } catch (error) {
//       setErrorMessage('Failed to send OTP. Please try again.');
//       console.error("EmailJS Error:", error);
//     }
//   };
  

//   const verifyOtp = () => {
//     if (enteredOtp === otp) {
//       setOtpVerified(true);
//       setErrorMessage('');
//     } else {
//       setErrorMessage('Invalid OTP. Please try again.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!otpVerified) {
//       setErrorMessage('Please verify the OTP before registering.');
//       return;
//     }

//     try {
//       const response = await axios.post('https://localhost:7132/api/RegisterUser', formData);
//       setSuccessMessage('User registered successfully!');
//       setErrorMessage('');
//       navigate("/")
//     } catch (error) {
//       console.error(error);
//       setErrorMessage('Failed to register user. Please try again.');
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       MAU_EMAIL: '',
//       MAU_NIC: '',
//       MAU_CONTACT: '',
//       MAU_ADDRESS: '',
//       MAU_PASSWORD: '',
//     });
//     setErrorMessage('');
//     setSuccessMessage('');
//     setOtpSent(false);
//     setOtpVerified(false);
//     setEnteredOtp('');
//   };

//   return (
//     <div className="user-registration-container">
//       <div className="user-registration">
//         <form onSubmit={handleSubmit} className="registration-form">
//           <h1>Register Users</h1>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               name="MAU_EMAIL"
//               placeholder="Enter your email"
//               value={formData.MAU_EMAIL}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {!otpSent && (
//             <button type="button" onClick={sendOtp} className="btn-primary">
//               Send OTP
//             </button>
//           )}

//           {otpSent && !otpVerified && (
//             <div className="otp-verification">
//               <label>Enter OTP</label>
//               <input
//                 type="text"
//                 placeholder="Enter the OTP"
//                 value={enteredOtp}
//                 onChange={(e) => setEnteredOtp(e.target.value)}
//                 required
//               />
//               <button type="button" onClick={verifyOtp} className="btn-secondary">
//                 Verify OTP
//               </button>
//             </div>
//           )}

//           {otpVerified && (
//             <>
//               <div className="form-group">
//                 <label>NIC</label>
//                 <input
//                   type="text"
//                   name="MAU_NIC"
//                   placeholder="Enter your NIC"
//                   value={formData.MAU_NIC}
//                   onChange={handleChange}
//                   required
//                   maxLength="13"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Contact</label>
//                 <input
//                   type="text"
//                   name="MAU_CONTACT"
//                   placeholder="Enter your contact"
//                   value={formData.MAU_CONTACT}
//                   onChange={handleChange}
//                   required
//                   maxLength="13"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Address</label>
//                 <input
//                   type="text"
//                   name="MAU_ADDRESS"
//                   placeholder="Enter your address"
//                   value={formData.MAU_ADDRESS}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   name="MAU_PASSWORD"
//                   placeholder="Enter your password"
//                   value={formData.MAU_PASSWORD}
//                   onChange={handleChange}
//                   required
//                   minLength="6"
//                 />
//               </div>

//               <button type="submit" className="btn-primary">
//                 Register
//               </button>
//             </>
//           )}

//           <button type="button" onClick={handleCancel} className="btn-secondary">
//             Cancel
//           </button>

//           {errorMessage && <div className="error-message">{errorMessage}</div>}
//           {successMessage && <div className="success-message">{successMessage}</div>}
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import '../styles/userRegistration.css';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    MPD_EMAIL: '',
    MPD_NIC_NO: '',
    MPD_MOBILE_NO: '',
    MPD_ADDRESS: '',
    MPD_PASSWORD: '',
    MPD_PATIENT_NAME:'',

  });

  const navigate = useNavigate("");

  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    console.log("Generated OTP:", generatedOtp);

    try {
      await emailjs.send(
        'service_naq3m94', 
        'template_5lc51z4',
        {
          to_name: 'User',
          otp: generatedOtp,
          email: formData.MPD_EMAIL,  // This sends the OTP to the user's email
        },
        '5Z0ZQCQbi6vWIGWpC'
      );
      setOtpSent(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again.');
      console.error("EmailJS Error:", error);
    }
  };

  const verifyOtp = () => {
    if (enteredOtp === otp) {
      setOtpVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setErrorMessage('Please verify the OTP before registering.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7132/api/Patient', formData);
      setSuccessMessage('User registered successfully!');
      setErrorMessage('');
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Display server error message
      } else {
        setErrorMessage('Failed to register user. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      MPD_EMAIL: '',
      MPD_NIC: '',
      MPD_MOBILE_NO: '',  // Fixed this key
      MPD_ADDRESS: '',
      MPD_PASSWORD: '',
      MPD_PATIENT_NAME:'',
      MPD_NIC_NO:'',
    });
    setErrorMessage('');
    setSuccessMessage('');
    setOtpSent(false);
    setOtpVerified(false);
    setEnteredOtp('');
  };

  return (
    <div className="user-registration-container">
      <div className="user-registration">
        <form onSubmit={handleSubmit} className="registration-form">
          <h1>Register Users</h1>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="MPD_EMAIL"
              placeholder="Enter your email"
              value={formData.MPD_EMAIL}
              onChange={handleChange}
              required
            />
          </div>

          {!otpSent && (
            <button type="button" onClick={sendOtp} className="btn-primary">
              Send OTP
            </button>
          )}

          {otpSent && !otpVerified && (
            <div className="otp-verification">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="Enter the OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                required
              />
              <button type="button" onClick={verifyOtp} className="btn-secondary">
                Verify OTP
              </button>
            </div>
          )}

          {otpVerified && (
            <>
              <div className="form-group">
                <label>NIC</label>
                <input
                  type="text"
                  name="MPD_NIC"
                  placeholder="Enter your NIC"
                  value={formData.MPD_NIC}
                  onChange={handleChange}
                  required
                  
                />
              </div>

              <div className="form-group">
                <label>Your name</label>
                <input
                type="text"
                name="MPD_PATIENT_NAME"
                value={formData.MPD_PATIENT_NAME}
                onChange={handleChange}
                required/>
              </div>

              <div className="form-group">
                <label>Contact</label>
                <input
                  type="text"
                  name="MPD_MOBILE_NO"
                  placeholder="Enter your contact"
                  value={formData.MPD_MOBILE_NO}
                  onChange={handleChange}
                  required
                  maxLength="13"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="MPD_ADDRESS"
                  placeholder="Enter your address"
                  value={formData.MPD_ADDRESS}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="MPD_PASSWORD"  // Fixed the password name here
                  placeholder="Enter your password"
                  value={formData.MPD_PASSWORD}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn-primary">
                Register
              </button>
            </>
          )}

          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </form>
      </div>
    </div>
  );
}

