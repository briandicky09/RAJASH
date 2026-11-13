import React from 'react';
import { List, CalendarBlank, UserCircle, Database } from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { formatTanggalIndonesia } from '../../utils/formatters';

export default function AppHeader({
  title,
  periodLabel = formatTanggalIndonesia('2026-11-10'),
  onOpenMobileMenu,
  actionButton,
  onOpenDataModeModal
}) {
  const { user, backendInfo } = useAuth();
  const isDemo = backendInfo?.isDemoFallback || user?.is_demo;

  return (
    <header className="rj-app-header">
      <div className="d-flex align-items-center gap-2 gap-md-3 flex-grow-1" style={{ minWidth: 0 }}>
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="btn-rj-secondary p-2 d-lg-none flex-shrink-0"
          aria-label="Buka menu navigasi"
        >
          <List size={19} />
        </button>

        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <h1
            className="mb-0 text-truncate"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', fontWeight: 700 }}
          >
            {title}
          </h1>
          <div
            className="d-none d-sm-flex align-items-center gap-1"
            style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}
          >
            <CalendarBlank size={13} />
            <span className="text-truncate">{periodLabel}</span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-1 gap-sm-2 flex-shrink-0">
        {/* Penanda Jelas Mode Data Simulasi vs API Live (Bagian 9 & 13 Master Prompt) */}
        <button
          type="button"
          onClick={onOpenDataModeModal}
          className="rj-badge rj-badge-info border-0"
          style={{ cursor: 'pointer', padding: '0.32rem 0.7rem' }}
          title="Klik untuk melihat status integrasi API dan pengaturan data simulasi"
        >
          <Database size={13} weight="fill" />
          <span className="d-none d-md-inline">
            {isDemo ? 'Mode Simulasi Data Demo' : 'Terhubung API Backend'}
          </span>
          <span className="d-md-none">{isDemo ? 'Data Demo' : 'API Aktif'}</span>
        </button>

        {actionButton}

        <div
          className="d-none d-md-flex align-items-center gap-2 ps-2 ms-1"
          style={{ borderLeft: '1px solid var(--rj-border)' }}
        >
          <UserCircle size={24} style={{ color: 'var(--rj-text-secondary)' }} weight="regular" />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--rj-text-primary)' }}>
              {user?.name || 'Dedy Darmansyah'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--rj-text-secondary)' }}>
              Owner RAJASH
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

