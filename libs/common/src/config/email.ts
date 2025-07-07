export const EMAIL_CONFIG = {
  HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  PORT: parseInt(process.env.EMAIL_PORT || '587'),
  USER: process.env.EMAIL_USER || '',
  PASSWORD: process.env.EMAIL_PASSWORD || '',
  FROM: process.env.EMAIL_FROM || 'noreply@example.com',
  SECURE: process.env.EMAIL_SECURE === 'true',
} as const;
