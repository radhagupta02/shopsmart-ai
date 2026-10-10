import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  LLM_API_KEY: z.string().min(1),
  EMBEDDING_MODEL: z.string().min(1),
  LLM_PROVIDER: z.string().min(1),
  LLM_MODEL: z.string().min(1),
  EMBEDDING_DIM: z.coerce.number().int().positive(),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  JWT_TTL: z.string().default('24h')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
