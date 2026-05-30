import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    // 1. Add 'type' column
    console.log("Adding type column...");
    await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'expense';`);

    // 2. Set existing to 'expense'
    console.log("Setting existing to expense...");
    await pool.query(`UPDATE categories SET type = 'expense';`);

    // 3. Update existing expense categories explicitly based on user IDs
    console.log("Updating IDs 1-5 to specific expense categories...");
    // If ID 1-5 don't exist, we should INSERT them. We can do an UPSERT.
    const expenses = [
      { id: 1, name: 'Bahan Baku' },
      { id: 2, name: 'Listrik & Air' },
      { id: 3, name: 'Gaji Karyawan' },
      { id: 4, name: 'Peralatan' },
      { id: 5, name: 'Pajak' }
    ];

    for (const exp of expenses) {
      await pool.query(`
        INSERT INTO categories (id, name, type) 
        VALUES ($1, $2, 'expense') 
        ON CONFLICT (id) DO UPDATE SET name = $2, type = 'expense';
      `, [exp.id, exp.name]);
    }

    // 4. Upsert Income Categories (IDs 6-10)
    console.log("Upserting income categories...");
    const incomes = [
      { id: 6, name: 'Penjualan Produk' },
      { id: 7, name: 'Penjualan Makanan' },
      { id: 8, name: 'Penjualan Minuman' },
      { id: 9, name: 'Jasa' },
      { id: 10, name: 'Lainnya' }
    ];

    for (const inc of incomes) {
      await pool.query(`
        INSERT INTO categories (id, name, type) 
        VALUES ($1, $2, 'income') 
        ON CONFLICT (id) DO UPDATE SET name = $2, type = 'income';
      `, [inc.id, inc.name]);
    }

    // Reset sequence so it doesn't conflict
    console.log("Resetting sequence...");
    await pool.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));`);

    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

run();
