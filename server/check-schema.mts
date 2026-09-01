import { createClient } from '@libsql/client';
import { readSchemaSql } from './migrate';
import assert from 'node:assert';
import { rmSync } from 'node:fs';

const TEST_DB = 'C:/Users/LENOVO/AppData/Local/Temp/opencode/migrate-test.sqlite';
try { rmSync(TEST_DB); } catch {}

async function main() {
  const client = createClient({ url: `file:${TEST_DB}` });

  const schema = readSchemaSql();
  assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS companies'), 'schema has companies');
  assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS audit_logs'), 'schema has audit_logs');
  assert.strictEqual((schema.match(/CREATE TABLE IF NOT EXISTS/g) || []).length, 8, 'exactly 8 tables');

  await client.executeMultiple(schema);

  const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  const tables = res.rows.map((r: any) => r.name).sort();
  const expected = ['audit_logs', 'companies', 'expenses', 'invoices', 'payments', 'products', 'token_blacklist', 'users'];
  assert.deepStrictEqual(tables, expected, 'all 8 tables created');
  console.log('Tables created:', tables.join(', '));

  await client.executeMultiple(schema);
  console.log('Idempotent re-run OK');

  const fk = await client.execute('PRAGMA foreign_keys');
  console.log('foreign_keys =', fk.rows[0]?.foreign_keys ?? fk.rows[0]);

  await client.close();
  try { rmSync(TEST_DB); } catch {}
  console.log('ALL SCHEMA TESTS PASSED');
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
