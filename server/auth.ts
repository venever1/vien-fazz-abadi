import crypto from 'crypto';

const JWT_SECRET: string = process.env.JWT_SECRET ?? (() => {
  throw new Error('FATAL: JWT_SECRET environment variable is required. Set it in server/.env');
})();

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const hashBuffer = Buffer.from(hash, 'hex');
  const computedBuffer = crypto.scryptSync(password, salt, 64);
  if (hashBuffer.length !== computedBuffer.length) return false;
  return crypto.timingSafeEqual(hashBuffer, computedBuffer);
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: 'Admin/Owner' | 'Staff Keuangan';
  exp: number;
}

export function generateToken(payload: Omit<TokenPayload, 'exp'>): string {
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const fullPayload: TokenPayload = { ...payload, exp };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

    const payload: TokenPayload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');
