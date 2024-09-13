import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/registerMedicines.css'; 

export default function Registermedicine() {
    const [form, setForm] = useState({
        MMC_MATERIAL_CODE: "",
        MMC_DESCRIPTION: "",
        MMC_REORDER_LEVEL: "",
        MMC_MATERIAL_SPEC: "",
        MMC_UNIT: "",
        MMC_STATUS: "",
        MMC_CREATED_BY: "",
        MMC_UPDATED_BY: "",
        MMC_RATE:"",
    });

    const [popup, setPopup] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(""); 
    const [editMode, setEditMode] = useState(false); // Track whether updating or adding new medicine

    // Fetch available medicines
    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await axios.get(`https://localhost:7132/api/Material`);
                setMedicines(response.data);
            } catch (error) {
                console.error('Error fetching medicines:', error);
            }
        };

        fetchMedicines();
    }, []);

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    // Handle form submission (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...form,
            MMC_REORDER_LEVEL: parseFloat(form.MMC_REORDER_LEVEL) || 0
        };

        try {
            if (editMode) {
                // Update existing medicine
                await axios.patch(`https://localhost:7132/api/Material/${form.MMC_MATERIAL_CODE}`, data);
                console.log(data);
                alert("Medicine updated successfully");
            } else {
                // Add new medicine
                await axios.post('https://localhost:7132/api/Material', data);
                alert("Medicine submitted successfully");
            }
            handleReset();
            setPopup(false);
            setError(""); // Clear error on success
            refreshMedicines();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error); // Display backend error
            } else {
                setError("An unexpected error occurred. Please try again."); // Fallback error message
            }
            console.error("Error submitting the medicine:", error);
        }
    };

    // Fetch medicines again after add/update/delete
    const refreshMedicines = async () => {
        try {
            const response = await axios.get(`https://localhost:7132/api/Material`);
            setMedicines(response.data);
        } catch (error) {
            console.error("Error refreshing medicines:", error);
        }
    };

    // Handle delete medicine
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this medicine?")) {
            try {
                await axios.delete(`https://localhost:7132/api/Material/${id}`);
                alert("Medicine deleted successfully");
                refreshMedicines();
            } catch (error) {
                console.error("Error deleting medicine:", error);
            }
        }
    };

    
    const handleReset = () => {
        setForm({
            MMC_MATERIAL_CODE: "",
            MMC_DESCRIPTION: "",
            MMC_REORDER_LEVEL: "",
            MMC_MATERIAL_SPEC: "",
            MMC_UNIT: "",
            MMC_STATUS: "",
            MMC_CREATED_BY: "",
            MMC_UPDATED_BY: "",
            MMC_RATE:"",
        });
        setEditMode(false);
    };

    // Handle edit button click
    const handleEdit = (medicine) => {
        setForm(medicine);
        setEditMode(true);
        setPopup(true); // Show popup for editing
    };

    // Toggle popup
    const togglePopup = () => {
        setPopup(!popup);
        if (!popup) handleReset(); // Reset form when closing popup
    };

    // Filter medicines based on search term
    const filteredMedicines = medicines.filter(medicine =>
        medicine.MMC_DESCRIPTION.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="register-medicines-section">
            <h1>Drug Registration</h1>

            
            <div className="search-add-container">
                <input 
                    type="search" 
                    placeholder="Search medicines..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />


              <button onClick={togglePopup} className="add-medicine-btn">
                {editMode ? "Edit Medicine" : "Add New Medicine"}
            </button>

            </div>


            
            <h2>Available Drug Stock</h2>
            <table className="medicine-table">
                <thead>
                    <tr>
                        <th>Name of Drug</th>
                        <th>Unit</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th colSpan={2}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMedicines.length > 0 ? (
                        filteredMedicines.map((medicine) => (
                            <tr key={medicine.MMC_MATERIAL_CODE}>
                                <td>{medicine.MMC_DESCRIPTION}</td>
                                <td>{medicine.MMC_UNIT}</td>
                                <td>{medicine.MMC_REORDER_LEVEL}</td>
                                <td>{medicine.MMC_STATUS}</td>
                                <td>Rs {medicine.MMC_RATE}</td>
                                <td>
                                    <button onClick={() => handleEdit(medicine)}>Update</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(medicine.MMC_MATERIAL_CODE)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No medicines available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            
            {popup && (
                <div className="popup">
                    <div className="popup-content1">
                        <span className="close-btn" onClick={togglePopup}>X</span>
                        <h2>{editMode ? "Edit Medicine" : "Add New Medicine"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="MMC_DESCRIPTION">Name of the drug</label>
                                <input 
                                    type="text" 
                                    name="MMC_DESCRIPTION"
                                    value={form.MMC_DESCRIPTION}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="MMC_UNIT">Unit of medicines</label>
                                <input
                                    type="text"
                                    name="MMC_UNIT"
                                    value={form.MMC_UNIT}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="MMC_REORDER_LEVEL">Quantity</label>
                                <input
                                    type="number"
                                    name="MMC_REORDER_LEVEL"
                                    value={form.MMC_REORDER_LEVEL}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="MMC_STATUS">Status</label>
                                <input
                                    type="text"
                                    name="MMC_STATUS"
                                    value={form.MMC_STATUS}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="MMC_RATE">Rate</label>
                                <input

                                  type="number"
                                  name="MMC_RATE"
                                  value={form.MMC_RATE}  
                                  onChange={handleChange}          
                                
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                {editMode ? "Update Medicine" : "Register Medicine"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
