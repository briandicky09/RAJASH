import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';

export default function LandingFooter() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="wl-footer">
      <div className="wl-padding-global">
        <div className="wl-container">
          <div className="wl-footer-top">
            {/* Column 1: Inverted Brand Logo + Workleap-style Action Box */}
            <div data-reveal="fade-up">
              <div className="mb-4">
                <BrandLogo size={40} showSubtitle={true} inverted={true} />
              </div>

              <div
                className="p-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '20px',
                  maxWidth: '420px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--wl-display-font)',
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    color: 'var(--wl-soft-20)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Mulai Catat Keuangan Usaha
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(249, 248, 246, 0.76)',
                    lineHeight: 1.55,
                    marginBottom: '1.15rem'
                  }}
                >
                  Aplikasi catatan pemasukan, pengeluaran harian, piutang pelanggan, dan rekap
                  keuangan untuk Depot Air Minum Isi Ulang RAJASH.
                </p>

                <div className="d-flex flex-wrap align-items-center gap-2">
                  <Link
                    to={isAuthenticated ? '/dashboard' : '/login'}
                    className="wl-button is-alternate is-small"
                  >
                    <span>{isAuthenticated ? 'Buka Dashboard' : 'Masuk ke Aplikasi'}</span>
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Column 2: Menu Utama */}
            <div data-reveal="fade-up" style={{ '--reveal-delay': '80ms' }}>
              <div className="wl-footer-heading">Menu Utama</div>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li>
                  <a href="#modul" className="wl-footer-link">Dashboard</a>
                </li>
                <li>
                  <a href="#fitur" className="wl-footer-link">Catat Pemasukan</a>
                </li>
                <li>
                  <a href="#fitur" className="wl-footer-link">Catat Pengeluaran</a>
                </li>
                <li>
                  <a href="#fitur" className="wl-footer-link">Daftar Piutang</a>
                </li>
                <li>
                  <a href="#modul" className="wl-footer-link">Rekap Keuangan</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Fitur Utama */}
            <div data-reveal="fade-up" style={{ '--reveal-delay': '160ms' }}>
              <div className="wl-footer-heading">Fitur Utama</div>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li>
                  <a href="#cara-kerja" className="wl-footer-link">Penjualan Tunai &amp; Kredit</a>
                </li>
                <li>
                  <a href="#fitur" className="wl-footer-link">Status Lunas &amp; Belum Lunas</a>
                </li>
                <li>
                  <a href="#fitur" className="wl-footer-link">Hitung Keuntungan Bersih</a>
                </li>
                <li>
                  <a href="#fitur" className="wl-footer-link">Peringatan Catatan Ganda</a>
                </li>
                <li>
                  <a href="#fitur" className="wl-footer-link">Pengingat Tagihan Piutang</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Info Usaha */}
            <div data-reveal="fade-up" style={{ '--reveal-delay': '240ms' }}>
              <div className="wl-footer-heading">Info Usaha</div>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li className="wl-footer-link">Depot Air Minum Isi Ulang RAJASH</li>
                <li className="wl-footer-link">Berdiri Sejak 2016</li>
                <li className="wl-footer-link">Ulee Kareng, Banda Aceh</li>
                <li className="wl-footer-link">Pemilik: Dedy Darmansyah</li>
                <li>
                  <a href="#faq" className="wl-footer-link">Tanya Jawab (FAQ)</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar (.footer_bottom-wrapper) */}
          <div className="wl-footer-bottom" data-reveal="fade-in" style={{ '--reveal-delay': '180ms' }}>
            <div>
              &copy; 2026 RAJASH · Aplikasi Catatan Keuangan &amp; Piutang Depot Air Minum.
            </div>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <span className="d-inline-flex align-items-center gap-1">
                <ShieldCheck size={16} />
                <span>Tim Capstone A26-CS148 (Asah 2026)</span>
              </span>
              <span style={{ opacity: 0.35 }}>|</span>
              <span className="d-inline-flex align-items-center gap-1">
                <Globe size={16} />
                <span>Bahasa Indonesia</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
