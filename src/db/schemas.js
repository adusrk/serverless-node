const { text, timestamp, pgTable} = require("drizzle-orm/pg-core");
const {serial} = require("drizzle-orm/mysql-core")
const LeadTable = pgTable('leads', {
    email: text('email'),
    createdAt: timestamp('created_at').defaultNow(),
    id: serial('id').primaryKey().notNull(),
});

module.exports.LeadTable = LeadTable