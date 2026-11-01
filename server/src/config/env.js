import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === 'true';
};

const list = (value, fallback) => (value ? value.split(',').map((item) => item.trim()).filter(Boolean) : fallback);

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-life-planner',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'local-access-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'local-refresh-secret-change-me',
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshIdleMinutes: toNumber(process.env.REFRESH_IDLE_MINUTES, 30),
  refreshAbsoluteHours: toNumber(process.env.REFRESH_ABSOLUTE_HOURS, 24),
  cookieSecure: toBoolean(process.env.COOKIE_SECURE, false),
  cookieSameSite: process.env.COOKIE_SAME_SITE || 'lax',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: toNumber(process.env.SMTP_PORT, 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'no-reply@smartlifeplanner.local'
  },
  ai: {
    baseUrl: process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1',
    apiKey: process.env.AI_API_KEY || '',
    modelFast: process.env.AI_MODEL_FAST || 'openai/gpt-oss-20b',
    modelSmart: process.env.AI_MODEL_SMART || 'openai/gpt-oss-120b',
    timeoutMs: toNumber(process.env.AI_TIMEOUT_MS, 12000),
    cacheHours: toNumber(process.env.AI_CACHE_HOURS, 6),
    rateWindowMs: toNumber(process.env.AI_RATE_LIMIT_WINDOW_MS, 900000),
    rateMax: toNumber(process.env.AI_RATE_LIMIT_MAX, 20)
  },
  defaultCurrency: process.env.DEFAULT_CURRENCY || 'PKR',
  supportedCurrencies: list(process.env.SUPPORTED_CURRENCIES, ['PKR', 'USD', 'EUR', 'GBP']),
  budgetCategories: list(process.env.BUDGET_CATEGORIES, ['Groceries', 'Housing', 'Transport', 'Utilities', 'Health', 'Education', 'Other']),
  adminEmail: process.env.ADMIN_EMAIL || 'admin@smartlifeplanner.local',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe_12345'
};

export const refreshCookieName = 'slp_refresh';
