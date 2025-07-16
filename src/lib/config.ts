import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  API_VERSION,
  EXPIRES_IN,
  REFRESH_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_JWT_SECRET
} = process.env;

export const API_PREFIX = `/api/${API_VERSION || 'v1'}`;


export const PUBLIC_ROUTES = [
  `${API_PREFIX}/docs`,
  `${API_PREFIX}/health`,
  `${API_PREFIX}/auth/login`,
  `${API_PREFIX}/auth/register`,
  `${API_PREFIX}/auth/refresh`
];