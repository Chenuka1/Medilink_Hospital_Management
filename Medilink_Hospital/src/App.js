import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login';
import Addtimeslot from './components/addTimeslot';
import Appoinment from './pages/appoinment';
import Home from './pages/Home'; 
import Doctordashboard from './components/doctorDashboard';
import Dailyappoinment from './components/dailyappoinment';
import Medicalhistory from './pages/medicalhistory';
import Viewtimeslot from './components/viewTimeslot';
import Registermedicine from './components/registerMedicine';
import Addrecord from './pages/addrecord';
import Addpatient from './components/addPatients';
import AllocateDrugs from './components/allocateDrugs';
import Adduser from './components/adduser';
import ViewRecord from './components/viewRecord';
import Invoice from './components/invoice';
import AvailableTimeslots from './components/availableTimeslot';
import Aboutus from "./pages/aboutus";
import Remarks from "./components/remarks";
import Pharmacy from "./components/pharmacy";
import Pharmacyinvoice from "./components/pharmacyinvoice";
import Userregistration from "./components/userRegistration";
import Pmedicalhistory from "./pages/patientmedicalhistory";
import Patientlogin from "./pages/patientlogin";
import LoginSelector from "./components/loginselector";
import AppoinmentHistory from "./pages/appoinmentHistory";
import PatientAppointment from "./components/patientappoinment";
import Profile from "./pages/profile";


const ProtectedRoute = ({ element: Element, roles, ...rest }) => {
  const token = localStorage.getItem("Token");
  const userRole = localStorage.getItem("Role");

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed, redirect to login
  if (!roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  // Render the component if both token and role are valid
  return <Element {...rest} />;
};


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LoginSelector />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/patient-login" element={<Patientlogin/>}/>
          <Route path="/available-time" element={<AvailableTimeslots/>}/>
          <Route path="/about-us" element={<Aboutus/>}/>
          <Route path="/register-user" element={<Userregistration/>}/>
          <Route path="/medical-history" element={<Pmedicalhistory/>}/>
          <Route path="/appoinment-history" element={<AppoinmentHistory/>}/>
          <Route path="/appoinment" element={<PatientAppointment/>}/>
          <Route path="/profile" element={<Profile/>}/>

          {/* Protected Doctor and Admin Dashboard Routes */}
          <Route path="/dashboard/*" element={<ProtectedRoute element={Doctordashboard} roles={['Doc', 'Admin']} />}>
            <Route path="" element={<ProtectedRoute element={Medicalhistory} roles={['Doc', 'Admin']} />} />
            <Route path="daily-appointments" element={<ProtectedRoute element={Dailyappoinment} roles={['Doc', 'Admin']} />} />
            <Route path="view-timeslots" element={<ProtectedRoute element={Viewtimeslot} roles={['Doc', 'Admin']} />} />
            <Route path="register-medicines" element={<ProtectedRoute element={Registermedicine} roles={['Doc', 'Admin']} />} />
            <Route path="addrecord/:patientId" element={<ProtectedRoute element={Addrecord} roles={['Doc', 'Admin']} />} />
            <Route path="add-patient" element={<ProtectedRoute element={Addpatient} roles={['Doc', 'Admin']} />} />
            <Route path="allocate-drugs/:patientId/:serialNumber" element={<ProtectedRoute element={AllocateDrugs} roles={['Doc', 'Admin']} />} />
            <Route path="view-record/:patientId/:serial_no" element={<ProtectedRoute element={ViewRecord} roles={['Doc', 'Admin']} />} />
            <Route path="add-timeslot" element={<ProtectedRoute element={Addtimeslot} roles={['Doc', 'Admin']} />} />
            <Route path="invoice/:patientId/:serial_no" element={<ProtectedRoute element={Invoice} roles={['Doc', 'Admin']} />} />
            <Route path="remark/:patientId/:serial_no" element={<ProtectedRoute element={Remarks} roles={['Doc','Admin']}/>}/>
            <Route path="pharmacy" element={<ProtectedRoute element={Pharmacy} roles={['Doc','Admin','Phuser']}/>}/>
            <Route path="Add-users" element={<ProtectedRoute element={Adduser} roles={['Doc','Phuser']}/>}/>
            <Route path="pharmacy-invoice/:patientId/:serial_no" element={<Pharmacyinvoice/>}/>
            <Route path="daily-appoinments" element={<ProtectedRoute element={Dailyappoinment} roles={['Doc']}/>}/>
            
            
            
          </Route>
        </Routes> 
      </BrowserRouter>
    </div>
  );                  
}

export default App;
