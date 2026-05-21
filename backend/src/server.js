import dotenv from "dotenv";
dotenv.config(); 

import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB connected:", res.rows[0]);
} catch (err) {
    console.error("DB error:", err);
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
