import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>© 2023 Medilink Hospitals PLC. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
            <li><a href="/doctor-channelling">Doctor Channelling</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
