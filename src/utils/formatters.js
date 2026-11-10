/**
 * Utilitas pemformatan mata uang Rupiah, tanggal Indonesia, dan angka
 * Sesuai standar Bagian 13 Master Prompt (contoh: Rp25.000, Rp150.000, 10 November 2026)
 */

const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

const INDONESIAN_SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des'
];

/**
 * Format angka menjadi format Rupiah tanpa spasi setelah Rp (contoh: Rp25.000, Rp150.000)
 * @param {number|string} value
 * @returns {string}
 */
export function formatRupiah(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 'Rp0';
  const isNegative = num < 0;
  const absFormatted = Math.abs(Math.round(num))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${isNegative ? '-Rp' : 'Rp'}${absFormatted}`;
}

/**
 * Format angka ribuan dengan titik untuk input mata uang (contoh: 150.000)
 * @param {number|string} value
 * @returns {string}
 */
export function formatThousandDigits(value) {
  if (value === null || value === undefined || value === '') return '';
  const digitsOnly = String(value).replace(/\D/g, '');
  if (!digitsOnly) return '';
  return Number(digitsOnly)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parse string berformat ribuan menjadi angka murni
 * @param {string|number} formattedValue
 * @returns {number}
 */
export function parseRupiahInput(formattedValue) {
  if (typeof formattedValue === 'number') return formattedValue;
  const digits = String(formattedValue || '').replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

/**
 * Format tanggal YYYY-MM-DD menjadi "10 November 2026"
 * @param {string} dateStr
 * @param {Object} options
 * @param {boolean} [options.shortMonth=false]
 * @returns {string}
 */
export function formatTanggalIndonesia(dateStr, { shortMonth = false } = {}) {
  if (!dateStr) return '-';
  const clean = String(dateStr).slice(0, 10);
  const parts = clean.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (Number.isNaN(year) || Number.isNaN(monthIdx) || Number.isNaN(day)) {
    return dateStr;
  }

  const monthName = shortMonth
    ? INDONESIAN_SHORT_MONTHS[monthIdx]
    : INDONESIAN_MONTHS[monthIdx];

  return `${day} ${monthName || ''} ${year}`;
}

/**
 * Format YYYY-MM menjadi "November 2026"
 * @param {string} monthStr
 * @returns {string}
 */
export function formatBulanIndonesia(monthStr) {
  if (!monthStr) return '-';
  const [year, month] = String(monthStr).split('-');
  const idx = parseInt(month, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11) return monthStr;
  return `${INDONESIAN_MONTHS[idx]} ${year}`;
}

/**
 * Hitung selisih hari sejak tanggal transaksi terhadap tanggal referensi (default: 2026-11-10)
 * @param {string} dateStr
 * @param {string} [refDateStr='2026-11-10']
 * @returns {number}
 */
export function getDaysElapsed(dateStr, refDateStr = '2026-11-10') {
  if (!dateStr) return 0;
  const d1 = new Date(`${String(dateStr).slice(0, 10)}T00:00:00`);
  const d2 = new Date(`${String(refDateStr).slice(0, 10)}T00:00:00`);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

