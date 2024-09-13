import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login';
import Patientregister from './pages/Patientregister';
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

// Helper function to check for a valid JWT and role (Doc or Admin)
const ProtectedRoute = ({ element: Element, roles, ...rest }) => {
  const token = localStorage.getItem("Token");
  const userRole = localStorage.getItem("Role");

  if (!token || !roles.includes(userRole)) {
    return <Navigate to="/login" />;
  }
  
  return <Element />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Patientregister />} />
          <Route path="/Appoinment" element={<Appoinment />} />
          <Route path="/add-user" element={<Adduser/>}/>
          <Route path="/available-time" element={<AvailableTimeslots/>}/>

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
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
