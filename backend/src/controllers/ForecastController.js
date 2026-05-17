import { getDailyIncome, getDailyExpense } from "../models/ForecastModel.js";

import { calculateForecast } from "../service/ForecastService.js";

export const forecast = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.user_id;

        const incomeData = await getDailyIncome(userId);
        const expenseData = await getDailyExpense(userId);

        const result = calculateForecast(incomeData, expenseData);

        res.json({
            income_history: incomeData,
            expense_history: expenseData,
            ...result,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
