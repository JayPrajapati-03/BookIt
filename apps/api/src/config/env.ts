import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root or apps/api
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_URL: z.string().url().default('http://localhost:4000'),
  WEB_URL: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  COOKIE_DOMAIN: z.string().default('localhost'),
  SMTP_HOST: z.string().default('127.0.0.1'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().default('dev_user'),
  SMTP_PASS: z.string().default('dev_pass'),
  EMAIL_FROM: z.string().default('BookIt Stays <noreply@bookit.internal>'),
  CLOUDINARY_CLOUD_NAME: z.string().default('bookit-demo'),
  CLOUDINARY_API_KEY: z.string().default('123456789012345'),
  CLOUDINARY_API_SECRET: z.string().default('sample_secret'),
  HOLD_DURATION_MINUTES: z.coerce.number().positive().default(10),
  TAX_PERCENTAGE: z.coerce.number().min(0).max(100).default(18),
  DEMO_MODE: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ FATAL: Invalid environment variables configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
