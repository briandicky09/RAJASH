import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ArrowCounterClockwise, PlugsConnected } from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import Modal from '../common/Modal';
import { resetDemoStore } from '../../services/financeService';
import { getApiBaseUrl } from '../../services/apiClient';

const ROUTE_TITLES = {
  '/dashboard': 'Dashboard Keuangan',
  '/pemasukan': 'Pencatatan Pemasukan',
  '/pengeluaran': 'Pencatatan Pengeluaran',
  '/piutang': 'Pengelolaan Piutang Pelanggan',
  '/rekapitulasi': 'Rekapitulasi Keuangan'
};

export default function ProtectedShell() {
  const { isAuthenticated, user, backendInfo } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Close mobile drawer automatically on route transitions
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Allow Escape key to close the mobile sidebar and lock body scroll when open below lg
  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    if (window.innerWidth < 992) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [sidebarOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const pageTitle = ROUTE_TITLES[location.pathname] || 'Sistem Keuangan RAJASH';
  const isDemo = backendInfo?.isDemoFallback || user?.is_demo;

  const handleResetDemo = () => {
    resetDemoStore();
    setInfoModalOpen(false);
    showToast({
      title: 'Data Simulasi Direset',
      message: 'Seluruh transaksi simulasi telah dikembalikan ke kondisi awal.',
      type: 'info'
    });
    window.dispatchEvent(new CustomEvent('rajash:data-reset'));
  };

  return (
    <div className="rj-app-wrapper">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="rj-main-area">
        <AppHeader
          title={pageTitle}
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onOpenDataModeModal={() => setInfoModalOpen(true)}
        />

        <Outlet />
      </div>

      {/* Modal Informasi Status Integrasi API & Data Simulasi */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="Status Integrasi API & Lingkungan Data"
        subtitle="Koordinasi Frontend (React.js) & Backend (Laravel REST API)"
        footer={
          <>
            {isDemo && (
              <button
                type="button"
                onClick={handleResetDemo}
                className="btn-rj-secondary me-auto"
              >
                <ArrowCounterClockwise size={16} />
                <span>Reset Data Demo Awal</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setInfoModalOpen(false)}
              className="btn-rj-primary"
            >
              Mengerti
            </button>
          </>
        }
      >
        <div className="d-flex flex-column gap-3" style={{ fontSize: '0.85rem' }}>
          <div
            className="p-3"
            style={{
              backgroundColor: 'var(--rj-bg)',
              border: '1px solid var(--rj-border)',
              borderRadius: '8px'
            }}
          >
            <div className="d-flex align-items-center gap-2 fw-semibold mb-1 text-dark">
              <PlugsConnected size={17} style={{ color: 'var(--rj-primary)' }} />
              <span>
                Status Saat Ini:{' '}
                {isDemo
                  ? 'Mode Simulasi Data Demo (Backend Belum Berjalan)'
                  : 'Terhubung ke REST API Backend'}
              </span>
            </div>
            <p className="mb-0" style={{ color: 'var(--rj-text-secondary)' }}>
              Endpoint target dikonfigurasi pada{' '}
              <code className="font-tabular">{getApiBaseUrl()}</code>. Ketika server Laravel
              dijalankan oleh Reinald Oryza Apriancahya, aplikasi secara otomatis menggunakan
              data produksi dari REST API.
            </p>
          </div>

          <div>
            <div className="fw-semibold mb-1 text-dark">Catatan Penggunaan Data Demo:</div>
            <ul className="mb-0 ps-3" style={{ color: 'var(--rj-text-secondary)' }}>
              <li>
                Data transaksi yang tampil saat ini ditandai sebagai <strong>Data Demo</strong>{' '}
                untuk pengujian alur pencatatan pemasukan, pengeluaran, piutang, dan rekapitulasi.
              </li>
              <li>
                Setiap transaksi atau pembayaran piutang yang Anda tambahkan pada mode ini disimpan
                secara terpisah di peramban dan memperbarui seluruh kalkulasi secara langsung.
              </li>
              <li>
                Gunakan tombol <strong>Reset Data Demo Awal</strong> di bawah apabila Anda ingin
                mengembalikan data simulasi ke kondisi semula.
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}

