import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries - with prepared statements disabled for better compatibility
const queryClient = postgres(connectionString, { prepare: false });
export const db = drizzle(queryClient, { schema });

export { schema };
