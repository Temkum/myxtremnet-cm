/**
 * Environment variable validation
 * Ensures all required environment variables are set at startup
 */

const requiredEnvVars = {
  // Database
  DATABASE_URL: 'PostgreSQL connection string',

  // Better Auth
  BETTER_AUTH_URL: 'Better Auth base URL',
  BETTER_AUTH_SECRET: 'Better Auth secret key',

  // App
  NEXT_PUBLIC_APP_URL: 'Public app URL',
} as const;

type RequiredEnvVar = keyof typeof requiredEnvVars;

export function validateEnv(): void {
  const missing: string[] = [];

  for (const [key, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[key]) {
      missing.push(`${key} (${description})`);
    }
  }

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach((varName) => console.error(`   - ${varName}`));
    console.error('\nPlease set these variables in your .env.local file and restart the server.\n');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
}

// Validate on import in development
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}
