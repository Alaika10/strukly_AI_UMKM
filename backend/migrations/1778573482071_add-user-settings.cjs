/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
module.exports = {
    up: (pgm) => {
        pgm.addColumns("users", {
            business_name: { type: "varchar(100)" },
            business_category: { type: "varchar(50)" },
            logo_url: { type: "varchar(255)" },
            two_factor_enabled: { type: "boolean", default: false },
            notif_stock_reminder: { type: "boolean", default: true },
            notif_daily_summary: { type: "boolean", default: true },
            notif_tax_reminder: { type: "boolean", default: true },
            notif_monthly_report: { type: "boolean", default: true },
        });
    },

    down: (pgm) => {
        pgm.dropColumns("users", [
            "business_name",
            "business_category",
            "logo_url",
            "two_factor_enabled",
            "notif_stock_reminder",
            "notif_daily_summary",
            "notif_tax_reminder",
            "notif_monthly_report",
        ]);
    },
};
