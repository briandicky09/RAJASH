import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeSlash,
  SignIn,
  ArrowLeft,
  WarningCircle,
  Key
} from '@phosphor-icons/react';
import BrandLogo from '../components/layout/BrandLogo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    const dest = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={dest} replace />;
  }

  const validateForm = () => {
    const errors = {};
    if (!identifier.trim()) {
      errors.identifier = 'Masukkan username atau email pemilik usaha.';
    }
    if (!password) {
      errors.password = 'Masukkan kata sandi akun Anda.';
    } else if (password.length < 4) {
      errors.password = 'Kata sandi minimal terdiri dari 4 karakter.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login({ identifier, password });
      showToast({
        title: 'Berhasil Masuk',
        message: `Selamat datang kembali, ${result.user?.name || 'Dedy Darmansyah'}.`,
        type: 'success'
      });
      const dest = location.state?.from?.pathname || '/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      setGeneralError(err.message || 'Gagal melakukan autentikasi. Periksa kembali kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoAccount = () => {
    setIdentifier('owner.rajash');
    setPassword('rajash2026');
    setFieldErrors({});
    setGeneralError('');
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-between py-4 px-3"
      style={{ backgroundColor: 'var(--rj-bg)' }}
    >
      {/* Top Bar Kembali ke Beranda */}
      <div className="mx-auto w-100" style={{ maxWidth: '440px' }}>
        <Link
          to="/"
          className="btn-rj-ghost px-2 py-1 text-decoration-none d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Halaman Depan</span>
        </Link>
      </div>

      {/* Kartu Login Utama */}
      <main id="main-content" className="mx-auto w-100 my-auto py-4" style={{ maxWidth: '440px' }}>
        <div className="rj-card p-4 p-sm-5">
          <div className="mb-4">
            <div className="mb-3">
              <BrandLogo size={38} showSubtitle={true} />
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Masuk ke Sistem Keuangan
            </h1>
            <p className="mb-0" style={{ fontSize: '0.875rem', color: 'var(--rj-text-secondary)' }}>
              Khusus pemilik usaha Depot Air Minum Isi Ulang RAJASH.
            </p>
          </div>

          {generalError && (
            <div
              className="p-3 mb-3 d-flex align-items-start gap-2"
              role="alert"
              style={{
                backgroundColor: 'var(--rj-status-danger-bg)',
                border: '1px solid var(--rj-status-danger-border)',
                color: 'var(--rj-status-danger-text)',
                borderRadius: '8px',
                fontSize: '0.825rem'
              }}
            >
              <WarningCircle size={18} weight="fill" className="flex-shrink-0 mt-1" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="login-identifier" className="rj-form-label">
                Username atau Email <span style={{ color: 'var(--rj-primary)' }}>*</span>
              </label>
              <input
                id="login-identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) {
                    setFieldErrors((prev) => ({ ...prev, identifier: '' }));
                  }
                }}
                placeholder="Contoh: owner.rajash"
                disabled={isLoading}
                className={`rj-form-control ${fieldErrors.identifier ? 'is-invalid' : ''}`}
                aria-invalid={Boolean(fieldErrors.identifier)}
              />
              {fieldErrors.identifier && (
                <div className="rj-form-error" role="alert">
                  <WarningCircle size={14} weight="fill" />
                  <span>{fieldErrors.identifier}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="login-password" className="rj-form-label">
                Password <span style={{ color: 'var(--rj-primary)' }}>*</span>
              </label>
              <div className="position-relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  placeholder="Masukkan password akun"
                  disabled={isLoading}
                  className={`rj-form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                  style={{ paddingRight: '42px' }}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="btn-rj-ghost p-1"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="rj-form-error" role="alert">
                  <WarningCircle size={14} weight="fill" />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-rj-primary w-100 py-2"
              style={{ fontSize: '0.925rem' }}
            >
              <SignIn size={18} />
              <span>{isLoading ? 'Memverifikasi Kredensial...' : 'Masuk ke Dashboard'}</span>
            </button>
          </form>

          {/* Kotak Bantuan Pengujian Mode Simulasi Demo */}
          <div
            className="mt-4 pt-3"
            style={{ borderTop: '1px solid var(--rj-border)' }}
          >
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div style={{ fontSize: '0.775rem', color: 'var(--rj-text-secondary)' }}>
                <div>
                  <strong className="text-dark">Akun Pengujian Owner (Mode Demo):</strong>
                </div>
                <div className="font-tabular">
                  User: <code>owner.rajash</code> | Sandi: <code>rajash2026</code>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFillDemoAccount}
                disabled={isLoading}
                className="btn-rj-secondary py-1 px-2"
                style={{ fontSize: '0.76rem' }}
              >
                <Key size={14} />
                <span>Isi Kredensial Demo</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <div
        className="text-center mx-auto"
        style={{ fontSize: '0.775rem', color: 'var(--rj-text-secondary)' }}
      >
        Sistem Pengelolaan Keuangan dan Piutang UMKM RAJASH
      </div>
    </div>
  );
}

