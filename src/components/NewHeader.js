import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const NewHeader = () => {
    const [isSearchVisible, setSearchVisible] = React.useState(false);

    const toggleSearch = () => {
      setSearchVisible(!isSearchVisible);
    };

    const LogoutButton = () => {
      const { logout } = useAuth();
      const navigate = useNavigate();
  
      const handleLogout = () => {
          logout();
          navigate('/login');
      };
  
      return (
          <button type="button" class="btn btn-danger btn-block btn-sm" onClick={handleLogout}><i class="fa fa-sign-out"></i> Logout</button>
      );
  };
  
  
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
          {/* Left navbar links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" data-widget="pushmenu" to="#" role="button">
                <i className="fas fa-bars"></i>
              </Link>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>

          {!isSearchVisible && (
            <div className="navbar-center mx-auto">
              <a className="navbar-brand">
                <img src="/logo.png" alt="Logo" style={{ maxHeight: '45px' }} />
              </a>
            </div>
          )}

          {/* Right navbar links */}
          <ul className="navbar-nav ml-auto">

            {/* Navbar Search */}
            <li className="nav-item">
              <Link className="nav-link" to="#" role="button" onClick={toggleSearch}>
                <i className="fas fa-search"></i>
              </Link>

              {/* The search box */}
              {isSearchVisible && (
              <div class="navbar-search-block navbar-search-open" style={{ display: 'flex' }}>
                <form className="form-inline">
                  <div className="input-group input-group-sm">
                    <input 
                      className="form-control form-control-navbar" 
                      type="search" 
                      placeholder="Search" 
                      aria-label="Search" 
                    />
                    <div className="input-group-append">
                      <button className="btn btn-navbar" type="submit">
                        <i className="fas fa-search"></i>
                      </button>
                      <button className="btn btn-navbar" type="button" onClick={toggleSearch}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              )}
            </li>
    
            {/* Notifications Dropdown Menu */}
            <li className="nav-item dropdown">
              <Link className="nav-link" data-toggle="dropdown" to="#">
                <i className="far fa-bell"></i>
                <span className="badge badge-warning navbar-badge">4</span>
              </Link>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span className="dropdown-item dropdown-header">4 Notifications</span>
                <div className="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-exclamation-circle"></i> New Ticket #4321
                  <span class="float-right text-muted text-sm">3 mins</span>
                </a>
                
                <div className="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-lightbulb"></i> Ticket #2314 Resolved
                  <span class="float-right text-muted text-sm">1h</span>
                </a>

                <div className="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-exclamation-circle"></i> New Ticket #2314
                  <span class="float-right text-muted text-sm">1h</span>
                </a>

                <div className="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-exclamation-circle"></i> New Ticket #3543
                  <span class="float-right text-muted text-sm">4h</span>
                </a>
                <Link to="#" className="dropdown-item dropdown-footer">See All Notifications</Link>
              </div>
            </li>
    
            {/* Fullscreen Button */}
            <li className="nav-item">
              <Link className="nav-link" data-widget="fullscreen" to="#" role="button">
                <i className="fas fa-expand-arrows-alt"></i>
              </Link>
            </li>
            
            <LogoutButton />
            

          </ul>
        </nav>
      );
    };


export default NewHeader;
