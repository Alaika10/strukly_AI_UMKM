import pkg from "pg";
const { Pool } = pkg;

// Konfigurasi pool, memprioritaskan DATABASE_URL jika ada (misal di Railway)
const poolConfig = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
      }
    : {
          user: process.env.PGUSER,
          host: process.env.PGHOST,
          database: process.env.PGDATABASE,
          password: process.env.PGPASSWORD,
          port: process.env.PGPORT,
      };

// Jika ENV adalah production dan bukan koneksi internal Railway, kita aktifkan SSL
if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes(".railway.internal")) {
    poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

export default pool;
