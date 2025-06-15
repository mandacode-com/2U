import { Config, configSchema } from '../schemas/config.schema';

const parseIntIfExists = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }
  const parsedValue = parseInt(value);
  return isNaN(parsedValue) ? undefined : parsedValue;
};

export function validate(raw: Record<string, unknown>) {
  const env: Config = {
    server: {
      nodeEnv: raw.NODE_ENV as string,
      port: parseIntIfExists(raw.PORT as string) as number,
    },
    auth: {
      gatewayJwtSecret: raw.AUTH_GATEWAY_JWT_SECRET as string,
      gatewayJwtHeader: raw.AUTH_GATEWAY_JWT_HEADER as string,
    },
  };

  const parsedEnv = configSchema.parse(env);
  return parsedEnv;
}
