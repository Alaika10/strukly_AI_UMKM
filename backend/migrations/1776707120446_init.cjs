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
        // USERS
        pgm.createTable("users", {
            id: "id",
            name: { type: "varchar(100)", notNull: true },
            email: { type: "varchar(100)", unique: true, notNull: true },
            password: { type: "varchar(255)", notNull: true },
            created_at: {
                type: "timestamp",
                default: pgm.func("current_timestamp"),
            },
        });

        // CATEGORIES
        pgm.createTable("categories", {
            id: "id",
            name: { type: "varchar(50)", notNull: true },
        });

        // TRANSACTIONS
        pgm.createTable("transactions", {
            id: "id",

            user_id: {
                type: "integer",
                notNull: true,
                references: "users",
                onDelete: "cascade",
            },

            category_id: {
                type: "integer",
                notNull: true,
                references: "categories",
            },

            amount: {
                type: "numeric",
                notNull: true,
            },

            merchant: {
                type: "varchar(100)",
            },

            transaction_date: {
                type: "date",
                notNull: true,
            },

            source: {
                type: "varchar(10)", // manual / auto
            },

            is_edited: {
                type: "boolean",
                default: false,
            },

            is_deleted: {
                type: "boolean",
                default: false,
            },

            created_at: {
                type: "timestamp",
                default: pgm.func("current_timestamp"),
            },

            updated_at: {
                type: "timestamp",
                default: pgm.func("current_timestamp"),
            },
        });
    },

    down: (pgm) => {
        pgm.dropTable("transactions");
        pgm.dropTable("categories");
        pgm.dropTable("users");
    },
};