import pool from "./src/config/db.js";

async function addPajak() {
    try {
        console.log("Adding Pajak category...");
        const res = await pool.query(
            "INSERT INTO categories (name, type) VALUES ('Pajak', 'expense') ON CONFLICT (name) DO NOTHING RETURNING id;"
        );
        console.log("Result:", res.rows);
        
        const all = await pool.query("SELECT * FROM categories;");
        console.log("All categories:", all.rows);
        
        // Update all previous transactions that were Pajak (Bahan Baku + merchant='Pajak PPh Final 0.5%')
        // Find the Pajak category ID
        const pajakId = all.rows.find(c => c.name === 'Pajak')?.id;
        if (pajakId) {
            console.log("Pajak ID is", pajakId, "Updating past transactions...");
            const upd = await pool.query("UPDATE transactions SET category_id = $1 WHERE merchant = 'Pajak PPh Final 0.5%'", [pajakId]);
            console.log("Updated rows:", upd.rowCount);
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        pool.end();
    }
}

addPajak();
