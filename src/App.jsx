import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedShell from './components/layout/ProtectedShell';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import ReceivablePage from './pages/ReceivablePage';
import RecapitulationPage from './pages/RecapitulationPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Halaman Publik */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Halaman Terproteksi (Owner RAJASH) */}
            <Route element={<ProtectedShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pemasukan" element={<IncomePage />} />
              <Route path="/pengeluaran" element={<ExpensePage />} />
              <Route path="/piutang" element={<ReceivablePage />} />
              <Route path="/rekapitulasi" element={<RecapitulationPage />} />
            </Route>

            {/* Halaman 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

