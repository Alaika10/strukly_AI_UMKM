import pool from "../config/db.js";

export const calculateTax = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      SUM(amount) AS total_income,
      COUNT(DISTINCT DATE_TRUNC('month', transaction_date)) AS active_months
    FROM transactions
    WHERE user_id = $1 
      AND type = 'income'
      AND is_deleted = FALSE
    `,
        [userId],
    );

    const total_income = Number(result.rows[0].total_income) || 0;
    let active_months = Number(result.rows[0].active_months) || 1;
    if (active_months === 0) active_months = 1;

    const monthly_average_income = total_income / active_months;
    const estimated_yearly_revenue = monthly_average_income * 12;
    const estimated_tax = estimated_yearly_revenue * 0.005;

    let status = "normal";
    let message = "Estimasi omzet tahunan di bawah Rp100 juta.";
    if (estimated_yearly_revenue > 100000000) {
        status = "warning";
        message = "Estimasi omzet tahunan melebihi Rp100 juta.";
    }

    return {
        total_income,
        monthly_average_income,
        estimated_yearly_revenue,
        estimated_tax,
        status,
        message
    };
};
