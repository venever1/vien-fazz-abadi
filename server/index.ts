import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initDb, generateInvoiceNumber } from './db';
import { query, getClient, isProduction } from './dbClient';
import { generateToken, hashToken, verifyPassword, verifyToken, type TokenPayload } from './auth';

const app = express();
app.use(helmet());
// CORS: support comma-separated origins (Cloudflare Pages custom domain + preview)
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Global rate limiter: 120 req/min per IP
app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' },
}));

// Login rate limiter: 5 attempts per 15 min per IP (configurable via env utk test)
const LOGIN_RATE_WINDOW_MS = Number(process.env.LOGIN_RATE_WINDOW_MS) || 15 * 60 * 1000;
const LOGIN_RATE_MAX = Number(process.env.LOGIN_RATE_MAX) || 5;
const loginLimiter = rateLimit({
  windowMs: LOGIN_RATE_WINDOW_MS,
  max: LOGIN_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan login. Coba lagi nanti.' },
});

// Types
interface AuthedRequest extends Request {
  user?: TokenPayload;
}

// Helpers
const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const hash = hashToken(token);
  const row = await query.get<{ n: number }>(
    'SELECT 1 as n FROM token_blacklist WHERE token_hash = ? AND expired_at > ?',
    [hash, new Date().toISOString()],
  );
  return !!row;
};

const validateAmount = (value: unknown, label: string): string | null => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return `${label} harus lebih dari 0.`;
  }
  return null;
};

// Auth middleware
const requireAuth = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Autentikasi diperlukan.' });
  }
  const token = header.slice(7);
  if (await isTokenBlacklisted(token)) {
    return res.status(401).json({ message: 'Sesi telah berakhir. Silakan login ulang.' });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Sesi tidak valid atau kedaluwarsa.' });
  }
  req.user = payload;
  next();
};

const requireRole = (roles: string[]) => {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin.' });
    }
    next();
  };
};

const logAudit = async (userId: string, username: string, action: string, entity: string, entityId: string | null = null, details: string | null = null) => {
  const id = `audit-${Date.now()}`;
  await query.run(
    `INSERT INTO audit_logs (id, user_id, username, action, entity, entity_id, details, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, username, action, entity, entityId, details, new Date().toISOString()],
  );
};

// Auth Routes
app.post('/api/auth/login', loginLimiter, async (req: AuthedRequest, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  const user = await query.get<{ id: string; username: string; password_hash: string; salt: string; role: string }>(
    'SELECT id, username, password_hash, salt, role FROM users WHERE username = ?',
    [username],
  );

  if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
    return res.status(401).json({ message: 'Username atau password salah.' });
  }

  const token = generateToken({ userId: user.id, username: user.username, role: user.role as TokenPayload['role'] });

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

app.post('/api/auth/logout', requireAuth, async (req: AuthedRequest, res: Response) => {
  const token = req.headers.authorization!.slice(7);
  const hash = hashToken(token);
  await query.run(
    'INSERT OR IGNORE INTO token_blacklist (token_hash, expired_at) VALUES (?, ?)',
    [hash, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()],
  );
  res.json({ message: 'Logout berhasil.' });
});

// API Routes
app.get('/api/dashboard', requireAuth, async (req: AuthedRequest, res: Response) => {
  const payments = await query.all<{ amount: number }>('SELECT amount FROM payments');
  const expenses = await query.all<{ amount: number }>('SELECT amount FROM expenses');
  const invoices = await query.all<{ total_amount: number; paid_amount: number }>('SELECT total_amount, paid_amount FROM invoices');

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const receivables = invoices.reduce((sum, inv) => sum + Math.max(inv.total_amount - inv.paid_amount, 0), 0);

  res.json({
    totalIncome,
    totalExpense,
    receivables,
    netCashflow: totalIncome - totalExpense
  });
});

app.get('/api/companies', requireAuth, async (req: AuthedRequest, res: Response) => {
    res.json(await query.all('SELECT * FROM companies'));
});

app.get('/api/companies/:id', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const company = await query.get<Record<string, unknown>>('SELECT * FROM companies WHERE id = ?', [id]);
  if (!company) {
    return res.status(404).json({ message: 'Perusahaan tidak ditemukan.' });
  }
  res.json(company);
});

app.get('/api/products', requireAuth, async (req: AuthedRequest, res: Response) => {
    res.json(await query.all('SELECT * FROM products'));
});

app.get('/api/invoices', requireAuth, async (req: AuthedRequest, res: Response) => {
    res.json(await query.all('SELECT * FROM invoices'));
});

app.get('/api/invoices/:id', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const invoice = await query.get<Record<string, unknown>>('SELECT * FROM invoices WHERE id = ?', [id]);
  if (!invoice) {
    return res.status(404).json({ message: 'Tagihan tidak ditemukan.' });
  }
  res.json(invoice);
});

app.get('/api/payments', requireAuth, async (req: AuthedRequest, res: Response) => {
    res.json(await query.all('SELECT * FROM payments'));
});

app.get('/api/expenses', requireAuth, async (req: AuthedRequest, res: Response) => {
    res.json(await query.all('SELECT * FROM expenses'));
});

app.post('/api/expenses', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { description, category, transaction_date, amount, notes } = req.body;
  const err = validateAmount(amount, 'Jumlah pengeluaran');
  if (err) return res.status(400).json({ message: err });
  if (!description || !description.trim()) {
    return res.status(400).json({ message: 'Keterangan wajib diisi.' });
  }
  const id = `exp-${Date.now()}`;
  const now = new Date().toISOString().slice(0, 10);
  await query.run(
    `INSERT INTO expenses (id, description, category, transaction_date, amount, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, description, category, transaction_date, amount, notes || '', now, now],
  );
  if (req.user) {
    await logAudit(req.user.userId, req.user.username, 'CREATE', 'expense', id, `${description} - ${amount}`);
  }
  res.status(201).json({ id });
});

