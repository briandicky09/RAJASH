/**
 * Finance & Receivable Service Layer - UMKM RAJASH
 * Mengintegrasikan REST API Backend Laravel dengan Fallback Terkontrol ke Data Simulasi Demo
 *
 * Pemenuhan Lengkap Dokumen SRS A26-CS148:
 * - FR-MST-03: Dua jenis air (Air Mineral & Air RO)
 * - FR-INC-01 & FR-INC-02: Kuantitas, harga satuan, dan kalkulasi total otomatis
 * - FR-MST-04 & FR-EXP: 6 kategori biaya operasional
 * - FR-RCV: Pengelolaan piutang pelanggan dan pelunasan
 * - FR-DUP: Pencegahan pencatatan ganda
 * - FR-REK & FR-DSH: Rekapitulasi, laba bersih basis kas & transaksi
 * - FR-AIE: Serving model prediksi & Generative AI
 */

import {
  apiRequest,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  clearStoredAuth,
  getDataModePreference
} from './apiClient';
import {
  DEMO_OWNER_ACCOUNT,
  INITIAL_DEMO_INCOMES,
  INITIAL_DEMO_EXPENSES,
  INITIAL_DEMO_RECEIVABLES,
  DEMO_AI_INSIGHT,
  WATER_TYPES
} from '../mocks/demoData';

const STORAGE_KEYS = {
  INCOMES: 'rajash_demo_incomes_v2',
  EXPENSES: 'rajash_demo_expenses_v2',
  RECEIVABLES: 'rajash_demo_receivables_v2'
};

let backendStatus = {
  connected: false,
  isDemoFallback: true,
  lastChecked: null
};

function notifyBackendStatus(connected) {
  backendStatus = {
    connected,
    isDemoFallback: !connected,
    lastChecked: new Date().toISOString()
  };
  window.dispatchEvent(new CustomEvent('rajash:backend-status', { detail: backendStatus }));
}

export function getBackendStatus() {
  return backendStatus;
}

/* ==========================================================================
   Penyimpanan Lokal untuk Mode Simulasi Demo
   ========================================================================== */
function loadDemoStore() {
  try {
    const rawIncomes = localStorage.getItem(STORAGE_KEYS.INCOMES);
    const rawExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const rawReceivables = localStorage.getItem(STORAGE_KEYS.RECEIVABLES);

    const incomes = rawIncomes ? JSON.parse(rawIncomes) : [...INITIAL_DEMO_INCOMES];
    const expenses = rawExpenses ? JSON.parse(rawExpenses) : [...INITIAL_DEMO_EXPENSES];
    const receivables = rawReceivables ? JSON.parse(rawReceivables) : [...INITIAL_DEMO_RECEIVABLES];

    if (!rawIncomes) localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
    if (!rawExpenses) localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    if (!rawReceivables) localStorage.setItem(STORAGE_KEYS.RECEIVABLES, JSON.stringify(receivables));

    return { incomes, expenses, receivables };
  } catch {
    return {
      incomes: [...INITIAL_DEMO_INCOMES],
      expenses: [...INITIAL_DEMO_EXPENSES],
      receivables: [...INITIAL_DEMO_RECEIVABLES]
    };
  }
}

function saveDemoStore({ incomes, expenses, receivables }) {
  if (incomes) localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
  if (expenses) localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  if (receivables) localStorage.setItem(STORAGE_KEYS.RECEIVABLES, JSON.stringify(receivables));
}

