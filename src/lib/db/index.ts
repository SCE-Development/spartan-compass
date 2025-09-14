import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || "";
const client = postgres(databaseUrl);
export const db = drizzle(client, { schema });
