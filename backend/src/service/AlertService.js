export const generateAlerts = ({
    current_profit,
    forecast_profit,
    estimated_tax,
}) => {
    const alerts = [];

    if (current_profit < 0) {
        alerts.push({
            type: "danger",
            message: "Usaha Anda sedang merugi",
        });
    }

    if (forecast_profit < 0) {
        alerts.push({
            type: "warning",
            message: "Diprediksi usaha akan merugi ke depan",
        });
    }

    if (estimated_tax > 1000) {
        alerts.push({
            type: "info",
            message: "Pajak Anda cukup besar, perhatikan kewajiban pajak",
        });
    }

    if (alerts.length === 0) {
        alerts.push({
            type: "success",
            message: "Kondisi usaha stabil",
        });
    }

    return alerts;
};
