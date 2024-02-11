import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isConfMenuOpen, setConfMenuOpen] = useState(false);
  const [isAssetsMenuOpen, setAssetsMenuOpen] = useState(false);
  const [isActionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [isUsersMenuOpen, setUsersMenuOpen] = useState(false);
  const [isObjectsMenuOpen, setObjectsMenuOpen] = useState(false);
  const [isProceduresMenuOpen, setProceduresMenuOpen] = useState(false);

  const [assetsMenuHeight, setAssetsMenuHeight] = useState(0);
  const assetsMenuRef = useRef(null);

  const [confMenuHeight, setConfMenuHeight] = useState(0);
  const confMenuRef = useRef(null);

  const [usersMenuHeight, setUsersMenuHeight] = useState(0);
  const usersMenuRef = useRef(null);

  const [actionsMenuHeight, setActionsMenuHeight] = useState(0);
  const actionsMenuRef = useRef(null);

  // Function to toggle Pages sub-menu
  const toggleConfMenu = () => {
    setConfMenuOpen(!isConfMenuOpen);
    setAssetsMenuOpen(false);
    setActionsMenuOpen(false);
    setUsersMenuOpen(false);
    setObjectsMenuOpen(false);
    setProceduresMenuOpen(false);
  };
  const toggleAssetsMenu = () => {
    setAssetsMenuOpen(!isAssetsMenuOpen);
    setConfMenuOpen(false);
    setActionsMenuOpen(false);
    setUsersMenuOpen(false);
    setObjectsMenuOpen(false);
    setProceduresMenuOpen(false);
  };
  const toggleActionsMenu = () => {
    setActionsMenuOpen(!isActionsMenuOpen);
    setConfMenuOpen(false);
    setAssetsMenuOpen(false);
    setUsersMenuOpen(false);
    setObjectsMenuOpen(false);
    setProceduresMenuOpen(false);
  };
  const toggleUsersMenu = () => {
    setUsersMenuOpen(!isUsersMenuOpen);
    setConfMenuOpen(false);
    setAssetsMenuOpen(false);
    setActionsMenuOpen(false);
    setObjectsMenuOpen(false);
    setProceduresMenuOpen(false);
  };
  const toggleObjectsMenu = () => {
    setUsersMenuOpen(false);
    setConfMenuOpen(false);
    setAssetsMenuOpen(false);
    setActionsMenuOpen(false);
    setObjectsMenuOpen(!isObjectsMenuOpen);
    setProceduresMenuOpen(false);
  };
  const toggleProceduresMenu = () => {
    setUsersMenuOpen(false);
    setConfMenuOpen(false);
    setAssetsMenuOpen(false);
    setActionsMenuOpen(false);
    setObjectsMenuOpen(false);
    setProceduresMenuOpen(!isProceduresMenuOpen);
  };

  useEffect(() => {
    if (isAssetsMenuOpen && assetsMenuRef.current) {
      setAssetsMenuHeight(assetsMenuRef.current.scrollHeight);
    } else {
      setAssetsMenuHeight(0);
    }
  }, [isAssetsMenuOpen]);

  // Update height for Conf Menu
  useEffect(() => {
    if (isConfMenuOpen && confMenuRef.current) {
      setConfMenuHeight(confMenuRef.current.scrollHeight);
    } else {
      setConfMenuHeight(0);
    }
  }, [isConfMenuOpen]);

  useEffect(() => {
    if (isUsersMenuOpen && usersMenuRef.current) {
      setUsersMenuHeight(usersMenuRef.current.scrollHeight);
    } else {
      setUsersMenuHeight(0);
    }
  }, [isUsersMenuOpen]);

  // Update height for Conf Menu
  useEffect(() => {
    if (isActionsMenuOpen && actionsMenuRef.current) {
      setActionsMenuHeight(actionsMenuRef.current.scrollHeight);
    } else {
      setActionsMenuHeight(0);
    }
  }, [isActionsMenuOpen]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/" className="brand-link">
        <img
          src="s.jpeg"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8 }}
        />
        <span className="brand-text font-weight-light">Smart Log Book</span>
      </Link>

      {/* Sidebar */}
      <div className="sidebar">
        {/* SidebarSearch Form */}
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {/* Main menu items */}

            {/* Procedures List*/}

            <li className="nav-item">
              <Link
                to="procedureslist"
                className={`nav-link ${isProceduresMenuOpen ? "active" : ""}`}
                onClick={toggleProceduresMenu}
              >
                <i className="nav-icon fas fa-clipboard-list"></i>
                <p>Procedures List</p>
              </Link>
            </li>

            {/* Assets */}

            <li
              className={`nav-item ${
                isAssetsMenuOpen ? "menu-is-opening menu-open" : ""
              }`}
            >
              <a
                href="#"
                className={`nav-link ${isAssetsMenuOpen ? "active" : ""}`}
                onClick={toggleAssetsMenu}
              >
                <i className="nav-icon fas fa-train"></i>
                <p>
                  Assets
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul
                ref={assetsMenuRef}
                className="nav nav-treeview"
                style={{
                  height: `${assetsMenuHeight}px`,
                  overflow: "hidden",
                  transition: "height 0.3s ease, opacity 0.3s ease",
                  opacity: isAssetsMenuOpen ? 1 : 0,
                }}
              >
                {/* Sub-menu items */}
                <li className="nav-item">
                  <Link to="/assets/assetsmodels" className="nav-link">
                    <i className="nav-icon far fas fa-tram"></i>
                    <p>Assets Models</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/assets/assetsitems" className="nav-link">
                    <i className="nav-icon fas fa-subway"></i>
                    <p>Assets Items</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Objects*/}
            <li className="nav-item">
              <Link
                to="/objects"
                className={`nav-link ${isObjectsMenuOpen ? "active" : ""}`}
                onClick={toggleObjectsMenu}
              >
                <i className="nav-icon fas fa-puzzle-piece"></i>
                <p>Objects</p>
              </Link>
            </li>

            {/* Actions */}

            <li
              className={`nav-item ${
                isActionsMenuOpen ? "menu-is-opening menu-open" : ""
              }`}
            >
              <a
                href="#"
                className={`nav-link ${isActionsMenuOpen ? "active" : ""}`}
                onClick={toggleActionsMenu}
              >
                <i className="nav-icon fas fa-bolt"></i>
                <p>
                  Actions
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>

              <ul
                ref={actionsMenuRef}
                className="nav nav-treeview"
                style={{
                  height: `${actionsMenuHeight}px`,
                  overflow: "hidden",
                  transition: "height 0.3s ease, opacity 0.3s ease",
                  opacity: isActionsMenuOpen ? 1 : 0,
                }}
              >
                {/* Sub-menu items */}
                <li className="nav-item">
                  <Link to="/actions/actiontypes" className="nav-link">
                    <i className="nav-icon far fas fa-tasks"></i>
                    <p>Actions Types</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/actions/actionsreferences" className="nav-link">
                    <i className="nav-icon far fas fa-bookmark"></i>
                    <p>Actions References</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Configurations*/}
            <li
              className={`nav-item ${
                isConfMenuOpen ? "menu-is-opening menu-open" : ""
              }`}
            >
              <a
                href="#"
                className={`nav-link ${isConfMenuOpen ? "active" : ""}`}
                onClick={toggleConfMenu}
              >
                <i className="nav-icon fas fa-sliders-h"></i>
                <p>
                  Configurations
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>

              <ul
                ref={confMenuRef}
                className="nav nav-treeview"
                style={{
                  height: `${confMenuHeight}px`,
                  overflow: "hidden",
                  transition: "height 0.3s ease, opacity 0.3s ease",
                  opacity: isConfMenuOpen ? 1 : 0,
                }}
              >
                {/* Sub-menu items */}
                <li className="nav-item">
                  <Link
                    to="/configuration/procedurestypes"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Procedures Types</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/configuration/operationstypes"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Operations Types</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/configuration/responsestypes" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Responses Types</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/configuration/events" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Events</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/configuration/localizations" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Localizations</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/configuration/act" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Acts</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Users*/}
            <li
              className={`nav-item ${
                isUsersMenuOpen ? "menu-is-opening menu-open" : ""
              }`}
            >
              <a
                href="#"
                className={`nav-link ${isUsersMenuOpen ? "active" : ""}`}
                onClick={toggleUsersMenu}
              >
                <i className="nav-icon fas fa-users"></i>
                <p>
                  Users
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul
                ref={usersMenuRef}
                className="nav nav-treeview"
                style={{
                  height: `${usersMenuHeight}px`,
                  overflow: "hidden",
                  transition: "height 0.3s ease, opacity 0.3s ease",
                  opacity: isUsersMenuOpen ? 1 : 0,
                }}
              >
                {/* Sub-menu items */}
                <li className="nav-item">
                  <Link to="/users/permissions" className="nav-link">
                    <i className="nav-icon far fas fa-key nav-icon"></i>
                    <p>Permissions</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/users/roles" className="nav-link">
                    <i className="nav-icon far fas fa-user-circle"></i>
                    <p>Roles</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/users/userslist" className="nav-link">
                    <i className="nav-icon far fas fa-address-book nav-icon"></i>
                    <p>Users</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* old menues*/}

            <li className="nav-item">
              <Link to="/checklist" className="nav-link">
                <i className="nav-icon fas fa-tree"></i>
                <p>
                  Checklist{" "}
                  <span style={{ fontStyle: "italic", fontSize: "smaller" }}>
                    (Beta)
                  </span>
                </p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/ticket" className="nav-link">
                <i className="nav-icon fas fa-edit"></i>
                <p>
                  Ticket{" "}
                  <span style={{ fontStyle: "italic", fontSize: "smaller" }}>
                    (Beta)
                  </span>
                </p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/solutions" className="nav-link">
                <i className="nav-icon fas fa-table"></i>
                <p>
                  Solutions{" "}
                  <span style={{ fontStyle: "italic", fontSize: "smaller" }}>
                    (Beta)
                  </span>
                </p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reporting" className="nav-link">
                <i className="nav-icon fas fa-chart-pie"></i>
                <p>
                  Reporting{" "}
                  <span style={{ fontStyle: "italic", fontSize: "smaller" }}>
                    (Beta)
                  </span>
                </p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