export function resetDemoStore() {
  localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(INITIAL_DEMO_INCOMES));
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_DEMO_EXPENSES));
  localStorage.setItem(STORAGE_KEYS.RECEIVABLES, JSON.stringify(INITIAL_DEMO_RECEIVABLES));
  return loadDemoStore();
}

  function delay(ms = 220) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* ==========================================================================
     Helper: Kalkulasi Finansial Sesuai SRS (BR-01 s.d. BR-05)
     ========================================================================== */
  export function calculateFinancialSummary(incomes, expenses, receivables, filterOptions = {}) {
    const { periodType = 'all', date = '', month = '' } = filterOptions;

    const matchDate = (itemDate) => {
      if (!itemDate) return false;
      const clean = String(itemDate).slice(0, 10);
      if (periodType === 'daily' && date) {
        return clean === date;
      }
      if (periodType === 'monthly' && month) {
        return clean.startsWith(month);
      }
      return true;
    };

    const filteredIncomes = incomes.filter((item) => matchDate(item.date));
    const filteredExpenses = expenses.filter((item) => matchDate(item.date));

    // Penjualan Tunai
    const cashSales = filteredIncomes
      .filter((i) => i.payment_method === 'Tunai')
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

    // Penjualan Kredit (Piutang)
    const creditSales = filteredIncomes
      .filter((i) => i.payment_method === 'Kredit')
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const totalSalesTransaction = cashSales + creditSales;

    // Pembayaran Piutang yang diterima pada periode terpilih (BR-02)
    let receivablePaymentsReceived = 0;
    receivables.forEach((rcv) => {
      (rcv.payments || []).forEach((pay) => {
        if (matchDate(pay.date)) {
          receivablePaymentsReceived += Number(pay.amount || 0);
        }
      });
    });

    // Uang Kas yang Benar-Benar Diterima (BR-02)
    const actualCashReceived = cashSales + receivablePaymentsReceived;

    // Total Pengeluaran
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    // Laba Bersih Kas (BR-04)
    const netCashProfit = actualCashReceived - totalExpenses;
    const netTransactionProfit = totalSalesTransaction - totalExpenses;

    // Piutang Aktif (BR-05)
    const activeReceivables = receivables.filter((r) => r.status === 'Belum Lunas' && r.remaining_amount > 0);
    const totalUnpaidReceivables = activeReceivables.reduce(
      (sum, r) => sum + Number(r.remaining_amount || 0),
      0
    );

    const periodReceivables = receivables.filter((r) => matchDate(r.transaction_date));
    const periodUnpaidReceivables = periodReceivables
      .filter((r) => r.status === 'Belum Lunas')
      .reduce((sum, r) => sum + Number(r.remaining_amount || 0), 0);

    // Rincian Penjualan per Jenis Air (FR-REK-02: Air Mineral vs Air RO)
    let mineralSales = 0;
    let roSales = 0;
    let mineralGalonCount = 0;
    let roGalonCount = 0;

    filteredIncomes.forEach((i) => {
      const isRO = (i.water_type || '').includes('RO');
      const amt = Number(i.amount || 0);
      const qty = Number(i.quantity || 0);
      if (isRO) {
        roSales += amt;
        roGalonCount += qty;
      } else {
        mineralSales += amt;
        mineralGalonCount += qty;
      }
    });

    return {
      cashSales,
      creditSales,
      totalSalesTransaction,
      receivablePaymentsReceived,
      actualCashReceived,
      totalExpenses,
      netCashProfit,
      netTransactionProfit,
      totalUnpaidReceivables,
      activeReceivablesCount: activeReceivables.length,
      periodUnpaidReceivables,
      incomeCount: filteredIncomes.length,
    expenseCount: filteredExpenses.length,
      waterBreakdown: {
        mineralSales,
        roSales,
        mineralGalonCount,
        roGalonCount
      }
    };
  }

  /* ==========================================================================
     1. AUTENTIKASI (FR-AUT-01 s.d. FR-AUT-06)
     ========================================================================== */
  export async function loginOwner({ identifier, password }) {
    const cleanId = String(identifier || '').trim();
    const cleanPass = String(password || '');

    if (!cleanId || !cleanPass) {
      throw new Error('Username/email dan password wajib diisi.');
    }

    const mode = getDataModePreference();

    if (mode !== 'demo') {
      try {
        const response = await apiRequest('/auth/login', {
          method: 'POST',
          body: {
            username: cleanId,
            email: cleanId,
            password: cleanPass
          }
        });
        notifyBackendStatus(true);
        const token = response?.data?.token || response?.token || 'live-session-token';
        const user = response?.data?.user || response?.user || {
          name: 'Dedy Darmansyah',
          username: cleanId,
          role: 'Owner UMKM RAJASH',
          is_demo: false
        };
        setStoredAuth(token, user);
        return { user, token, is_demo: false };
      } catch (err) {
        if (!err.isNetworkError && err.status === 401) {
          throw new Error('Kredensial tidak valid. Silakan periksa kembali akun Anda.');
        }
        if (mode === 'live') {
          throw err;
        }
        notifyBackendStatus(false);
      }
    }

    await delay(320);
    const validIds = ['owner.rajash', 'dedy@rajash-depot.id', 'admin', 'dedy'];
    const validPass = ['rajash2026', 'admin123'];

    if (!validIds.includes(cleanId.toLowerCase()) || !validPass.includes(cleanPass)) {
      throw new Error('Kredensial akun tidak cocok. Gunakan owner.rajash dan kata sandi rajash2026.');
    }

    const demoToken = `demo-token-${Date.now()}`;
    setStoredAuth(demoToken, DEMO_OWNER_ACCOUNT);
    return { user: DEMO_OWNER_ACCOUNT, token: demoToken, is_demo: true };
  }

  export async function logoutOwner() {
    const mode = getDataModePreference();
    if (mode !== 'demo' && backendStatus.connected) {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } catch {
        // Abaikan error saat logout
      }
    }
    clearStoredAuth();
  }

  export function getCurrentSession() {
    const token = getStoredToken();
    const user = getStoredUser();
    return {
      isAuthenticated: Boolean(token && user),
      token,
      user
    };
  }

  /* ==========================================================================
     2. DASHBOARD & MODUL AI (FR-DSH & FR-AIE)
     ========================================================================== */
  export async function fetchDashboardData({ periodType = 'monthly', month = '2026-11', date = '2026-11-10' } = {}) {
    const mode = getDataModePreference();
    if (mode !== 'demo') {
      try {
        const response = await apiRequest('/dashboard', {
          method: 'GET',
          params: { period_type: periodType, month, date }
        });
        notifyBackendStatus(true);
        return { ...response.data, is_demo: false };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(200);
    const { incomes, expenses, receivables } = loadDemoStore();
    const summary = calculateFinancialSummary(incomes, expenses, receivables, {
      periodType,
      month,
      date
    });

    // Metrik Hari Ini khusus untuk FR-DSH-01
    const todaySummary = calculateFinancialSummary(incomes, expenses, receivables, {
      periodType: 'daily',
      date
    });

    const combinedTransactions = [
      ...incomes.map((inc) => ({
        id: inc.id,
        date: inc.date,
        description: `${inc.customer_name ? `${inc.customer_name} - ` : ''}${inc.description || inc.water_type}`,
        type: 'Pemasukan',
        subType: inc.water_type || inc.payment_method,
        amount: inc.amount,
        status: inc.payment_method === 'Tunai' ? 'Tunai Diterima' : inc.status === 'Lunas' ? 'Kredit Lunas' : 'Piutang Kredit',
        created_at: inc.created_at || inc.date
      })),
      ...expenses.map((exp) => ({
        id: exp.id,
        date: exp.date,
        description: `${exp.category} - ${exp.description || 'Biaya operasional'}`,
        type: 'Pengeluaran',
        subType: exp.category,
        amount: exp.amount,
        status: 'Tercatat',
        created_at: exp.created_at || exp.date
      }))
    ].sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return String(b.created_at).localeCompare(String(a.created_at));
    });

    const chartSeries = buildChartSeries(incomes, expenses, receivables, { periodType, month, date });

    const activeReceivables = receivables
      .filter((r) => r.status === 'Belum Lunas' && r.remaining_amount > 0)
      .sort((a, b) => a.transaction_date.localeCompare(b.transaction_date));

    return {
      summary,
      todaySummary,
      recentTransactions: combinedTransactions.slice(0, 6),
      outstandingReceivables: activeReceivables.slice(0, 5),
      allActiveReceivables: activeReceivables,
      chartSeries,
      aiInsight: DEMO_AI_INSIGHT,
      is_demo: true
    };
  }

  function buildChartSeries(incomes, expenses, receivables, { periodType, month = '2026-11' }) {
    const dateSet = new Set();
    incomes.forEach((i) => {
      if (periodType === 'all' || String(i.date).startsWith(month)) dateSet.add(i.date);
    });
    expenses.forEach((e) => {
      if (periodType === 'all' || String(e.date).startsWith(month)) dateSet.add(e.date);
    });
    receivables.forEach((r) => {
      (r.payments || []).forEach((p) => {
        if (periodType === 'all' || String(p.date).startsWith(month)) dateSet.add(p.date);
      });
    });

    const sortedDates = Array.from(dateSet).sort((a, b) => a.localeCompare(b)).slice(-7);

    return sortedDates.map((d) => {
      const dayCashSales = incomes
        .filter((i) => i.date === d && i.payment_method === 'Tunai')
        .reduce((s, i) => s + Number(i.amount || 0), 0);
      const dayCreditSales = incomes
        .filter((i) => i.date === d && i.payment_method === 'Kredit')
        .reduce((s, i) => s + Number(i.amount || 0), 0);
      let dayReceivablePaid = 0;
      receivables.forEach((r) => {
        (r.payments || []).forEach((p) => {
          if (p.date === d) dayReceivablePaid += Number(p.amount || 0);
        });
      });
      const dayExpenses = expenses
        .filter((e) => e.date === d)
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      return {
        date: d,
        cashIn: dayCashSales + dayReceivablePaid,
        creditSales: dayCreditSales,
        totalSales: dayCashSales + dayCreditSales,
        expense: dayExpenses
      };
    });
  }

  /* ==========================================================================
     3. PEMASUKAN PENJUALAN (FR-INC-01 s.d. FR-INC-04 & FR-DUP)
     ========================================================================== */
  export async function fetchIncomes(filters = {}) {
    const { startDate = '', endDate = '', paymentMethod = 'ALL', search = '' } = filters;
    const mode = getDataModePreference();

    if (mode !== 'demo') {
      try {
        const response = await apiRequest('/incomes', {
          method: 'GET',
          params: {
            start_date: startDate,
            end_date: endDate,
            payment_method: paymentMethod !== 'ALL' ? paymentMethod : undefined,
            search: search.trim() || undefined
          }
        });
        notifyBackendStatus(true);
        return { items: response.data || [], is_demo: false };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(160);
    const { incomes, receivables } = loadDemoStore();

    const syncedIncomes = incomes.map((inc) => {
      if (inc.payment_method === 'Kredit' && inc.receivable_id) {
        const rcv = receivables.find((r) => r.id === inc.receivable_id);
        if (rcv) {
          return {
            ...inc,
            status: rcv.status === 'Lunas' ? 'Lunas' : 'Piutang',
            remaining_amount: rcv.remaining_amount
          };
        }
      }
      return inc;
    });

    const filtered = syncedIncomes
      .filter((item) => {
        if (startDate && item.date < startDate) return false;
        if (endDate && item.date > endDate) return false;
        if (paymentMethod !== 'ALL' && item.payment_method !== paymentMethod) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const matchCustomer = (item.customer_name || '').toLowerCase().includes(q);
          const matchDesc = (item.description || '').toLowerCase().includes(q);
          const matchWater = (item.water_type || '').toLowerCase().includes(q);
          const matchId = (item.id || '').toLowerCase().includes(q);
          if (!matchCustomer && !matchDesc && !matchWater && !matchId) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (b.date !== a.date) return b.date.localeCompare(a.date);
        return String(b.created_at).localeCompare(String(a.created_at));
      });

    return { items: filtered, allItems: syncedIncomes, is_demo: true };
  }

  export async function checkDuplicateIncome(payload) {
    const { date, amount, payment_method, customer_name, water_type } = payload;
    const mode = getDataModePreference();

    if (mode !== 'demo' && backendStatus.connected) {
      try {
        const res = await apiRequest('/incomes/check-duplicate', {
          method: 'POST',
          body: payload
        });
        return res.data || { isDuplicate: false, matches: [] };
      } catch {
        // Fallback ke pengecekan lokal
      }
    }

    const { incomes } = loadDemoStore();
    const numAmount = Number(amount);
    const cleanCust = String(customer_name || '').trim().toLowerCase();

    const matches = incomes.filter((item) => {
      const sameDate = item.date === date;
      const sameAmount = Number(item.amount) === numAmount;
      const sameMethod = item.payment_method === payment_method;
      if (!sameDate || !sameAmount) return false;

      const itemCust = String(item.customer_name || '').trim().toLowerCase();
      const similarCust = cleanCust && itemCust && (itemCust === cleanCust || itemCust.includes(cleanCust));
      const sameWater = item.water_type === water_type;

      return sameMethod || similarCust || sameWater;
    });

    return {
      isDuplicate: matches.length > 0,
      matches
    };
  }

  export async function createIncome(payload) {
    const {
      date,
      customer_name,
      water_type = 'Air Mineral',
      quantity = 1,
      unit_price = 6000,
      amount,
      payment_method,
      description
    } = payload;

    const numericQty = parseInt(quantity, 10) || 1;
    const numericUnitPrice = Number(unit_price) || 6000;
    // BR-01: Total = kuantitas * harga satuan
    const numericAmount = Number(amount) > 0 ? Number(amount) : numericQty * numericUnitPrice;

    if (!date) throw new Error('Tanggal transaksi wajib diisi.');
    if (numericQty <= 0) throw new Error('Kuantitas galon minimal 1.');
    if (numericAmount <= 0) throw new Error('Nominal transaksi harus lebih dari Rp0.');
    if (!['Tunai', 'Kredit'].includes(payment_method)) {
      throw new Error('Pilih jenis pembayaran Tunai atau Kredit.');
    }
    if (payment_method === 'Kredit' && !String(customer_name || '').trim()) {
      throw new Error('Nama pelanggan wajib diisi untuk penjualan tempo/kredit.');
    }

    const mode = getDataModePreference();
    if (mode !== 'demo') {
      try {
        const response = await apiRequest('/incomes', {
          method: 'POST',
          body: {
            date,
            customer_name: String(customer_name || '').trim() || 'Pelanggan Depot Langsung',
            water_type,
            quantity: numericQty,
            unit_price: numericUnitPrice,
            amount: numericAmount,
            payment_method,
            description: String(description || '').trim()
          }
        });
        notifyBackendStatus(true);
        return { data: response.data, is_demo: false };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(250);
    const { incomes, expenses, receivables } = loadDemoStore();
    const dateCompact = date.replace(/-/g, '');
    const seq = String(incomes.length + 1).padStart(2, '0');
    const incomeId = `INC-${dateCompact}-${seq}`;
    const receivableId = payment_method === 'Kredit' ? `RCV-${dateCompact}-${seq}` : null;

    const finalCustomerName = String(customer_name || '').trim() || 'Pelanggan Depot Langsung';
    const finalDescription = String(description || '').trim() || `${numericQty} galon ${water_type}`;

    const newIncome = {
      id: incomeId,
      date,
      customer_name: finalCustomerName,
      water_type,
      quantity: numericQty,
      unit_price: numericUnitPrice,
      amount: numericAmount,
      payment_method,
      status: payment_method === 'Tunai' ? 'Lunas' : 'Piutang',
      receivable_id: receivableId,
      description: finalDescription,
      created_at: new Date().toISOString(),
      is_demo: true
    };

    const updatedIncomes = [newIncome, ...incomes];
    let updatedReceivables = [...receivables];

    if (payment_method === 'Kredit') {
      const newReceivable = {
        id: receivableId,
        income_id: incomeId,
        customer_name: finalCustomerName,
        transaction_date: date,
        description: finalDescription,
        total_amount: numericAmount,
        paid_amount: 0,
        remaining_amount: numericAmount,
        status: 'Belum Lunas',
        payments: [],
        is_demo: true
      };
      updatedReceivables = [newReceivable, ...receivables];
    }

    saveDemoStore({
      incomes: updatedIncomes,
      expenses,
      receivables: updatedReceivables
    });

    return { data: newIncome, is_demo: true };
  }

  export async function deleteIncome(incomeId) {
    const mode = getDataModePreference();
    if (mode !== 'demo') {
      try {
        await apiRequest(`/incomes/${incomeId}`, { method: 'DELETE' });
        notifyBackendStatus(true);
        return { success: true };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(180);
    const { incomes, expenses, receivables } = loadDemoStore();
    const target = incomes.find((i) => i.id === incomeId);
    const updatedIncomes = incomes.filter((i) => i.id !== incomeId);

    // Jika transaksi kredit dibatalkan, batalkan juga piutangnya
    let updatedReceivables = [...receivables];
    if (target?.receivable_id) {
      updatedReceivables = receivables.filter((r) => r.id !== target.receivable_id);
    }

    saveDemoStore({ incomes: updatedIncomes, expenses, receivables: updatedReceivables });
    return { success: true };
  }

  /* ==========================================================================
     4. PENGELUARAN OPERASIONAL (FR-EXP)
     ========================================================================== */
  export async function fetchExpenses(filters = {}) {
    const { startDate = '', endDate = '', category = 'ALL', search = '' } = filters;
    const mode = getDataModePreference();

    if (mode !== 'demo') {
      try {
        const response = await apiRequest('/expenses', {
          method: 'GET',
          params: {
            start_date: startDate,
            end_date: endDate,
            category: category !== 'ALL' ? category : undefined,
            search: search.trim() || undefined
          }
        });
        notifyBackendStatus(true);
        return { items: response.data || [], is_demo: false };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(160);
    const { expenses } = loadDemoStore();

    const filtered = expenses
      .filter((item) => {
        if (startDate && item.date < startDate) return false;
        if (endDate && item.date > endDate) return false;
        if (category !== 'ALL' && item.category !== category) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const matchCat = (item.category || '').toLowerCase().includes(q);
          const matchDesc = (item.description || '').toLowerCase().includes(q);
          if (!matchCat && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (b.date !== a.date) return b.date.localeCompare(a.date);
        return String(b.created_at).localeCompare(String(a.created_at));
      });

    return { items: filtered, allItems: expenses, is_demo: true };
  }

  export async function checkDuplicateExpense(payload) {
    const { date, category, amount } = payload;
    const { expenses } = loadDemoStore();
    const numAmount = Number(amount);

    const matches = expenses.filter(
          (item) => item.date === date && item.category === category && Number(item.amount) === numAmount
  );

    return { isDuplicate: matches.length > 0, matches };
  }

  export async function createExpense(payload) {
    const { date, category, amount, description } = payload;
    const numericAmount = Number(amount);

    if (!date) throw new Error('Tanggal pengeluaran wajib diisi.');
    if (!category) throw new Error('Kategori biaya operasional wajib dipilih.');
    if (!numericAmount || numericAmount <= 0) {
      throw new Error('Nominal pengeluaran harus lebih besar dari Rp0.');
    }

    const mode = getDataModePreference();
    if (mode !== 'demo') {
      try {
        const response = await apiRequest('/expenses', {
          method: 'POST',
        body: { date, category, amount: numericAmount, description: String(description || '').trim() }
        });
        notifyBackendStatus(true);
        return { data: response.data, is_demo: false };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(220);
    const { incomes, expenses, receivables } = loadDemoStore();
    const dateCompact = date.replace(/-/g, '');
    const seq = String(expenses.length + 1).padStart(2, '0');

    const newExpense = {
      id: `EXP-${dateCompact}-${seq}`,
      date,
      category,
      amount: numericAmount,
      description: String(description || '').trim() || `Biaya ${category}`,
      created_at: new Date().toISOString(),
      is_demo: true
    };

    const updatedExpenses = [newExpense, ...expenses];
    saveDemoStore({ incomes, expenses: updatedExpenses, receivables });

    return { data: newExpense, is_demo: true };
  }

  export async function deleteExpense(expenseId) {
    const mode = getDataModePreference();
    if (mode !== 'demo') {
      try {
        await apiRequest(`/expenses/${expenseId}`, { method: 'DELETE' });
        notifyBackendStatus(true);
        return { success: true };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(180);
    const { incomes, expenses, receivables } = loadDemoStore();
    const updatedExpenses = expenses.filter((e) => e.id !== expenseId);
    saveDemoStore({ incomes, expenses: updatedExpenses, receivables });
    return { success: true };
  }

  /* ==========================================================================
     5. PIUTANG & PELUNASAN (FR-RCV)
     ========================================================================== */
  export async function fetchReceivables(filters = {}) {
    const { status = 'ALL', startDate = '', endDate = '', search = '' } = filters;
    const mode = getDataModePreference();

    if (mode !== 'demo') {
      try {
        const response = await apiRequest('/receivables', {
          method: 'GET',
          params: {
            status: status !== 'ALL' ? status : undefined,
            start_date: startDate,
            end_date: endDate,
            search: search.trim() || undefined
          }
        });
        notifyBackendStatus(true);
        return { items: response.data || [], is_demo: false };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(160);
    const { receivables } = loadDemoStore();

    const filtered = receivables
      .filter((item) => {
        if (status !== 'ALL' && item.status !== status) return false;
        if (startDate && item.transaction_date < startDate) return false;
        if (endDate && item.transaction_date > endDate) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const matchCust = (item.customer_name || '').toLowerCase().includes(q);
          const matchDesc = (item.description || '').toLowerCase().includes(q);
          if (!matchCust && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === 'Belum Lunas' ? -1 : 1;
        }
        return b.transaction_date.localeCompare(a.transaction_date);
      });

    return { items: filtered, allItems: receivables, is_demo: true };
  }

  export async function recordReceivablePayment(receivableId, { amount, paymentDate, note }) {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      throw new Error('Nominal pelunasan/pembayaran harus lebih dari Rp0.');
    }

    const mode = getDataModePreference();
    if (mode !== 'demo') {
      try {
        const response = await apiRequest(`/receivables/${receivableId}/payments`, {
          method: 'POST',
          body: {
            amount: numericAmount,
            payment_date: paymentDate,
            note: String(note || '').trim()
          }
        });
        notifyBackendStatus(true);
        return { data: response.data, is_demo: false };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(250);
    const { incomes, expenses, receivables } = loadDemoStore();
    const targetIndex = receivables.findIndex((r) => r.id === receivableId);

    if (targetIndex === -1) {
      throw new Error('Data piutang tidak ditemukan.');
    }

    const target = receivables[targetIndex];
    if (target.status === 'Lunas' || target.remaining_amount <= 0) {
      throw new Error('Piutang ini sudah berstatus Lunas.');
    }

    if (numericAmount > target.remaining_amount) {
      throw new Error(
          `Nominal pembayaran (${numericAmount.toLocaleString('id-ID')}) melebihi sisa tagihan (${target.remaining_amount.toLocaleString('id-ID')}).`
      );
    }

    const newPaidAmount = Number(target.paid_amount) + numericAmount;
    const newRemaining = Math.max(0, Number(target.total_amount) - newPaidAmount);
    const newStatus = newRemaining === 0 ? 'Lunas' : 'Belum Lunas';

    const paymentRecord = {
      id: `PAY-${(paymentDate || '2026-11-10').replace(/-/g, '')}-${String((target.payments || []).length + 1).padStart(2, '0')}`,
      date: paymentDate || '2026-11-10',
      amount: numericAmount,
    note: String(note || '').trim() || (newStatus === 'Lunas' ? 'Pelunasan piutang penuh' : 'Pembayaran cicilan piutang')
    };

    const updatedReceivable = {
      ...target,
      paid_amount: newPaidAmount,
      remaining_amount: newRemaining,
      status: newStatus,
      payments: [...(target.payments || []), paymentRecord]
    };

    const updatedReceivables = [...receivables];
    updatedReceivables[targetIndex] = updatedReceivable;

    const updatedIncomes = incomes.map((inc) => {
      if (inc.id === target.income_id || inc.receivable_id === target.id) {
        return {
          ...inc,
          status: newStatus === 'Lunas' ? 'Lunas' : 'Piutang'
        };
      }
      return inc;
    });

    saveDemoStore({
      incomes: updatedIncomes,
      expenses,
      receivables: updatedReceivables
    });

    return { data: updatedReceivable, is_demo: true };
  }

  /* ==========================================================================
     6. REKAPITULASI (FR-REK)
     ========================================================================== */
  export async function fetchRecapitulation({ periodType = 'monthly', date = '2026-11-10', month = '2026-11' } = {}) {
    const mode = getDataModePreference();

    if (mode !== 'demo') {
      try {
        const response = await apiRequest('/recapitulation', {
          method: 'GET',
          params: { period_type: periodType, date, month }
        });
        notifyBackendStatus(true);
        return { ...response.data, is_demo: false };
      } catch (err) {
        if (mode === 'live') throw err;
        notifyBackendStatus(false);
      }
    }

    await delay(200);
    const { incomes, expenses, receivables } = loadDemoStore();

    const summary = calculateFinancialSummary(incomes, expenses, receivables, {
      periodType,
      date,
      month
    });

    const matchDate = (d) => {
      const clean = String(d || '').slice(0, 10);
      return periodType === 'daily' ? clean === date : clean.startsWith(month);
    };

    const periodIncomes = incomes.filter((i) => matchDate(i.date));
    const periodExpenses = expenses.filter((e) => matchDate(e.date));

    const periodReceivablePayments = [];
    receivables.forEach((rcv) => {
      (rcv.payments || []).forEach((pay) => {
        if (matchDate(pay.date)) {
          periodReceivablePayments.push({
            id: pay.id,
            date: pay.date,
            customer_name: rcv.customer_name,
            receivable_id: rcv.id,
            amount: pay.amount,
            note: pay.note
          });
        }
      });
    });

    const expenseByCategoryMap = {};
    periodExpenses.forEach((exp) => {
      expenseByCategoryMap[exp.category] =
        (expenseByCategoryMap[exp.category] || 0) + Number(exp.amount || 0);
    });

    const expenseBreakdown = Object.entries(expenseByCategoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: summary.totalExpenses > 0 ? Math.round((amount / summary.totalExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const chartSeries = buildChartSeries(incomes, expenses, receivables, {
      periodType,
      month: periodType === 'daily' ? date.slice(0, 7) : month,
      date
    });

    return {
      summary,
      periodIncomes,
      periodExpenses,
      periodReceivablePayments,
      expenseBreakdown,
      chartSeries,
      is_demo: true
    };
  }
