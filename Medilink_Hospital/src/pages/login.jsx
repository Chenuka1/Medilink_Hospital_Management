
// import '../styles/login.css';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {image} from '../assets/image4.jpg'

// export default function Login() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({
//       ...form,
//       [name]: value
//     });
//   };

  

//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     try {
//       const response = await fetch('https://localhost:7132/api/Login/Login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(form),
//       });
  
//       if (!response.ok) {
//         const errorMessage = await response.text();
//         setErrorMessage(`Login failed: ${errorMessage}`);
//         return;
//       }
  
//       const data = await response.json();
//       console.log('Response Data:', data);
  
//       if (data && data.patient_id && data.full_name) {
//         localStorage.setItem('patient_id', data.patient_id);
//         localStorage.setItem('full_name', data.full_name);
//         localStorage.setItem('contact',data.contact);
  
//         navigate("/Appoinment");
//       } else if (data && data.doctor_id && data.doctor_name) {
//         localStorage.setItem('doctor_id', data.doctor_id);
//         localStorage.setItem('doctor_name', data.doctor_name);
  
//         navigate("/");
//       } else {
//         setErrorMessage('Login failed: Invalid response from server.');
//       }
//     } catch (error) {
//       console.error('Error signing in:', error);
//       setErrorMessage('Login failed: Unable to connect to the server.');
//     }
//   };
  

//   return (
//     <div className="login-container">
//       <div className="login-form">
//         <h1>Login</h1>
//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="text"
//               id="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           <div className="form-buttons">
//             <input type="submit" value="Login" className="btn btn-submit" />
//             <input type="reset" value="Reset" className="btn btn-reset" onClick={() => setForm({ email: "", password: "" })} />
//           </div>
//         </form>
//         <div className="additional-options">
//           <a href="/forgot-password">Forgot your password?</a>
//           <a href="/register">Create an account</a>
//         </div>
//       </div>
//     </div>
//   );
// }








import '../styles/login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('https://localhost:7132/api/Login/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(`Login failed: ${errorMessage}`);
        return;
      }
  
      const data = await response.json();
      console.log('Response Data:', data);
      localStorage.setItem('Token',data.Token);
      localStorage.setItem('Role',data.Role);

      navigate("/dashboard/")
  
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage('Login failed: Unable to connect to the server.');
    }


    
  };
  

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.us}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-buttons">
            <input type="submit" value="Login" className="btn-submit" />
            <input type="reset" value="Reset" className="btn-reset" onClick={() => setForm({ email: "", password: "" })} />
          </div>
        </form>
        <div className="additional-options">
          <a href="/forgot-password">Forgot your password?</a>
          <a href="/add-user">Create an account</a>
        </div>
      </div>
    </div>
  );
}




