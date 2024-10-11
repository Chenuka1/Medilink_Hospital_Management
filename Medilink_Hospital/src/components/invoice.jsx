

import { useEffect, useState } from 'react';
import { useParams,useLocation } from 'react-router-dom';
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
    const location = useLocation();
    

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
        const totalBeforeDiscount = subtotal + parseFloat(treatmentamount);
        const discountedAmount = totalBeforeDiscount - (totalBeforeDiscount * discount) / 100;
        return discountedAmount.toFixed(2);
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
        <div>

            <div className="invoice-container">
                
                <header className="header2">
                <div className='logo-container'>
                    <img src={logo} alt="Medilink Logo" className="logo"/>
                </div>
                <p>85/1, Horana Road, Bandaragama.<br />
                Tel: 0771068887<br />
                Email: Medilink@gmail.com<br />
                Web: www.medilink.lk</p>
            </header>

                <h1>Payment receipt</h1>
                <h3>Medilink hospitals - Bandaragama</h3>

                <div className="client-info">
                    <p><strong>Patient Name:</strong> {patients ? patients.MPD_PATIENT_NAME : 'N/A'}</p>
                    <p><strong>Invoice Number:</strong> {invoicedetails ? invoicedetails.MTD_SERIAL_NO : 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>

                <div className='payment-info'>
                  <p><strong>Total drug fee:</strong> Rs: {calculateSubtotal()}<br /></p>
                   <p><strong>Treatment fee:</strong> Rs: {treatmentamount}</p>
                   <p><strong>Total amount </strong> Rs:{(parseFloat(calculateSubtotal()) + parseFloat(treatmentamount)).toFixed(2)}</p>
                    <p><strong>Discount (%):</strong> 
                   <input 
                    type="number" 
                     value={discount} 
                    onChange={(e) => setDiscount(e.target.value)} 
                    min="0" max="100" 
                  />
                </p> 
                    <p><strong>Final amount:</strong> Rs: {calculateTotalAmount()}</p>
                </div>

                

                <div className="btn-container1">
                    <button className="btn print" onClick={printInvoice}>Print</button>
                    <button className="btn download" onClick={downloadInvoice}>Download</button>
                    <button className="btn send">Send</button>
                </div>

                <p></p>
            </div>

           

        </div>
    );
}

