import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: (() => {
      const url = process.env.DATABASE_URL;
      if (!url) return '';
      return url;
    })(),
  },
});
