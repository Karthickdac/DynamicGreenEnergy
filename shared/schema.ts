import { sql } from "drizzle-orm";
import { pgTable, text, varchar, doublePrecision, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const quotations = pgTable("quotations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: text("number").notNull().unique(),
  type: text("type").notNull().default("BOS Supply"),
  customerName: text("customer_name").notNull(),
  createdDate: text("created_date").notNull(),
  validUntil: text("valid_until").notNull(),
  status: text("status").notNull().default("draft"),
  notes: text("notes"),
});

export const quotationItems = pgTable("quotation_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationId: varchar("quotation_id").notNull(),
  itemName: text("item_name").notNull(),
  qty: doublePrecision("qty").notNull().default(1),
  unit: text("unit").notNull().default("nos"),
  rate: doublePrecision("rate").notNull().default(0),
  discountPercent: doublePrecision("discount_percent").notNull().default(0),
  gstPercent: doublePrecision("gst_percent").notNull().default(18),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertQuotationSchema = createInsertSchema(quotations).omit({ id: true });
export const insertQuotationItemSchema = createInsertSchema(quotationItems).omit({ id: true });

export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = typeof quotations.$inferSelect;
export type InsertQuotationItem = z.infer<typeof insertQuotationItemSchema>;
export type QuotationItem = typeof quotationItems.$inferSelect;

export type QuotationWithItems = Quotation & { items: QuotationItem[] };
