/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
module.exports = {
    up: (pgm) => {
        pgm.createTable("notifications", {
            id: "id",
            user_id: {
                type: "integer",
                notNull: true,
                references: "users",
                onDelete: "cascade",
            },
            type: { type: "varchar(50)", notNull: true },
            message: { type: "text", notNull: true },
            is_read: { type: "boolean", default: false },
            created_at: {
                type: "timestamp",
                default: pgm.func("current_timestamp"),
            },
        });
    },

    down: (pgm) => {
        pgm.dropTable("notifications");
    },
};
