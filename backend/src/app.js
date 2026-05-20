import express from "express";
import cors from "cors";

import authRoutes from "./routes/Auth.Routes.js";
import transactionRoutes from "./routes/Transaction.Routes.js";
import dashboardRoutes from "./routes/Dashboard.Routes.js";
import taxRoutes from "./routes/Tax.Routes.js";
import riskRoutes from "./routes/Risk.Routes.js";
import forecastRoutes from "./routes/Forecast.Routes.js";
import insightRoutes from "./routes/Insight.Routes.js";
import alertRoutes from "./routes/Alert.Routes.js";
import settingsRoutes from "./routes/Settings.Routes.js";
import notificationRoutes from "./routes/Notification.Routes.js";
import morgan from "morgan";


const app = express();
app.use(morgan("dev")); 

const logger = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const statusColor =
            res.statusCode >= 500
                ? "\x1b[31m" // merah
                : res.statusCode >= 400
                  ? "\x1b[33m" // kuning
                  : res.statusCode >= 300
                    ? "\x1b[36m" // cyan
                    : "\x1b[32m"; // hijau

        console.log(
            `[${timestamp}] ${req.method} ${req.originalUrl} ${statusColor}${res.statusCode}\x1b[0m - ${duration}ms`,
        );
    });

    next();
};

app.use(logger);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/insight", insightRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);


export default app;
