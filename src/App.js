// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import ChecklistPage from './pages/ChecklistPage';
import TicketPage from './pages/TicketPage';
import ReportingPage from './pages/ReportingPage';
import SolutionsPage from './pages/SolutionsPage';
import LoginPage from './pages/LoginPage';

import Header from './components/NewHeader';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Content from './components/Content';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<LayoutWithSidebar />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Define a layout component that renders the header, sidebar, content, and footer
const LayoutWithSidebar = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="wrapper">
      <Header />
      <Sidebar />
      <Content>
        <Routes>
          <Route index element={<ChecklistPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="ticket" element={<TicketPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="reporting" element={<ReportingPage />} />
        </Routes>
      </Content>
      <Footer />
    </div>
  );
};

export default App;
