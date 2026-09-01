import { createClient } from '@libsql/client';
import type { Client, Config } from '@libsql/client';
import path from 'path';

export type { Client, Config };

const isDist = __dirname.endsWith(`${path.sep}dist`) || __dirname.endsWith('/dist') || __dirname.endsWith('\\dist');
const SOURCE_DIR = isDist ? path.join(__dirname, '..') : __dirname;

let _client: Client | null = null;

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

export function getClient(): Client {
  if (!_client) {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const url = tursoUrl || `file:${path.join(SOURCE_DIR, 'database.sqlite')}`;
    if (isProduction() && !tursoUrl) {
      throw new Error(
        'FATAL: NODE_ENV=production requires TURSO_DATABASE_URL. Refusing to fall back to local file (data loss risk on ephemeral storage).',
      );
    }
    const authToken = process.env.TURSO_AUTH_TOKEN;
    _client = createClient({ url, authToken });
  }
  return _client;
}

export function createTursoClient(config?: Partial<Config>): Client {
  const url = config?.url || process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      'TURSO_DATABASE_URL is required. Set it in environment or pass url in config.',
    );
  }
  return createClient({
    url,
    authToken: config?.authToken || process.env.TURSO_AUTH_TOKEN,
    ...config,
  });
}

export const query = {
  get: async <T>(sql: string, args?: any[]): Promise<T | undefined> => {
    const r = await getClient().execute({ sql, args });
    return r.rows[0] as T | undefined;
  },
  all: async <T>(sql: string, args?: any[]): Promise<T[]> => {
    const r = await getClient().execute({ sql, args });
    return r.rows as T[];
  },
  run: async (sql: string, args?: any[]): Promise<void> => {
    await getClient().execute({ sql, args });
  },
};