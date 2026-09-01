import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createTursoClient } from './dbClient';

const isDist = __dirname.endsWith(`${join('')}dist`) || __dirname.endsWith('/dist') || __dirname.endsWith('\\dist');
const SOURCE_DIR = isDist ? join(__dirname, '..') : __dirname;
export const SCHEMA_PATH = join(SOURCE_DIR, 'schema.sql');

export const readSchemaSql = (): string => {
  return readFileSync(SCHEMA_PATH, 'utf8');
};

export const runMigration = async (): Promise<void> => {
  const client = createTursoClient();
  const schema = readSchemaSql();
  await client.executeMultiple(schema);
  await client.close();
};

// Jalankan langsung: npx tsx migrate.ts
const isMain = require.main === module;
if (isMain) {
  runMigration()
    .then(() => {
      console.log('Migration berhasil. Schema diterapkan.');
    })
    .catch((err) => {
      console.error('Migration gagal:', err.message);
      process.exit(1);
    });
}
