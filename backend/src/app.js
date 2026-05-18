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



const app = express();

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
