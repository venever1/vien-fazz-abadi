import crypto from 'crypto';
import { query, getClient } from './dbClient';
import { readSchemaSql } from './migrate';
import { hashPassword, verifyPassword } from './auth';

export const initDb = async (): Promise<void> => {
  // Run schema migration (idempotent — IF NOT EXISTS)
  const schema = readSchemaSql();
  await getClient().executeMultiple(schema);

  // Bootstrap products (data master PRD §6) — hanya jika kosong
  const productCount = await query.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM products');
  if (productCount?.cnt === 0) {
    const insertProduct = getClient().batch([
      { sql: 'INSERT INTO products (id, name, category, active) VALUES (?, ?, ?, ?)', args: ['prd-01', 'Shampo', 'Shampo', 1] },
      { sql: 'INSERT INTO products (id, name, category, active) VALUES (?, ?, ?, ?)', args: ['prd-02', 'Sabun Cuci', 'Sabun', 1] },
      { sql: 'INSERT INTO products (id, name, category, active) VALUES (?, ?, ?, ?)', args: ['prd-03', 'Semir Mobil', 'Semir', 1] },
      { sql: 'INSERT INTO products (id, name, category, active) VALUES (?, ?, ?, ?)', args: ['prd-04', 'Semir Motor', 'Semir', 1] },
      { sql: 'INSERT INTO products (id, name, category, active) VALUES (?, ?, ?, ?)', args: ['prd-05', 'Kombinasi Shampo & Sabun', 'Kombinasi', 1] },
    ]);
    await insertProduct;
    console.log('Bootstrap: products default dibuat.');
  }

  // Bootstrap users sistem (admin/staff) — hanya jika kosong, password acak
  const userCount = await query.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM users');
  if (userCount?.cnt === 0) {
    const randomPassword = (): string => {
      const buf = crypto.randomBytes(4);
      return buf.toString('hex').slice(0, 8);
    };

    const adminPass = randomPassword();
    const staffPass = randomPassword();
    const adminCred = hashPassword(adminPass);
    const staffCred = hashPassword(staffPass);
    await query.run(
      'INSERT INTO users (id, username, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)',
      ['usr-01', 'admin', adminCred.hash, adminCred.salt, 'Admin/Owner'],
    );
    await query.run(
      'INSERT INTO users (id, username, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)',
      ['usr-02', 'staff', staffCred.hash, staffCred.salt, 'Staff Keuangan'],
    );
    console.log(`[credentials] admin / ${adminPass}`);
    console.log(`[credentials] staff / ${staffPass}`);
  }

  // Rotate known weak default passwords (admin123 / staff123) on every boot
  const users = await query.all<{ id: string; username: string; password_hash: string; salt: string }>(
    'SELECT id, username, password_hash, salt FROM users',
  );
  const knownDefaults: Record<string, string> = { admin: 'admin123', staff: 'staff123' };
  for (const user of users) {
    const knownPass = knownDefaults[user.username];
    if (!knownPass) continue;
    if (verifyPassword(knownPass, user.password_hash, user.salt)) {
      const newPass = crypto.randomBytes(4).toString('hex').slice(0, 8);
      const cred = hashPassword(newPass);
      await query.run('UPDATE users SET password_hash = ?, salt = ? WHERE id = ?', [cred.hash, cred.salt, user.id]);
      console.log(`[security] password default untuk "${user.username}" dirotasi. Kredensial baru: ${user.username} / ${newPass}`);
    }
  }

  // Test/provisioning: force password from env (idempotent)
  const forceEnvPassword = async (username: string, password: string | undefined) => {
    if (!password) return;
    const cred = hashPassword(password);
    await query.run('UPDATE users SET password_hash = ?, salt = ? WHERE username = ?', [cred.hash, cred.salt, username]);
    console.log(`[credentials] password "${username}" diset dari env (SEED_*)`);
  };
  await forceEnvPassword('admin', process.env.SEED_ADMIN_PASSWORD);
  await forceEnvPassword('staff', process.env.SEED_STAFF_PASSWORD);
};

export const generateInvoiceNumber = async (date: Date = new Date()): Promise<string> => {
  const year = date.getFullYear();
  const prefix = `INV-${year}`;
  const row = await query.get<{ invoice_number: string }>(
    'SELECT invoice_number FROM invoices WHERE invoice_number LIKE ? ORDER BY invoice_number DESC LIMIT 1',
    [`${prefix}%`],
  );
  const lastNum = row ? parseInt(row.invoice_number.split('-')[2] || '0', 10) : 0;
  const nextNum = lastNum + 1;
  return `${prefix}-${String(nextNum).padStart(4, '0')}`;
};

export default getClient();