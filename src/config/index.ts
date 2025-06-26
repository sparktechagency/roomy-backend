import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  PORT: z.preprocess((val) => Number(val), z.number().default(5003)),
  SERVER_NAME: z.string().min(1, 'Server name is required'),
  SERVER_URL: z.string().min(1, 'Server URL is required'),
  FRONTEND_URL: z.string().min(1, 'frontend url is required'),
  MONGODB_URL: z.string().min(1, 'MongoDB connection URL is required'),

  JWT_ACCESS_TOKEN_SECRET: z.string().min(1, 'Access token secret key is required'),
  JWT_ACCESS_TOKEN_EXPIRESIN: z.string().default('14d'),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1, 'Refresh token secret key is required'),
  JWT_REFRESH_TOKEN_EXPIRESIN: z.string().default('30d'),

  STRIPE_SECRET_KEY: z.string().min(1, 'stripe secret key is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'stripe secret key is required'),
  GMAIL_APP_USER: z.string().email('Invalid email format'),
  GMAIL_APP_PASSWORD: z.string().min(1, 'Gmail app password is required'),
});

const envVars = envSchema.parse(process.env);

export default {
  node_env: envVars.NODE_ENV,
  server_port: envVars.PORT,
  server_name: envVars.SERVER_NAME,
  mongodb_url: envVars.MONGODB_URL,
  frontend_url: envVars.FRONTEND_URL,

  jwt_access_token_secret: envVars.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expiresin: envVars.JWT_ACCESS_TOKEN_EXPIRESIN,
  jwt_refresh_token_secret: envVars.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expiresin: envVars.JWT_REFRESH_TOKEN_EXPIRESIN,
  stripe_webhook_secret: envVars.STRIPE_WEBHOOK_SECRET,
  stripe_secret_key: envVars.STRIPE_SECRET_KEY,
  gmail_app_user: envVars.GMAIL_APP_USER,
  gmail_app_password: envVars.GMAIL_APP_PASSWORD,
  server_url: envVars.SERVER_URL,
};
