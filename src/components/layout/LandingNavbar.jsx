import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, X, CaretDown } from '@phosphor-icons/react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';

export default function LandingNavbar() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Beranda', href: '#beranda', hasCaret: false },
    { label: 'Cara Kerja', href: '#cara-kerja', hasCaret: false },
    { label: 'Fitur Sistem', href: '#fitur', hasCaret: true },
    { label: 'Modul & Kategori', href: '#modul', hasCaret: true },
    { label: 'Tentang Sistem', href: '#tentang-sistem', hasCaret: false },
    { label: 'FAQ', href: '#faq', hasCaret: false }
  ];

  return (
    <header className="wl-navbar">
      <div className="wl-navbar-container">
        <div className="d-flex align-items-center gap-4">
          <a
            href="#beranda"
            className="text-decoration-none"
            aria-label="RAJASH Beranda"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BrandLogo size={36} showSubtitle={true} />
          </a>

          {/* Workleap Desktop Menu Links */}
          <nav className="wl-nav-links d-none d-lg-flex" aria-label="Navigasi utama">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="wl-nav-link">
                <span>{item.label}</span>
                {item.hasCaret && <CaretDown size={13} weight="bold" style={{ opacity: 0.6 }} />}
              </a>
            ))}
          </nav>
        </div>

        {/* Workleap Right Button Group (.navbar_menu-buttons) */}
        <div className="d-flex align-items-center gap-2">
          <a
            href="#modul"
            className="wl-button is-secondary is-small d-none d-sm-inline-flex"
          >
            Lihat Modul
          </a>

          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="wl-button is-small"
          >
            {isAuthenticated ? 'Buka Dashboard' : 'Masuk'}
          </Link>

          <button
            type="button"
            className="btn-rj-ghost p-2 d-lg-none"
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
                key={item.href}
                href={item.href}
                className="wl-nav-link py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.label}</span>
              </a>
            ))}
            <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--wl-grey-20)' }}>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="wl-button w-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated ? 'Buka Dashboard' : 'Masuk ke RAJASH'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