app.patch('/api/expenses/:id', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { description, category, transaction_date, amount, notes } = req.body;
  const existing = await query.get<Record<string, unknown>>('SELECT * FROM expenses WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ message: 'Pengeluaran tidak ditemukan.' });
  }
  const err = validateAmount(amount, 'Jumlah pengeluaran');
  if (err) return res.status(400).json({ message: err });
  const now = new Date().toISOString().slice(0, 10);
  await query.run(
    `UPDATE expenses
     SET description = ?, category = ?, transaction_date = ?, amount = ?, notes = ?, updated_at = ?
     WHERE id = ?`,
    [description, category, transaction_date, amount, notes || '', now, id],
  );
  if (req.user) {
    await logAudit(req.user.userId, req.user.username, 'UPDATE', 'expense', id, `${description} - ${amount}`);
  }
  res.json({ id });
});

app.delete('/api/expenses/:id', requireAuth, requireRole(['Admin/Owner']), async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const existing = await query.get<{ description: string }>('SELECT description FROM expenses WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ message: 'Pengeluaran tidak ditemukan.' });
  }
  await query.run('DELETE FROM expenses WHERE id = ?', [id]);
  if (req.user) {
    await logAudit(req.user.userId, req.user.username, 'DELETE', 'expense', id, existing.description);
  }
  res.json({ id });
});

