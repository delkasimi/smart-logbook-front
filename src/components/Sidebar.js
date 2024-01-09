import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/" className="brand-link">
        <img src="s.jpeg" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: .8 }} />
        <span className="brand-text font-weight-light">Smart Log Book</span>
      </Link>

      {/* Sidebar */}
      <div className="sidebar">
        
        
        {/* SidebarSearch Form */}
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/* Main menu items */}
            
            <li className="nav-item">
              <Link to="/checklist" className="nav-link">
                <i className="nav-icon fas fa-tree"></i>
                <p>Checklist</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/ticket" className="nav-link">
                <i className="nav-icon fas fa-edit"></i>
                <p>Ticket</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/solutions" className="nav-link">
                <i className="nav-icon fas fa-table"></i>
                <p>Solutions</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reporting" className="nav-link">
                <i className="nav-icon fas fa-chart-pie"></i>
                <p>Reporting</p>
              </Link>
            </li>
            {/* Add more main menu items as needed */}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
