export const generateInsight = ({
    current_profit,
    forecast_profit,
    estimated_tax,
}) => {
    let status = "";
    let message = "";

    if (current_profit <= 0) {
        status = "RUGI";
        message = "Usaha Anda sedang merugi. Perlu evaluasi pengeluaran.";
    } else if (forecast_profit <= 0) {
        status = "RAWAN";
        message =
            "Usaha masih untung, tapi berisiko rugi ke depan. Perhatikan tren pengeluaran.";
    } else {
        status = "AMAN";
        message = "Kondisi usaha stabil dan menguntungkan.";
    }

    return {
        status,
        message,
        estimated_tax,
    };
};
