/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addColumn("transactions", {
        confidence: {
            type: "double precision",
            notNull: false,
        },
        need_review: {
            type: "boolean",
            notNull: true,
            default: false,
        },
        raw_text: {
            type: "text",
            notNull: false,
        },
        cleaned_text: {
            type: "text",
            notNull: false,
        },
        items: {
            type: "jsonb",
            notNull: false,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropColumn("transactions", "confidence");
    pgm.dropColumn("transactions", "need_review");
    pgm.dropColumn("transactions", "raw_text");
    pgm.dropColumn("transactions", "cleaned_text");
    pgm.dropColumn("transactions", "items");
};
