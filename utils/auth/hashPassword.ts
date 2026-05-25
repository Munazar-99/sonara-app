import crypto from 'crypto';

const SCRYPT_PARAMS = {
  keyLength: 64,
  N: 16_384,
  r: 8,
  p: 1,
} as const;

const PASSWORD_HASH_PREFIX = 'scrypt';

export async function hashPassword(plainTextPassword: string) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const derivedKey = await scryptPassword(plainTextPassword, salt);

  return [
    PASSWORD_HASH_PREFIX,
    SCRYPT_PARAMS.N,
    SCRYPT_PARAMS.r,
    SCRYPT_PARAMS.p,
    salt,
    derivedKey.toString('base64url'),
  ].join('$');
}

export async function verifyPassword(
  plainTextPassword: string,
  storedPasswordHash: string,
) {
  if (!storedPasswordHash.startsWith(`${PASSWORD_HASH_PREFIX}$`)) {
    return false;
  }

  return verifyScryptPassword(plainTextPassword, storedPasswordHash);
}

async function verifyScryptPassword(
  plainTextPassword: string,
  storedPasswordHash: string,
) {
  const [, N, r, p, salt, hash] = storedPasswordHash.split('$');

  if (!N || !r || !p || !salt || !hash) {
    return false;
  }

  const params = {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  };

  if (
    !Number.isFinite(params.N) ||
    !Number.isFinite(params.r) ||
    !Number.isFinite(params.p)
  ) {
    return false;
  }

  const derivedKey = await scryptPassword(plainTextPassword, salt, {
    N: params.N,
    r: params.r,
    p: params.p,
  });

  return timingSafeEqual(derivedKey, Buffer.from(hash, 'base64url'));
}

async function scryptPassword(
  plainTextPassword: string,
  salt: string,
  params: { N: number; r: number; p: number } = SCRYPT_PARAMS,
) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(
      plainTextPassword,
      salt,
      SCRYPT_PARAMS.keyLength,
      params,
      (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey);
        }
      },
    );
  });
}

function timingSafeEqual(value: Buffer, comparison: Buffer) {
  return (
    value.length === comparison.length &&
    crypto.timingSafeEqual(value, comparison)
  );
}