app.post('/api/companies', requireAuth, requireRole(['Admin/Owner']), async (req: AuthedRequest, res: Response) => {
  const { company_name, business_description, contact_person, phone, address, status } = req.body;
  if (!company_name || !company_name.trim()) {
    return res.status(400).json({ message: 'Nama perusahaan wajib diisi.' });
  }
  const id = `com-${Date.now()}`;
  const now = new Date().toISOString().slice(0, 10);
  await query.run(
    `INSERT INTO companies (id, company_name, business_description, contact_person, phone, address, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, company_name, business_description || '', contact_person || '', phone || '', address || '', status, now, now],
  );
  if (req.user) {
    await logAudit(req.user.userId, req.user.username, 'CREATE', 'company', id, company_name);
  }
  res.status(201).json({ id });
});

app.delete('/api/companies/:id', requireAuth, requireRole(['Admin/Owner']), async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const existing = await query.get<{ company_name: string }>('SELECT company_name FROM companies WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ message: 'Perusahaan tidak ditemukan.' });
  }
  await query.run('DELETE FROM companies WHERE id = ?', [id]);
  if (req.user) {
    await logAudit(req.user.userId, req.user.username, 'DELETE', 'company', id, existing.company_name);
  }
  res.json({ id });
});

app.post('/api/invoices', requireAuth, requireRole(['Admin/Owner']), async (req: AuthedRequest, res: Response) => {
  const { company_id, product_id, invoice_date, due_date, total_amount, paid_amount, status, notes } = req.body;
  const err = validateAmount(total_amount, 'Jumlah tagihan');
  if (err) return res.status(400).json({ message: err });
  const id = `inv-${Date.now()}`;
  const invoice_number = await generateInvoiceNumber();
  const now = new Date().toISOString().slice(0, 10);
  await query.run(
    `INSERT INTO invoices (id, company_id, invoice_number, product_id, invoice_date, due_date, total_amount, paid_amount, status, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, company_id, invoice_number, product_id, invoice_date || now, due_date, total_amount, paid_amount || 0, status || 'Belum Bayar', notes || '', now, now],
  );
  if (req.user) {
    await logAudit(req.user.userId, req.user.username, 'CREATE', 'invoice', id, `${invoice_number} - amount=${total_amount}`);
  }
  res.status(201).json({ id, invoice_number });
});

app.post('/api/payments', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { invoice_id, payment_date, amount, payment_method, reference, notes } = req.body;
  const err = validateAmount(amount, 'Jumlah pembayaran');
  if (err) return res.status(400).json({ message: err });
  // Verify invoice exists
  const invoice = await query.get<{ id: string }>('SELECT id FROM invoices WHERE id = ?', [invoice_id]);
  if (!invoice) {
    return res.status(400).json({ message: 'Tagihan tidak ditemukan.' });
  }
  const id = `pay-${Date.now()}`;
  const now = new Date().toISOString().slice(0, 10);
  await query.run(
    `INSERT INTO payments (id, invoice_id, payment_date, amount, payment_method, reference, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, invoice_id, payment_date, amount, payment_method || 'Transfer', reference || '', notes || '', now],
  );
  if (req.user) {
    await logAudit(req.user.userId, req.user.username, 'CREATE', 'payment', id, `invoice=${invoice_id} amount=${amount}`);
  }
  res.status(201).json({ id });
});

// Atomic payment + invoice update (single transaction via batch)
app.post('/api/payments/record', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { invoice_id, payment_date, amount, payment_method, reference, notes } = req.body;
  if (!invoice_id) {
    return res.status(400).json({ message: 'ID tagihan wajib diisi.' });
  }
  const err = validateAmount(amount, 'Jumlah pembayaran');
  if (err) return res.status(400).json({ message: err });

  try {
    const invoice = await query.get<{ id: string; total_amount: number; paid_amount: number; status: string }>(
      'SELECT * FROM invoices WHERE id = ?',
      [invoice_id],
    );
    if (!invoice) throw new Error('Tagihan tidak ditemukan.');

    const newPaidAmount = Math.min(invoice.total_amount, invoice.paid_amount + amount);
    const newStatus = newPaidAmount >= invoice.total_amount ? 'Lunas' : newPaidAmount > 0 ? 'Cicilan' : 'Belum Bayar';
    const now = new Date().toISOString().slice(0, 10);

    await getClient().batch([
      {
        sql: `INSERT INTO payments (id, invoice_id, payment_date, amount, payment_method, reference, notes, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [`pay-${Date.now()}`, invoice_id, payment_date || now, amount, payment_method || 'Transfer', reference || '', notes || '', now],
      },
      {
        sql: 'UPDATE invoices SET paid_amount = ?, status = ?, updated_at = ? WHERE id = ?',
        args: [newPaidAmount, newStatus, now, invoice_id],
      },
    ]);

    if (req.user) {
      await logAudit(req.user.userId, req.user.username, 'STATUS_CHANGE', 'invoice', invoice_id,
        `paid ${amount} -> total ${newPaidAmount}; status=${newStatus}`);
    }
    res.json({ id: invoice_id, paid_amount: newPaidAmount, status: newStatus });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

