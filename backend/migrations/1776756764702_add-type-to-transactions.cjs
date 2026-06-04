/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
module.exports = {
    up: (pgm) => {
        pgm.addColumn("transactions", {
            type: {
                type: "varchar(10)",
                notNull: true,
                default: "expense",
            },
        });
    },

    down: (pgm) => {
        pgm.dropColumn("transactions", "type");
    },
};