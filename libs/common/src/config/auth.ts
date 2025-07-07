export const AUTH_CONFIG = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secret-key',
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY || 'secret-key',
  HASH_SALT: parseInt(process.env.HASH_SALT || '10'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
} as const;
