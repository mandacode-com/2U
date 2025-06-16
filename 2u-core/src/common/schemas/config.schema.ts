import { z } from 'zod';

export const configSchema = z.object({
  server: z.object({
    nodeEnv: z
      .string()
      .nonempty()
      .transform((x) => x.toLowerCase())
      .refine((x) => ['development', 'production', 'test'].includes(x), {
        message:
          'NODE_ENV must be one of "development", "production", or "test"',
      })
      .default('development'),
    port: z.number().int().positive().default(3000),
  }),
  auth: z.object({
    gatewayJwtSecret: z.string().nonempty(),
    gatewayJwtHeader: z.string().nonempty().default('x-gateway-jwt'),
  }),
  cors: z.object({
    origin: z.string().url().default('http://localhost:3000'),
    methods: z.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'),
    credentials: z.boolean().default(true),
  }),
});

export type Config = z.infer<typeof configSchema>;