app.patch('/api/invoices/:id', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { paid_amount, status } = req.body;
  const existing = await query.get<{ total_amount: number; paid_amount: number; status: string }>(
    'SELECT * FROM invoices WHERE id = ?',
    [id],
  );
  if (!existing) {
    return res.status(404).json({ message: 'Tagihan tidak ditemukan.' });
  }
  if (paid_amount !== undefined) {
    if (typeof paid_amount !== 'number' || paid_amount < 0) {
      return res.status(400).json({ message: 'Jumlah dibayar tidak valid.' });
    }
    if (paid_amount > existing.total_amount) {
      return res.status(400).json({ message: 'Jumlah dibayar tidak boleh melebihi total tagihan.' });
    }
  }
  if (status !== undefined && !['Belum Bayar', 'Cicilan', 'Lunas'].includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' });
  }
  const now = new Date().toISOString().slice(0, 10);
  await query.run('UPDATE invoices SET paid_amount = ?, status = ?, updated_at = ? WHERE id = ?', [paid_amount, status, now, id]);
  if (req.user) {
    const statusChanged = existing.status !== status;
    await logAudit(
      req.user.userId,
      req.user.username,
      statusChanged ? 'STATUS_CHANGE' : 'UPDATE',
      'invoice',
      id,
      `${existing.status} -> ${status}; paid ${existing.paid_amount} -> ${paid_amount}`
    );
  }
  res.json({ id });
});

app.delete('/api/invoices/:id', requireAuth, requireRole(['Admin/Owner']), async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const existing = await query.get<{ invoice_number: string }>('SELECT invoice_number FROM invoices WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ message: 'Tagihan tidak ditemukan.' });
  }
  await query.run('DELETE FROM invoices WHERE id = ?', [id]);
  if (req.user) {
    await logAudit(req.user.userId, req.user.username, 'DELETE', 'invoice', id, existing.invoice_number);
  }
  res.json({ id });
});

app.get('/api/audit-logs', requireAuth, requireRole(['Admin/Owner']), async (req: AuthedRequest, res: Response) => {
  const rows = await query.all('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 500');
  res.json(rows);
});

// Detail transaksi perusahaan
app.get('/api/companies/:id/invoices', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const company = await query.get<Record<string, unknown>>('SELECT * FROM companies WHERE id = ?', [id]);
  if (!company) {
    return res.status(404).json({ message: 'Perusahaan tidak ditemukan.' });
  }
  const invoices = await query.all('SELECT * FROM invoices WHERE company_id = ? ORDER BY invoice_date DESC', [id]);
  res.json(invoices);
});

app.get('/api/invoices/:id/payments', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const invoice = await query.get<Record<string, unknown>>('SELECT * FROM invoices WHERE id = ?', [id]);
  if (!invoice) {
    return res.status(404).json({ message: 'Tagihan tidak ditemukan.' });
  }
  const payments = await query.all('SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC', [id]);
  res.json(payments);
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Terjadi kesalahan server.' });
});

const bootstrap = async () => {
  await initDb();
  const dbMode = process.env.TURSO_DATABASE_URL
    ? `Turso (${process.env.TURSO_DATABASE_URL.split('?')[0]})`
    : 'file lokal (server/database.sqlite)';
  console.log(`DB mode: ${dbMode}`);
  console.log(`Environment: ${isProduction() ? 'production' : 'development'}`);
  const PORT = Number(process.env.PORT) || 3001;
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
};

bootstrap().catch((err) => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});