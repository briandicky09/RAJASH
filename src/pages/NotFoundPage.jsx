import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from '@phosphor-icons/react';

export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      className="min-vh-100 d-flex align-items-center justify-content-center p-4"
      style={{ backgroundColor: 'var(--rj-bg)' }}
    >
      <div className="rj-card p-4 p-sm-5 text-center" style={{ maxWidth: '440px', width: '100%' }}>
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--rj-primary-subtle)',
            color: 'var(--rj-primary)',
            border: '1px solid var(--rj-primary-border)'
          }}
        >
          <Compass size={26} weight="regular" />
        </div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Halaman Tidak Ditemukan
        </h1>
        <p className="mb-4" style={{ fontSize: '0.875rem', color: 'var(--rj-text-secondary)' }}>
          Tautan yang Anda tuju tidak tersedia di Sistem Pengelolaan Keuangan dan Piutang RAJASH.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/dashboard" className="btn-rj-primary">
            <ArrowLeft size={16} />
            <span>Kembali ke Dashboard</span>
          </Link>
          <Link to="/" className="btn-rj-secondary">
            Halaman Depan
          </Link>
        </div>
      </div>
    </main>
  );
}

