import React, { useState } from 'react';

// Dummy data for medicines
const medicines = [
  { id: 1, name: 'Aspirin' },
  { id: 2, name: 'Ibuprofen' },
  { id: 3, name: 'Paracetamol' },
  // Add more medicines here
];

const PrescriptionForm = () => {
  const [medicinesList, setMedicinesList] = useState([{ id: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  
  const handleAddMedicine = () => {
    setMedicinesList([...medicinesList, { id: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedicine = (index) => {
    const newList = medicinesList.filter((_, i) => i !== index);
    setMedicinesList(newList);
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedList = [...medicinesList];
    updatedList[index][name] = value;
    setMedicinesList(updatedList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Submitted Prescription:', medicinesList);
  };

  return (
    <form onSubmit={handleSubmit}>
      {medicinesList.map((medicine, index) => (
        <div key={index} className="medicine-row">
          <select
            name="id"
            value={medicine.id}
            onChange={(e) => handleChange(index, e)}
            required
          >
            <option value="" disabled>Select Medicine</option>
            {medicines.map((med) => (
              <option key={med.id} value={med.id}>{med.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="dosage"
            placeholder="Dosage"
            value={medicine.dosage}
            onChange={(e) => handleChange(index, e)}
            required
          />
          <input
            type="text"
            name="frequency"
            placeholder="Frequency (e.g., twice a day)"
            value={medicine.frequency}
            onChange={(e) => handleChange(index, e)}
            required
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 7 days)"
            value={medicine.duration}
            onChange={(e) => handleChange(index, e)}
            required
          />
          <textarea
            name="instructions"
            placeholder="Special Instructions"
            value={medicine.instructions}
            onChange={(e) => handleChange(index, e)}
          />
          <button type="button" onClick={() => handleRemoveMedicine(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAddMedicine}>Add Another Medicine</button>
      <button type="submit">Submit Prescription</button>
    </form>
  );
};

export default PrescriptionForm;
