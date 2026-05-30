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
    pgm.sql(`
        UPDATE transactions 
        SET category_id = (SELECT id FROM categories WHERE name = 'Belum Dikategorikan' LIMIT 1) 
        WHERE category_id = (SELECT id FROM categories WHERE name = 'Pajak' LIMIT 1) 
          AND merchant NOT ILIKE '%pajak%' 
          AND source = 'ocr';
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    // No specific down migration to restore wrongly categorized transactions to Pajak
    // as it's impossible to distinguish which were intentionally set to Belum Dikategorikan 
    // versus reverted. We just leave them as Belum Dikategorikan.
};
