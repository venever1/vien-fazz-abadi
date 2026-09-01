#!/usr/bin/env node
/**
 * Smoke test permanen untuk backend.
 *
 * Cara menjalankan (server harus sudah hidup):
 *   cd server
 *   SMOKE_ADMIN_PASSWORD=<password-admin> node smoke-test.mjs
 *
 * Kredensial TIDAK di-hardcode. Ambil dari env:
 *   SMOKE_ADMIN_USER       (default: admin)
 *   SMOKE_ADMIN_PASSWORD   (wajib — biasanya dari SEED_ADMIN_PASSWORD di .env)
 *   SMOKE_BASE_URL         (default: http://localhost:3001/api)
 *   SMOKE_RATE_MAX         (default: 5 — jumlah percobaan login sebelum 429)
 *
 * Catatan: test rate limit mengunci IP untuk window berjalan
 * (LOGIN_RATE_WINDOW_MS, default 15 menit). Untuk mempersingkat,
 * jalankan server dengan LOGIN_RATE_MAX=3 LOGIN_RATE_WINDOW_MS=60000.
 */
import assert from 'node:assert';
import 'dotenv/config';

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3001/api';
const ADMIN_USER = process.env.SMOKE_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.SMOKE_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD;
const RATE_MAX = Number(process.env.SMOKE_RATE_MAX) || Number(process.env.LOGIN_RATE_MAX) || 5;

const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

if (!ADMIN_PASS) {
  console.error('ERROR: SMOKE_ADMIN_PASSWORD wajib diisi (dari env / SEED_ADMIN_PASSWORD).');
  process.exit(2);
}

async function req(method, path, token, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, body: await res.text() };
}

async function login(user, pass) {
  const res = await fetch(BASE + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass }),
  });
  return { status: res.status, body: await res.text() };
}

(async () => {
  // --- 1. Login sukses ---
  const ok = await login(ADMIN_USER, ADMIN_PASS);
  const okData = JSON.parse(ok.body);
  check('login sukses', ok.status === 200 && !!okData.token && !!okData.user, `user=${okData.user?.username} role=${okData.user?.role}`);
  const token = okData.token;
  assert.ok(token, 'token harus ada');

  // --- 2. Endpoint proteksi dasar ---
  const inv = await req('GET', '/invoices', token);
  check('GET /invoices (auth)', inv.status === 200, `status=${inv.status}`);
  const noAuth = await req('GET', '/invoices', null);
  check('GET /invoices tanpa token (401)', noAuth.status === 401, `status=${noAuth.status}`);

  // --- 3. Validation: negative amount ditolak ---
  const negExpense = await req('POST', '/expenses', token, {
    description: 'negatif', category: 'Operasional', transaction_date: '2026-08-28', amount: -1000,
  });
  check('POST expense amount negatif (400)', negExpense.status === 400, `status=${negExpense.status}`);

  // --- 4. Validation: paid_amount > total ditolak ---
  // Buat data sementara utk test (DB bersih — tidak ada inv-01)
  const tmpCo = await req('POST', '/companies', token, {
    company_name: 'SmokeTest Co', business_description: 'Test', status: 'Belum Bayar',
  });
  assert.strictEqual(tmpCo.status, 201, 'create temp company utk smoke');
  const tmpCoId = JSON.parse(tmpCo.body).id;
  const tmpInv = await req('POST', '/invoices', token, {
    company_id: tmpCoId, product_id: 'prd-01', due_date: '2026-12-31', total_amount: 1000000, status: 'Belum Bayar',
  });
  assert.strictEqual(tmpInv.status, 201, 'create temp invoice utk smoke');
  const tmpInvId = JSON.parse(tmpInv.body).id;

  const overPay = await req('PATCH', `/invoices/${tmpInvId}`, token, { paid_amount: 999999999, status: 'Lunas' });
  check('PATCH invoice overpaid (400)', overPay.status === 400, `status=${overPay.status}`);

  // --- 4b. Logout + token tidak bisa dipakai lagi ---
  const logout = await req('POST', '/auth/logout', token);
  check('logout (200)', logout.status === 200, `status=${logout.status}`);
  const afterLogout = await req('GET', '/dashboard', token);
  check('token setelah logout ditolak (401)', afterLogout.status === 401, `status=${afterLogout.status}`);

  // --- 6. Rate limit login ---
  // (dijalankan terakhir karena mengunci IP)
  for (let i = 0; i < RATE_MAX; i++) {
    await login('admin', 'salah-password-123');
  }
  const rateLimited = await login('admin', 'salah-password-123');
  check(`rate limit setelah ${RATE_MAX} percobaan gagal (429)`, rateLimited.status === 429, `status=${rateLimited.status}`);

  console.log('--- SMOKE TEST RESULTS ---');
  for (const r of results) {
    console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  [' + r.detail + ']' : ''}`);
  }
  const failed = results.filter((r) => !r.pass);
  console.log(`--- ${results.length - failed.length}/${results.length} passed ---`);
  if (failed.length > 0) process.exit(1);
})().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
