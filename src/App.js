import React from 'react';
import './App.css';
import {
  Route,
  Routes,
} from 'react-router-dom';
import Connexion from './components/auth/Connexion/Connexion';
import Layout from './Layout';
import DemandeFormation from './components/formation/DemandeFormation/DemandeFormation';
import Accueil from "./components/Accueil/AccueilFormations";
import ModificationFormation from "./components/formation/ModificationFormation/ModificationFormation";
import Unauthorized from './components/defaults/Unauthorized';
import Missing from './components/defaults/Missing';
import VueDetailleeFormation from './components/formation/VueDetailleeFormation/VueDetailleeFormation'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './components/defaults/ProtectedRoute';
import FormulaireInscription from './components/auth/Inscription/FormulaireInscription';
import Admin from './components/auth/Inscription/Admin';
import decodeToken from './auth/decodeToken';

function App() {

  const jwt = localStorage.getItem('accessToken') || null;
  let role = null;

  const setRole = () => {

    if (jwt !== null) {
      const [isValid, decoded] = decodeToken(jwt);
      if (isValid) {
          role = decoded.role;
          console.log(role);
      }
    }
  }
  setRole();

  return (
    <Routes>
        <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="connexion" element={<Connexion />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute redirectPath='/connexion' isLogedIn={!!jwt} isAllowed={!!jwt} />}>
          <Route path="/" element={<Accueil />} />
        </Route>
        <Route
          path="demandeFormation"
          element={
            <ProtectedRoute redirectPath="/unauthorized" isLogedIn={!!jwt} isAllowed={['ROLE_ASSO'].includes(role)}>
              <DemandeFormation />
            </ProtectedRoute>}
        />
        <Route
          path="admin"
          element={
          <ProtectedRoute redirectPath="/unauthorized" isLogedIn={!!jwt} isAllowed={['ROLE_BN'].includes(role)}>
            <Admin />
          </ProtectedRoute>}
        />
        <Route
          path="formation/:id"
          element={
          <ProtectedRoute redirectPath="/unauthorized" isLogedIn={!!jwt} isAllowed={['ROLE_BN','ROLE_ASSO'].includes(role)}>
            <VueDetailleeFormation />
          </ProtectedRoute>}
        />
        <Route
          path="formation/edit/:id"
          element={
          <ProtectedRoute redirectPath="/unauthorized" isLogedIn={!!jwt} isAllowed={['ROLE_BN','ROLE_ASSO'].includes(role)}>
            <ModificationFormation />
          </ProtectedRoute>}
        />

        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="inscription/:token" element={<FormulaireInscription/>} />

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
