import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Invoice.css';
import logo from '../assets/logo.png';
import html2pdf from 'html2pdf.js';

export default function Pharmacyinvoice() {
  const { patientId, serial_no } = useParams();
  const location = useLocation();
  
  const { selectedMedicines, totaldrugfee } = location.state || { selectedMedicines: [], totaldrugfee: 0 };
  const [patients, setPatients] = useState(null);
  const [invoicedetails, setInvoicedetails] = useState(null);
  const [treatmentamount, setTreatmentamount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('percentage'); // Default to percentage
  
  const printInvoice = () => {
    window.print();
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7132/api/Patient/${patientId}`);
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    
    const fetchRecords = async () => {
        try {
            const response = await axios.get(`https://localhost:7132/api/Treatment/patient/record/${patientId}/${serial_no}`);
            setInvoicedetails(response.data);
            setTreatmentamount(response.data.MTD_AMOUNT || 0);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    fetchRecords();
    fetchPatientDetails();
  }, [patientId]);

  const totalAmount = treatmentamount + totaldrugfee;

  // Discount calculation based on the selected discount type (number or percentage)
  const calculateFinalAmount = () => {
    let discountAmount = 0;
    
    if (discountType === 'percentage') {
      discountAmount = totalAmount * (discount / 100);
    } else if (discountType === 'fixed') {
      discountAmount = discount;
    }

    return totalAmount - discountAmount;
  };

  const generatePDF = () => {
    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 1,
      filename: `invoice_${patientId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="invoice-container" id="invoice-content">
      <header className="header2">
        <div className='logo-container'>
          <img src={logo} alt="Medilink Logo" className="logo" />
        </div>
        <p>85/1, Horana Road, Bandaragama.<br />
          Tel: 0771068887<br />
          Email: Medilink@gmail.com<br />
          Web: www.medilink.lk</p>
      </header>
      
      <h1>Payment Receipt</h1>
      <h3>Medilink Hospitals - Bandaragama</h3>

      <div className="client-info">
        <p><strong>Patient Name:</strong> {patients ? patients.MPD_PATIENT_NAME : 'N/A'}</p>
        <p><strong>Invoice Number:</strong> {invoicedetails ? invoicedetails.MTD_SERIAL_NO : 'N/A'}</p>
        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
      </div>

      <div className="payment-info">
        <p><strong>Total Drug Fee:</strong> Rs. {totaldrugfee.toFixed(2)}</p>
        <p><strong>Treatment Fee:</strong> Rs. {treatmentamount.toFixed(2)}</p>
        <p><strong>Total Amount:</strong> Rs. {totalAmount.toFixed(2)}</p>

        <p>
          <strong>Discount:</strong>
          
          {/* Radio buttons for selecting discount type */}
          <label>
            <input 
              type="radio" 
              value="percentage" 
              checked={discountType === 'percentage'} 
              onChange={() => setDiscountType('percentage')} 
            /> Percentage
          </label>
          <label>
            <input 
              type="radio" 
              value="fixed" 
              checked={discountType === 'fixed'} 
              onChange={() => setDiscountType('fixed')} 
            /> Number (Fixed Amount)
          </label>

          <input 
            type="number" 
            value={discount} 
            onChange={(e) => setDiscount(e.target.value)} 
            min="0" 
            max={discountType === 'percentage' ? "100" : totalAmount} 
          />
        </p>
        


        <p><strong>Final Amount:</strong> Rs. {calculateFinalAmount().toFixed(2)}</p>
      </div>

      <div className="btn-container1">
        <button className="btn print" onClick={printInvoice}>Print</button>
        <button className="btn download" onClick={generatePDF}>Download</button>
        <button className="btn send">Send</button>
      </div>
    </div>
  );
}
