import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-container">
    <ul className="social-list-container">
      <li className="social-list-item">
        <FaGoogle size={14} color="#ffffff" />
      </li>
      <li className="social-list-item">
        <FaTwitter size={14} color="#ffffff" />
      </li>
      <li className="social-list-item">
        <FaInstagram size={14} color="#ffffff" />
      </li>
      <li className="social-list-item">
        <FaYoutube size={14} color="#ffffff" />
      </li>
    </ul>
    <p className="footer-description">Contact us</p>
  </div>
)

export default Footer
