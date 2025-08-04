import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
export const alters = sqliteTable("alters", {
    id: integer().primaryKey().notNull(),
    name: text().notNull(),
    age: integer(),
    role: text(),
    disorderId: integer("disorder_id").references(() => disorders.id),
});
export const crisisPlans = sqliteTable("crisis_plans", {
    id: integer().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    disorderId: integer("disorder_id").references(() => disorders.id),
});
export const disorders = sqliteTable("disorders", {
    id: integer().primaryKey().notNull(),
    name: text().notNull(),
    acronym: text().notNull(),
    fullName: text("full_name").notNull(),
});
export const entries = sqliteTable("entries", {
    id: integer().primaryKey().notNull(),
    title: text(),
    content: text(),
    date: text().notNull(),
    disorderId: integer("disorder_id").references(() => disorders.id),
});
export const medications = sqliteTable("medications", {
    id: integer().primaryKey().notNull(),
    name: text().notNull(),
    dosage: text(),
    frequency: text(),
    prescribedDate: text("prescribed_date").notNull(),
    isActive: integer("is_active", { mode: 'boolean' }).default(true).notNull(),
});
export const medicationLogs = sqliteTable("medication_logs", {
    id: integer('id').primaryKey(),
    medicationId: integer('medication_id').notNull().references(() => medications.id),
    date: text('date').notNull(),
    doseTaken: text('dose_taken'),
    notes: text('notes'),
});
export const switches = sqliteTable("switches", {
    id: integer('id').primaryKey(),
    fromAlterId: integer("from_alter_id").references(() => alters.id), // Changed
    toAlterId: integer("to_alter_id").notNull().references(() => alters.id), // Changed
    notes: text("notes"),
    date: text("date").notNull(),
    disorderId: integer("disorder_id").references(() => disorders.id),
});
export const symptoms = sqliteTable("symptoms", {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    severity: text('severity'), // We'll treat this as a string for now (e.g., "Mild", "7/10")
    notes: text('notes'),
    disorderId: integer("disorder_id").notNull().references(() => disorders.id),
});
export const therapySessions = sqliteTable("therapy_sessions", {
    id: integer('id').primaryKey(),
    date: text('date').notNull(),
    therapistName: text("therapist_name").notNull(),
    notes: text('notes'),
    disorderId: integer("disorder_id").notNull().references(() => disorders.id),
});
export const treatmentPlans = sqliteTable("treatment_plans", {
    id: integer().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    startDate: text("start_date").notNull(),
    disorderId: integer("disorder_id").references(() => disorders.id),
});
//# sourceMappingURL=schema.js.map