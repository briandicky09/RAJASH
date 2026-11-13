import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, X, CaretDown } from '@phosphor-icons/react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';

export default function LandingNavbar() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    const prevOverflow = document.body.style.overflow;
    if (window.innerWidth < 1200) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Fitur', href: '#fitur', hasCaret: true },
    { label: 'Cara Kerja', href: '#cara-kerja', hasCaret: false },
    { label: 'Manfaat', href: '#tentang-sistem', hasCaret: false },
    { label: 'Ringkasan', href: '#modul', hasCaret: false },
    { label: 'FAQ', href: '#faq', hasCaret: true }
  ];

  return (
    <header className="wl-navbar">
      <div className="wl-navbar-container">
        <div className="d-flex align-items-center gap-3 gap-xl-4 flex-nowrap" style={{ minWidth: 0 }}>
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

        {/* Workleap Right Cluster: Masuk + Pelajari Fitur (bordered) + Mulai Sekarang (filled primary blue) */}
        <div className="d-flex align-items-center gap-2 gap-sm-3 flex-nowrap flex-shrink-0">
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="wl-nav-login-link text-nowrap d-none d-md-inline-flex"
          >
            Masuk
          </Link>

          <a
            href="#cara-kerja"
            className="wl-button is-secondary is-nav-pill text-nowrap d-none d-sm-inline-flex"
          >
            Lihat Cara Kerja
          </a>

          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="wl-button is-nav-pill text-nowrap"
          >
            {isAuthenticated ? 'Buka Dashboard' : 'Mulai Sekarang'}
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

      {/* Mobile & Tablet Drawer (shown below xl: <1200px to match toggle button) */}
      {mobileMenuOpen && (
        <div
          className="d-xl-none position-absolute start-0 end-0"
          style={{
            top: '100%',
            maxHeight: 'calc(100dvh - 4.5rem)',
            overflowY: 'auto',
            zIndex: 1039,
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
              <a
                href="#cara-kerja"
                className="wl-button is-secondary w-100 is-nav-pill d-sm-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                Lihat Cara Kerja
              </a>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="wl-nav-login-link text-center py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk ke Akun
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="wl-button w-100 is-nav-pill"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated ? 'Buka Dashboard' : 'Mulai Sekarang'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
