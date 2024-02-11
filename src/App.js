// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";

import ChecklistPage from "./pages/ChecklistPage";
import TicketPage from "./pages/TicketPage";
import ReportingPage from "./pages/ReportingPage";
import SolutionsPage from "./pages/SolutionsPage";
import LoginPage from "./pages/LoginPage";

import Assets from "./pages/Assets";
import AssetsModelsPage from "./pages/AssetsModelsPage";
import AssetsItemsPage from "./pages/AssetsItemsPage";
import ObjectsPage from "./pages/ObjectsPage";

import Actions from "./pages/Actions";
import ActionTypesPage from "./pages/ActionTypesPage";
import ActionsReferencesPage from "./pages/ActionsReferencesPage";

import ProceduresPage from "./pages/ProceduresPage";
import ProcedureDetailsPage from "./pages/ProcedureDetailsPage";

import Configuration from "./pages/Configuration";
import ProceduresTypesPage from "./pages/ProceduresTypesPage";
import OperationsTypesPage from "./pages/OperationsTypesPage";
import ActPage from "./pages/ActPage";
import ResponsesTypesPage from "./pages/ResponsesTypesPage";
import EventsPage from "./pages/EventsPage";
import LocalizationsPage from "./pages/LocalizationsPage";

import Users from "./pages/Users";
import PermissionsPage from "./pages/PermissionsPage";
import RolesPage from "./pages/RolesPage";
import UsersListPage from "./pages/UsersListPage";

import Header from "./components/NewHeader";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Content from "./components/Content";

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

          {/* New routes */}
          <Route path="assets/*" element={<Assets />}>
            <Route path="assetsmodels" element={<AssetsModelsPage />} />
            <Route path="assetsitems" element={<AssetsItemsPage />} />
          </Route>

          <Route path="objects" element={<ObjectsPage />} />
          <Route path="procedureslist" element={<ProceduresPage />} />
          <Route
            path="/proceduredetails/:procedure_Id"
            element={<ProcedureDetailsPage />}
          />

          <Route path="actions/*" element={<Actions />}>
            <Route path="actiontypes" element={<ActionTypesPage />} />
            <Route
              path="actionsreferences"
              element={<ActionsReferencesPage />}
            />
          </Route>

          <Route path="configuration/*" element={<Configuration />}>
            <Route path="procedurestypes" element={<ProceduresTypesPage />} />
            <Route path="operationstypes" element={<OperationsTypesPage />} />
            <Route path="responsestypes" element={<ResponsesTypesPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="localizations" element={<LocalizationsPage />} />
            <Route path="act" element={<ActPage />} />
          </Route>

          <Route path="users/*" element={<Users />}>
            <Route path="permissions" element={<PermissionsPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="userslist" element={<UsersListPage />} />
          </Route>
        </Routes>
      </Content>
      <Footer />
    </div>
  );
};

export default App;
