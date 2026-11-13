import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeSlash,
  SignIn,
  ArrowLeft,
  WarningCircle,
  Key,
  Check
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
      setGeneralError(
        err.message || 'Gagal melakukan autentikasi. Periksa kembali kredensial Anda.'
      );
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
      className="min-vh-100 d-flex flex-column justify-content-between py-4"
      style={{
        backgroundColor: 'var(--wl-soft-20)'
      }}
    >
      {/* Top Bar */}
      <div className="wl-padding-global">
        <div className="wl-container d-flex flex-wrap align-items-center justify-content-between gap-2">
          <Link to="/" className="text-decoration-none">
            <BrandLogo size={34} showSubtitle={true} />
          </Link>
          <Link to="/" className="wl-button is-secondary is-small text-nowrap">
            <ArrowLeft size={15} weight="bold" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="wl-padding-global my-auto py-4">
        <div className="wl-container">
          <div className="wl-grid-2">
            {/* Left Column: Workleap Editorial Value Statement */}
            <div className="d-none d-lg-flex flex-column align-items-start" style={{ gap: '1.25rem' }}>
              <div className="wl-eyebrow">Akses Pemilik Usaha RAJASH</div>
              <h1 className="wl-heading-h1">
                Kelola catatan keuangan dan piutang,{' '}
                <span className="wl-serif-italic">dalam satu ruang kerja</span>
              </h1>
              <p className="wl-body-lead mb-0">
                Masuk ke dashboard untuk mencatat pemasukan penjualan galon, pengeluaran
                operasional depot, memantau piutang pelanggan, serta melihat laporan rekapitulasi
                harian dan bulanan.
              </p>

              <ul className="wl-checkmarks-list">
                <li>
                  <span className="wl-check-icon">
                    <Check size={13} weight="bold" />
                  </span>
                  <span>Pencatatan transaksi tunai (Lunas) &amp; kredit (Belum Lunas)</span>
                </li>
                <li>
                  <span className="wl-check-icon">
                    <Check size={13} weight="bold" />
                  </span>
                  <span>Pemantauan piutang pelanggan beserta pengingat di dalam aplikasi</span>
                </li>
                <li>
                  <span className="wl-check-icon">
                    <Check size={13} weight="bold" />
                  </span>
                  <span>Rekapitulasi keuangan harian, bulanan, dan perhitungan keuntungan bersih</span>
                </li>
              </ul>
            </div>

            {/* Right Column: Login Card */}
            <div>
              <div
                className="mx-auto p-3 p-sm-5"
                style={{
                  maxWidth: '480px',
                  backgroundColor: 'var(--wl-true-white)',
                  border: '1px solid var(--wl-grey-20)',
                  borderRadius: '24px',
                  boxShadow: '0 24px 48px -12px rgba(12, 23, 84, 0.09)'
                }}
              >
                <div className="mb-4">
                  <div className="wl-eyebrow mb-2">Autentikasi Sistem</div>
                  <h2
                    style={{
                      fontFamily: 'var(--wl-display-font)',
                      fontSize: '1.75rem',
                      fontWeight: 500,
                      letterSpacing: '-0.03em',
                      marginBottom: '0.35rem'
                    }}
                  >
                    Masuk ke <span className="wl-serif-italic">RAJASH</span>
                  </h2>
                  <p className="mb-0" style={{ fontSize: '0.9rem', color: 'var(--wl-grey-80)' }}>
                    Khusus pemilik usaha Depot Air Minum Isi Ulang RAJASH.
                  </p>
                </div>

                {generalError && (
                  <div
                    className="p-3 mb-3 d-flex align-items-start gap-2"
                    role="alert"
                    style={{
                      backgroundColor: 'var(--wl-danger-20)',
                      border: '1px solid var(--wl-danger-60)',
                      color: 'var(--wl-danger-120)',
                      borderRadius: '12px',
                      fontSize: '0.84rem'
                    }}
                  >
                    <WarningCircle size={18} weight="fill" className="flex-shrink-0 mt-1" />
                    <span>{generalError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="login-identifier" className="rj-form-label">
                      Username atau Email <span style={{ color: 'var(--wl-brand-100)' }}>*</span>
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
                      Kata Sandi <span style={{ color: 'var(--wl-brand-100)' }}>*</span>
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
                        placeholder="Masukkan kata sandi akun"
                        disabled={isLoading}
                        className={`rj-form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                        style={{ paddingRight: '42px' }}
                        aria-invalid={Boolean(fieldErrors.password)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="btn-rj-ghost p-1"
                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
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
                    className="wl-button w-100"
                  >
                    <SignIn size={18} weight="bold" />
                    <span>{isLoading ? 'Memverifikasi Kredensial...' : 'Masuk ke Dashboard'}</span>
                  </button>
                </form>

                {/* Demo Credentials Helper */}
                <div
                  className="mt-4 pt-3"
                  style={{ borderTop: '1px solid var(--wl-grey-20)' }}
                >
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                    <div style={{ fontSize: '0.78rem', color: 'var(--wl-grey-80)' }}>
                      <div>
                        <strong style={{ color: 'var(--wl-grey-100)' }}>
                          Akun Pengujian Owner (Mode Demo):
                        </strong>
                      </div>
                      <div className="font-tabular">
                        User: <code>owner.rajash</code> · Sandi: <code>rajash2026</code>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleFillDemoAccount}
                      disabled={isLoading}
                      className="wl-button is-secondary is-small"
                      style={{ padding: '0.45em 1.1em', fontSize: '0.78rem' }}
                    >
                      <Key size={14} />
                      <span>Isi Kredensial Demo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className="text-center mx-auto px-3"
        style={{ fontSize: '0.8rem', color: 'var(--wl-grey-60)' }}
      >
        &copy; 2026 RAJASH · Sistem Pengelolaan Keuangan dan Piutang UMKM (Ulee Kareng, Banda Aceh)
      </div>
    </div>
  );
}
