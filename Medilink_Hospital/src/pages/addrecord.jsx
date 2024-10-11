import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/addrecord.css'
import { useParams, useNavigate } from 'react-router-dom';

const Addrecord = () => {
  const { patientId } = useParams();
  const Name = localStorage.getItem("Name");
  const [medicines, setMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [prescriptions, setPrescriptions] = useState([
    {
      MDD_MATERIAL_CODE: '',
      MDD_MATERIAL_NAME: '',
      MDD_DOSAGE: '',
      MDD_TAKES: '',
      MDD_QUANTITY: '',
      MMC_RATE: 0,
    },
  ]);
  const [activePrescriptionIndex, setActivePrescriptionIndex] = useState(null);
  const [formData, setFormData] = useState({
    MTD_PATIENT_CODE: patientId,
    MTD_DATE: new Date().toISOString(),
    MTD_DOCTOR: Name || '',
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
    MTD_CREATED_BY: Name || '',
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
    const { name, value } = event.target;
    const values = [...prescriptions];
    values[index][name] = value;
    setPrescriptions(values);
  
    // Check if all the current prescription fields are filled
    const isCompleted = values[index].MDD_MATERIAL_NAME &&
      values[index].MDD_TAKES &&
      values[index].MDD_QUANTITY;
  
    // If all fields are completed and it's the last prescription, add a new one
    if (isCompleted && index === prescriptions.length - 1) {
      handleAddPrescription();
    }
  };
  

  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      {
        MDD_MATERIAL_CODE: '',
        MDD_MATERIAL_NAME: '',
        MDD_DOSAGE: '',
        MDD_TAKES: '',
        MDD_QUANTITY: '',
        MMC_RATE: 0,
      },
    ]);
  };

  const handleRemovePrescription = (index) => {
    const values = [...prescriptions];
    values.splice(index, 1);
    setPrescriptions(values);
  };

  const handleSearchChange = async (index, event) => {
    const query = event.target.value;
    const values = [...prescriptions];
    values[index].MDD_MATERIAL_NAME = query;
    setPrescriptions(values);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://localhost:7132/api/Material/search?query=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectMedicine = ( index, materialCode, materialName, rate ) => {
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
      const treatmentResponse = await axios.post(
        'https://localhost:7132/api/Treatment',
        formData
      );
      const serial_no = treatmentResponse.data.MTD_SERIAL_NO;

      if (
        prescriptions.length > 0 &&
        prescriptions.some(
          (prescription) =>
            prescription.MDD_MATERIAL_CODE 
        )
      ) {
        const drugDetailsPromises = prescriptions.map((prescription) => {
          if (prescription.MDD_MATERIAL_CODE) {
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
              MDD_AMOUNT:
                prescription.MMC_RATE *
                (prescription.MDD_QUANTITY || 0),
            });
          }
          return null;
        });

        await Promise.all(
          drugDetailsPromises.filter((promise) => promise !== null)
        );
      }

      navigate(`/dashboard/view-record/${patientId}/${serial_no}`);

      // Reset form after submission
      setFormData({
        MTD_PATIENT_CODE: patientId,
        MTD_DATE: new Date().toISOString(),
        MTD_DOCTOR: Name || '',
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
        MTD_CREATED_BY: Name || '',
        MTD_CREATED_DATE: new Date().toISOString(),
        MTD_UPDATED_BY: '',
        MTD_UPDATED_DATE: null,
      });
      setPrescriptions([
        {
          MDD_MATERIAL_CODE: '',
          MDD_MATERIAL_NAME: '',
          MDD_DOSAGE: '',
          MDD_TAKES: '',
          MDD_QUANTITY: '',
          MMC_RATE: 0,
        },
      ]);
    } catch (error) {
      console.error(
        'Error submitting record:',
        error.response?.data || error.message
      );
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
      <p className="subheading">
        Fill in the treatment and prescription information below.
      </p>

      <div className="patient-info">
        <p>
          <strong>Patient Code:</strong> {patientId}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-rowx">
          <div className="form-group-half-width1">
            <label htmlFor="MTD_COMPLAIN">Patient Complaint</label>
            <textarea
            
              id="MTD_COMPLAIN"
              value={formData.MTD_COMPLAIN}
              onChange={handleFormChange}
              placeholder="Enter patient complaint"
              required
            />
          </div>   
        </div>

       
        <div className="form-rowx">
          <div className="form-group-half-width1">
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

        <div className="form-groupx">
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
                required
              />
              <br></br>
              {activePrescriptionIndex === index &&
                searchResults.length > 0 && (
                  <ul className="search-suggestions">
                    {searchResults.map((medicine) => (
                      <li
                        key={medicine.MMC_MATERIAL_CODE}
                        onClick={() =>
                          handleSelectMedicine(
                            index,
                            medicine.MMC_MATERIAL_CODE,
                            medicine.MMC_DESCRIPTION,
                            medicine.MMC_RATE
                          )
                        }
                      >
                        {medicine.MMC_DESCRIPTION}
                      </li>
                    ))}
                  </ul>
                )}
              
              <select
                name="MDD_TAKES"
                value={prescription.MDD_TAKES}
                onChange={(event) => handlePrescriptionChange(index, event)}
                required
              >
                <option value="">How to Take</option>
                <option value="Daily">Daily</option>
                <option value="Twice a Day before food">Twice a Day before food</option>
                <option value="Three times per day before food">
                  Three times per day before food
                </option>
                <option value="Twice a day after food">Twice a day after food</option>
                <option value="Three times per day after food">Three times per day after food</option>
                <option value="As Needed">As Needed</option>
                
              </select>

              <input
                type="number"
                name="MDD_QUANTITY"
                value={prescription.MDD_QUANTITY}
                onChange={(event) => handlePrescriptionChange(index, event)}
                placeholder="Quantity"
                required
              />

              <button
                type="button"
                className="remove"
                onClick={() => handleRemovePrescription(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="Add-prescrib"
            onClick={handleAddPrescription}
          >
            Add Prescription
          </button>
          <br />
        </div>

        <div className="form-rowx">
          <div className="form-group-half-width1">
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

        <div className="form-rowx">

        <div className="form-group-half-width1">
          <label htmlFor="MTD_MEDICAL_STATUS">Medical Condition</label>
            <select
              id="MTD_MEDICAL_STATUS"
              value={formData.MTD_MEDICAL_STATUS}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Medical Condition</option>
              <option value="S">Stable</option>
              <option value="C">Critical</option>
            </select>
            
          </div>

          <div className="form-group-half-width1">
            <label htmlFor="MTD_TREATMENT_STATUS">Treatment Status</label>
            <select
              id="MTD_TREATMENT_STATUS"
              value={formData.MTD_TREATMENT_STATUS}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Treatment Status</option>
              <option value="C">Completed</option>
              <option value="N">Not Completed</option>
              <option value="P">Preparation completed</option>
            </select>
          </div>
          <div className="form-group-half-width1">
            <label htmlFor="MTD_AMOUNT">Treatment Amount</label>
            <input
              type="number"
              id="MTD_AMOUNT"
              name="MTD_AMOUNT"
              value={formData.MTD_AMOUNT}
              onChange={handleFormChange}
              placeholder="Enter treatment amount"
              required
            />
          </div>

          

        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
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
