/**
 * REST API Client - Sistem Pengelolaan Keuangan & Piutang UMKM RAJASH
 * Menangani komunikasi HTTP JSON dengan Backend Laravel (Reinald Oryza Apriancahya),
 * lengkap dengan pengelolaan token Bearer, penanganan sesi berakhir (401),
 * dan ekstraksi pesan validasi Laravel (422 Unprocessable Entity).
 */

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const AUTH_TOKEN_KEY = 'rajash_auth_token';
const AUTH_USER_KEY = 'rajash_auth_user';
const DATA_MODE_KEY = 'rajash_data_mode'; // 'auto' | 'demo' | 'live'

export function getApiBaseUrl() {
  return DEFAULT_API_BASE_URL.replace(/\/+$/, '');
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuth(token, user) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getDataModePreference() {
  return localStorage.getItem(DATA_MODE_KEY) || 'auto';
}

export function setDataModePreference(mode) {
  localStorage.setItem(DATA_MODE_KEY, mode);
}

export class ApiError extends Error {
  constructor(message, status, validationErrors = null, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Eksekusi request HTTP ke REST API Laravel
 * @param {string} endpoint - contoh: '/incomes'
 * @param {RequestInit & { params?: Record<string, string|number|undefined> }} options
 */
export async function apiRequest(endpoint, options = {}) {
  const { params, headers = {}, body, ...restOptions } = options;

  const url = new URL(`${getApiBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const token = getStoredToken();
  const requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers: requestHeaders,
      body: body && typeof body === 'object' ? JSON.stringify(body) : body,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    let payload = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await response.json();
    }

    if (!response.ok) {
      if (response.status === 401) {
        clearStoredAuth();
        window.dispatchEvent(new CustomEvent('rajash:unauthorized'));
        throw new ApiError(
          payload?.message || 'Sesi Anda telah berakhir. Silakan masuk kembali.',
          401
        );
      }

      if (response.status === 422) {
        throw new ApiError(
          payload?.message || 'Data yang dimasukkan belum sesuai ketentuan validasi.',
          422,
          payload?.errors || null
        );
      }

      throw new ApiError(
        payload?.message || `Terjadi kesalahan pada server (Kode: ${response.status}).`,
        response.status
      );
    }

    return payload;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      'Tidak dapat terhubung ke server API backend.',
      0,
      null,
      true
    );
  }
}
