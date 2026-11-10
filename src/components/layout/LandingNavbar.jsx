import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, X, CaretDown } from '@phosphor-icons/react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';

export default function LandingNavbar() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Produk', href: '#modul', hasCaret: true },
    { label: 'Cara Kerja', href: '#cara-kerja', hasCaret: false },
    { label: 'Tentang Kami', href: '#tentang-sistem', hasCaret: false },
    { label: 'Kategori', href: '#modul', hasCaret: false },
    { label: 'FAQ', href: '#faq', hasCaret: true }
  ];

  return (
    <header className="wl-navbar">
      <div className="wl-navbar-container">
        <div className="d-flex align-items-center gap-4 flex-nowrap">
          <a
            href="#beranda"
            className="text-decoration-none flex-shrink-0"
            aria-label="RAJASH Beranda"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BrandLogo size={32} showSubtitle={false} />
          </a>

          {/* Workleap Desktop Nav Links (e.g. Product v, How it works, Our Story, Pricing, Resources v) */}
          <nav className="wl-nav-links d-none d-xl-flex flex-nowrap" aria-label="Navigasi utama">
            {navItems.map((item) => (
              <a key={item.href + item.label} href={item.href} className="wl-nav-link text-nowrap">
                <span>{item.label}</span>
                {item.hasCaret && (
                  <CaretDown size={11} weight="bold" style={{ opacity: 0.7, marginLeft: '3px' }} />
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Workleap Right Cluster: Log in + Pelajari Fitur (bordered) + Mulai Sekarang (filled primary blue) */}
        <div className="d-flex align-items-center gap-3 flex-nowrap flex-shrink-0">
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="wl-nav-login-link text-nowrap d-none d-md-inline-flex"
          >
            Log in
          </Link>

          <a
            href="#cara-kerja"
            className="wl-button is-secondary is-nav-pill text-nowrap d-none d-sm-inline-flex"
          >
            Pelajari Fitur
          </a>

          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="wl-button is-nav-pill text-nowrap"
          >
            {isAuthenticated ? 'Dashboard' : 'Mulai Sekarang'}
          </Link>

          <button
            type="button"
            className="btn-rj-ghost p-2 d-xl-none"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none position-absolute start-0 end-0"
          style={{
            top: '100%',
            backgroundColor: 'var(--wl-true-white)',
            borderBottom: '1px solid var(--wl-grey-20)',
            boxShadow: '0 16px 32px rgba(12, 23, 84, 0.12)',
            padding: '1.25rem 1.5rem'
          }}
        >
          <div className="d-flex flex-column gap-1">
            {navItems.map((item) => (
              <a
                key={item.href + item.label}
                href={item.href}
                className="wl-nav-link py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.label}</span>
              </a>
            ))}
            <div className="pt-2 mt-2 d-flex flex-column gap-2" style={{ borderTop: '1px solid var(--wl-grey-20)' }}>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="wl-nav-login-link text-center py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="wl-button w-100 is-nav-pill"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated ? 'Masuk ke Dashboard' : 'Mulai Sekarang'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
