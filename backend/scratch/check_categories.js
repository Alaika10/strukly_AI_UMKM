import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    password: "root",
    database: "finance_app",
    host: "localhost",
    port: 5433,
});

async function main() {
    try {
        const res = await pool.query("SELECT * FROM categories");
        console.log("Categories in database:", res.rows);
    } catch (err) {
        console.error("Error querying categories:", err);
    } finally {
        await pool.end();
    }
}

main();
