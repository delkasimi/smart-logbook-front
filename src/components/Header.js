// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../img/logo.png';
import ChecklistImage from '../img/checklist.png';
import TicketImage from '../img/ticket.png';
import ReportingImage from '../img/reporting.png';
import SolutionsImage from '../img/solutions.png';

const imageStyle = {
  width: '65px', // Set the desired width
  height: '68px', // Set the desired height
  margin:'5px'
};
const logoStyle = {
  width: '200px', // Set the desired width
  height: '70px', // Set the desired height
};

const Header = () => {
  return (
    <header>
      <div className="icons">
        <div className="icon-container">
          <Link to="/checklist">
            <img src={ChecklistImage} alt="Checklist" style={imageStyle}/>
            <div className="label">Checklist</div>
          </Link>
        </div>
        <div className="icon-container">
          <Link to="/ticket">
            <img src={TicketImage} alt="Ticket" style={imageStyle}/>
            <div className="label">Ticket</div>
          </Link>
        </div>
        <div className="icon-container">
          <Link to="/solutions">
            <img src={SolutionsImage} alt="Solutions" style={imageStyle}/>
            <div className="label">Solutions</div>
          </Link>
        </div>
        <div className="icon-container">
          <Link to="/reporting">
            <img src={ReportingImage} alt="Reporting" style={imageStyle}/>
            <div className="label">Reporting</div>
          </Link>
        </div>
      </div>
      <div className="title">Smart LogBook</div>
      <div className="logo">
        <img src={logoImage} alt="Logo" style={logoStyle}/>
      </div>
    </header>
  );
};

export default Header;
