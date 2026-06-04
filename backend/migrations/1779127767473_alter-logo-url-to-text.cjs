/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
module.exports = {
    up: (pgm) => {
        pgm.alterColumn("users", "logo_url", {
            type: "text",
        });
    },

    down: (pgm) => {
        pgm.alterColumn("users", "logo_url", {
            type: "varchar(255)",
        });
    },
};
