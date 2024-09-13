import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/treatmentPlan.css';
import { useParams, useNavigate } from 'react-router-dom';

const Addrecord = () => {
  const { patientId } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [prescriptions, setPrescriptions] = useState([{ MDD_MATERIAL_CODE: '', MDD_MATERIAL_NAME: '', MDD_DOSAGE: '', MDD_TAKES: '', MDD_QUANTITY: '', duration: '' }]);
  const [activePrescriptionIndex, setActivePrescriptionIndex] = useState(null); 
  const [formData, setFormData] = useState({
    MTD_PATIENT_CODE: patientId,
    MTD_DATE: new Date().toISOString(),
    MTD_DOCTOR: '',
    MTD_TYPE: '',
    MTD_COMPLAIN: '',
    MTD_DIAGNOSTICS: '',
    MTD_REMARKS: '',
    MTD_AMOUNT: '',
    MTD_PAYMENT_STATUS: '',
    MTD_TREATMENT_STATUS: '',
    MTD_SMS_STATUS: '',
    MTD_SMS: '',
    MTD_MEDICAL_STATUS: '',
    MTD_STATUS: '',
    MTD_CREATED_BY: '',
    MTD_CREATED_DATE: new Date().toISOString(),
    MTD_UPDATED_BY: '',
    MTD_UPDATED_DATE: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handlePrescriptionChange = (index, event) => {
    const values = [...prescriptions];
    values[index][event.target.name] = event.target.value;
    setPrescriptions(values);
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, { MDD_MATERIAL_CODE: '', MDD_MATERIAL_NAME: '', MDD_DOSAGE: '', MDD_TAKES: '', MDD_QUANTITY: '', duration: '' }]);
  };

  const handleRemovePrescription = (index) => {
    const values = [...prescriptions];
    values.splice(index, 1);
    setPrescriptions(values);
  };

  const handleSearchChange = async (index, event) => {
    const query = event.target.value;
    if (query.length > 2) {
      try {
        const response = await axios.get(`https://localhost:7132/api/Material/search?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    } else {
      setSearchResults([]);
    }

    const values = [...prescriptions];
    values[index].MDD_MATERIAL_NAME = query;
    setPrescriptions(values);
  };

  const handleSelectMedicine = (index, materialCode, materialName, rate) => {
    const values = [...prescriptions];
    values[index].MDD_MATERIAL_CODE = materialCode;
    values[index].MDD_MATERIAL_NAME = materialName;
    values[index].MMC_RATE = rate;
    setSearchResults([]);
    setPrescriptions(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const treatmentResponse = await axios.post('https://localhost:7132/api/Treatment', formData);
      const serial_no = treatmentResponse.data.MTD_SERIAL_NO;

      if (prescriptions.length > 0 && prescriptions.some(prescription => prescription.MDD_MATERIAL_CODE && prescription.MDD_DOSAGE)) {
        const drugDetailsPromises = prescriptions.map((prescription) => {
          if (prescription.MDD_MATERIAL_CODE && prescription.MDD_DOSAGE) {
            return axios.post('https://localhost:7132/api/Drug', {
              MDD_MATERIAL_CODE: prescription.MDD_MATERIAL_CODE,
              MDD_DOSAGE: prescription.MDD_DOSAGE,
              MDD_TAKES: prescription.MDD_TAKES,
              MDD_CREATED_BY: formData.MTD_CREATED_BY,
              MDD_CREATED_DATE: new Date().toISOString(),
              MDD_UPDATED_BY: '',
              MDD_UPDATED_DATE: null,
              MDD_PATIENT_CODE: patientId,
              MDD_RATE: prescription.MMC_RATE || 0,
              MDD_STATUS: '',
              MDD_SERIAL_NO: serial_no,
              MDD_QUANTITY: prescription.MDD_QUANTITY || 0,
              MDD_AMOUNT: prescription.MMC_RATE * prescription.MDD_QUANTITY,
            });
          }
          return null;  
        });

        await Promise.all(drugDetailsPromises.filter(promise => promise !== null));
      }

      navigate(`/dashboard/invoice/${patientId}/${serial_no}`);

      
      setFormData({
        MTD_PATIENT_CODE: patientId,
        MTD_DATE: new Date().toISOString(),
        MTD_DOCTOR: '',
        MTD_TYPE: '',
        MTD_COMPLAIN: '',
        MTD_DIAGNOSTICS: '',
        MTD_REMARKS: '',
        MTD_AMOUNT: '',
        MTD_PAYMENT_STATUS: '',
        MTD_TREATMENT_STATUS: '',
        MTD_SMS_STATUS: '',
        MTD_SMS: '',
        MTD_MEDICAL_STATUS: '',
        MTD_STATUS: '',
        MTD_CREATED_BY: '',
        MTD_CREATED_DATE: new Date().toISOString(),
        MTD_UPDATED_BY: '',
        MTD_UPDATED_DATE: null,
      });
      setPrescriptions([{ MDD_MATERIAL_CODE: '', MDD_MATERIAL_NAME: '', MDD_DOSAGE: '', MDD_TAKES: '', MDD_QUANTITY: '', duration: '' }]);
    } catch (error) {
      console.error('Error submitting record:', error.response?.data || error.message);
      setModalContent('Error submitting treatment and prescription details.');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="treatment-form-container">
      <h2>Add Treatment Details</h2>
      <p className="subheading">Fill in the treatment and prescription information below.</p>

      <div className="patient-info">
        <p><strong>Patient Code:</strong> {patientId}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="MTD_DOCTOR">Doctor</label>
            <input
              type="text"
              id="MTD_DOCTOR"
              value={formData.MTD_DOCTOR}
              onChange={handleFormChange}
              placeholder="Enter doctor's name"
              required
            />
          </div>

          <div className="form-group half-width">
            <label htmlFor="MTD_COMPLAIN">Patient Complaint</label>
            <input
              type="text"
              id="MTD_COMPLAIN"
              value={formData.MTD_COMPLAIN}
              onChange={handleFormChange}
              placeholder="Enter patient complaint"
              required
            />
          </div>
        </div>

        <div className='form-row'>
           <div className='form-group half-width'>
              <label>Medical condition </label>
          <select 
          name="MTD_MEDICAL_STATUS"
          value={formData.MTD_MEDICAL_STATUS || ""} 
          onChange={handleFormChange}
          id="MTD_MEDICAL_STATUS"
         >

           <option> select medical condition of patient </option>         
           <option value="s">Stable</option>
           <option value="c">Critical</option>
            </select>
       </div>

          {/* <div className='form-group half-width'>
            <label htmlFor='treatment fee'>Enter treatment amount</label>
            <input type="text" 
            name="MTD_AMOUNT"
             id="MTD_AMOUNT"
             min="0"
            value={formData.MTD_AMOUNT}
            onChange={handleFormChange}
            
            />
            
          </div> */}
          
         </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="MTD_DIAGNOSTICS">Diagnosis</label>
            <textarea
              id="MTD_DIAGNOSTICS"
              value={formData.MTD_DIAGNOSTICS}
              onChange={handleFormChange}
              placeholder="Enter patient diagnosis details"
              required
            />
          </div>

          
        </div>

        <div className="form-group">
          <label>Prescriptions</label>
          {prescriptions.map((prescription, index) => (
            <div key={index} className="medicine-group">
              <input
                type="text"
                name="MDD_MATERIAL_NAME"
                placeholder="Search medicines"
                value={prescription.MDD_MATERIAL_NAME}
                onChange={(event) => handleSearchChange(index, event)}
                onFocus={() => setActivePrescriptionIndex(index)}
              />
              {activePrescriptionIndex === index && searchResults.length > 0 && (
                <ul className="search-suggestions">
                  {searchResults.map((medicine) => (
                    <li key={medicine.MMC_MATERIAL_CODE} onClick={() => handleSelectMedicine(index, medicine.MMC_MATERIAL_CODE, medicine.MMC_DESCRIPTION, medicine.MMC_RATE)}>
                      {medicine.MMC_DESCRIPTION}
                    </li>
                  ))}
                </ul>
              )}
              <input
                type="text"
                name="MDD_DOSAGE"
                value={prescription.MDD_DOSAGE}
                onChange={(event) => handlePrescriptionChange(index, event)}
                placeholder="Dosage"
              />
              <select
                name="MDD_TAKES"
                value={prescription.MDD_TAKES}
                onChange={(event) => handlePrescriptionChange(index, event)}
               
              >
                <option value="">How to Take</option>
                <option value="once">Daily</option>
                <option value="Twice">Twice a Day</option>
                <option value="Three times">Three times per day</option>
                <option value="Four times">As Needed</option>
              </select>

              <input
                type="number"
                name="MDD_QUANTITY"
                value={prescription.MDD_QUANTITY}
                onChange={(event) => handlePrescriptionChange(index, event)}
                placeholder="Quantity"
              />
              
              <button type="button"  className='remove' onClick={() => handleRemovePrescription(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className='Add-precrib' onClick={handleAddPrescription}>Add Prescription</button>
        </div>

             <div className="form-row">
                
                <div className="form-group half-width">

                <label htmlFor="MTD_REMARKS">Doctor's Remarks</label>
                  <textarea
                    id="MTD_REMARKS"
                    value={formData.MTD_REMARKS}
                    onChange={handleFormChange}
                    placeholder="Enter doctor remarks for the patient"
                    required                  
                  />
                </div>

             </div>

        

          







        

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>Alert</h2>
        <p>{modalContent}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Addrecord;
