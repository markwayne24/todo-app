export const BULLMQ_CONFIG = {
  BULL_DASHBOARD_USER: process.env.BULL_DASHBOARD_USER || 'admin',
  BULL_DASHBOARD_PASSWORD: process.env.BULL_DASHBOARD_PASSWORD || 'password123',
} as const;
