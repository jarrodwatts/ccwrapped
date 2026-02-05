import { z } from "zod";

const serverEnvSchema = z.object({
  KV_REST_API_URL: z.string().url(),
  KV_REST_API_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://ccwrapped.com"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse(process.env);
}

function getClientEnv(): ClientEnv {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
}

export const serverEnv = /* @__PURE__ */ getServerEnv;
export const clientEnv = /* @__PURE__ */ getClientEnv;
