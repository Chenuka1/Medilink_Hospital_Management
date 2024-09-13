import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Invoice.css'; 
import logo from '../assets/logo.png';
import html2pdf from 'html2pdf.js';

export default function Invoice() {
    const { patientId, serial_no } = useParams();
    const [patients, setPatients] = useState(null);
    const [invoicedetails, setInvoicedetails] = useState(null);
    const [treatmentamount, setTreatmentamount] = useState(0);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(`https://localhost:7132/api/Treatment/patient/record/${patientId}/${serial_no}`);
                setInvoicedetails(response.data);
                setTreatmentamount(response.data.MTD_AMOUNT || 0);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7132/api/Patient/${patientId}`);
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchRecords();
        fetchPatientDetails();
    }, [patientId, serial_no]);

    const calculateSubtotal = () => {
        if (invoicedetails && invoicedetails.Drugs) {
            return invoicedetails.Drugs.reduce((total, drug) => total + drug.MDD_AMOUNT, 0).toFixed(2);
        }
        return 0;
    };

    const calculateTotalAmount = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const discountedAmount = subtotal - (subtotal * discount) / 100;
        return (discountedAmount + parseFloat(treatmentamount)).toFixed(2);
    };

    const printInvoice = () => {
        window.print();
    };

    const downloadInvoice = () => {
        const invoiceElement = document.querySelector('.invoice-container');
        
        // Add a class to hide the buttons and payment type
        invoiceElement.classList.add('hide-elements');
    
        const opt = {
            margin: 1,
            filename: `invoice_${patientId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        html2pdf()
            .from(invoiceElement)
            .set(opt)
            .save()
            .then(() => {
                // Remove the hide class after the PDF is saved
                invoiceElement.classList.remove('hide-elements');
            });
    };
    

    return (
        <div className="invoice-container">
            <div className="invoice-header">
                <div className="logo-section">
                    <img src={logo} alt="Medilink Logo" />
                </div>
                <h1 className="invoice-title">INVOICE</h1>
            </div>

            <div className="client-info">
                <p><strong>Client Name:</strong> {patients ? patients.MPD_PATIENT_NAME : 'N/A'}</p>
                <p><strong>Invoice Number:</strong> {invoicedetails ? invoicedetails.MTD_SERIAL_NO : 'N/A'}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>

            <div className="payment-method">
                <label>Payment Method:</label>
                <select>
                    <option>Select Payment Method</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                </select>
            </div>

            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Drug Name</th>
                        <th>Takes</th>
                        <th>Quantity</th>
                        <th>Price (Rs)</th>
                        <th>Amount (Rs)</th>
                    </tr>
                </thead>
                <tbody>
                    {invoicedetails && invoicedetails.Drugs && invoicedetails.Drugs.length > 0 ? (
                        invoicedetails.Drugs.map((drug, index) => (
                            <tr key={index}>
                                <td>{drug.DrugName}</td>
                                <td>{drug.MDD_TAKES}</td> 
                                <td>{drug.MDD_QUANTITY}</td>
                                <td>{drug.MDD_RATE.toFixed(2)}</td>
                                <td>{drug.MDD_AMOUNT.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No invoice details found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="total-section">
                <p><strong>Subtotal:</strong> Rs: {calculateSubtotal()}</p>
                <p><strong>Discount (%):</strong> 
                    <input 
                        type="number" 
                        value={discount} 
                        onChange={(e) => setDiscount(e.target.value)} 
                        min="0" max="100" 
                    />
                </p>
                <p><strong>Treatment Amount:</strong> Rs: {treatmentamount}</p>
                <p><strong>Total:</strong> Rs: {calculateTotalAmount()}</p>
            </div>

            <div className="btn-container1">
                <button className="btn print" onClick={printInvoice}>Print</button>
                <button className="btn download" onClick={downloadInvoice}>Download</button>
                <button className="btn send">Send</button>
            </div>
        </div>
    );
}
