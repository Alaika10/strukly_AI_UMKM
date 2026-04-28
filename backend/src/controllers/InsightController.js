import { getDailyIncome, getDailyExpense } from "../models/ForecastModel.js";
import { calculateForecast } from "../service/ForecastService.js";
import { generateInsight } from "../service/InsightService.js";
import pool from "../config/db.js";

export const insight = async (req, res) => {
    try {
        const userId = req.query.user_id;

        // current profit
        const current = await pool.query(
            `
      SELECT 
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE user_id = $1 AND is_deleted = FALSE
      `,
            [userId],
        );

        const income = Number(current.rows[0].income) || 0;
        const expense = Number(current.rows[0].expense) || 0;
        const currentProfit = income - expense;

        // forecast
        const incomeData = await getDailyIncome(userId);
        const expenseData = await getDailyExpense(userId);

        const forecast = calculateForecast(incomeData, expenseData);

        const insightResult = generateInsight({
            current_profit: currentProfit,
            forecast_profit: forecast.estimated_profit,
            estimated_tax: forecast.estimated_tax,
        });

        res.json({
            current: {
                income,
                expense,
                profit: currentProfit,
            },
            forecast,
            insight: insightResult,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
