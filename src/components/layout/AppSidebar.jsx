import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  SquaresFour,
  ArrowDownLeft,
  ArrowUpRight,
  Notebook,
  ChartBar,
  SignOut,
  X
} from '@phosphor-icons/react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: SquaresFour
  },
  {
    to: '/pemasukan',
    label: 'Pemasukan',
    icon: ArrowDownLeft
  },
  {
    to: '/pengeluaran',
    label: 'Pengeluaran',
    icon: ArrowUpRight
  },
  {
    to: '/piutang',
    label: 'Piutang',
    icon: Notebook
  },
  {
    to: '/rekapitulasi',
    label: 'Rekapitulasi',
    icon: ChartBar
  }
];

export default function AppSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
    showToast({
      title: 'Sesi Berakhir',
      message: 'Anda telah keluar dari sistem keuangan RAJASH.',
      type: 'info'
    });
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop Drawer untuk Tablet & Mobile */}
      {isOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 1025
          }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`rj-sidebar ${isOpen ? 'is-open' : ''}`}
        aria-label="Navigasi utama aplikasi"
      >
        {/* Bagian Atas: Logo & Identitas RAJASH */}
        <div
          className="d-flex align-items-center justify-content-between px-3"
          style={{
            height: 'var(--rj-header-height)',
            borderBottom: '1px solid var(--rj-border)'
          }}
        >
          <BrandLogo size={34} showSubtitle={true} />
          <button
            type="button"
            onClick={onClose}
            className="btn-rj-ghost p-1 d-lg-none"
            aria-label="Tutup menu navigasi"
          >
            <X size={18} />
          </button>
        </div>

        {/* Bagian Tengah: Menu Navigasi Utama */}
        <div className="p-3 flex-grow-1 overflow-auto">
          <div
            className="px-2 mb-2"
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--rj-text-secondary)'
            }}
          >
            Menu Utama
          </div>
          <nav className="d-flex flex-column gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={({ isActive }) => `rj-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} weight="regular" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Info Usaha Ringkas */}
          <div
            className="mt-4 p-3"
            style={{
              backgroundColor: 'var(--rj-bg)',
              border: '1px solid var(--rj-border)',
              borderRadius: '10px'
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--rj-text-primary)',
                marginBottom: '2px'
              }}
            >
              Depot Air Minum RAJASH
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--rj-text-secondary)' }}>
              Ulee Kareng, Banda Aceh
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Identitas Owner & Tombol Logout */}
        <div
          className="p-3"
          style={{
            borderTop: '1px solid var(--rj-border)',
            backgroundColor: 'var(--rj-white)'
          }}
        >
          <div className="mb-2 px-1">
            <div
              className="text-truncate"
              style={{
                fontSize: '0.825rem',
                fontWeight: 600,
                color: 'var(--rj-text-primary)'
              }}
            >
              {user?.name || 'Dedy Darmansyah'}
            </div>
            <div
              className="text-truncate"
              style={{
                fontSize: '0.73rem',
                color: 'var(--rj-text-secondary)'
              }}
            >
              {user?.role || 'Owner UMKM RAJASH'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-rj-secondary w-100 justify-content-start"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.75rem' }}
          >
            <SignOut size={17} />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  );
}

